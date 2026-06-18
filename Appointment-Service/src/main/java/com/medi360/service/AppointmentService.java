package com.medi360.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medi360.DTO.AppointmentWithDetailsDTO;
import com.medi360.DTO.DoctorDTO;
import com.medi360.DTO.DoctorResponseDTO;
import com.medi360.DTO.NotificationDTO;
import com.medi360.DTO.PatientDTO;
import com.medi360.DTO.PatientResponseDTO;
import com.medi360.client.DoctorClient;
import com.medi360.client.NotificationClient;
import com.medi360.client.PatientClient;
import com.medi360.db.AppointmentRepository;
import com.medi360.entities.Appointment;
import com.medi360.exception.AppointmentNotFoundException;
import com.medi360.exception.DoctorNotFoundException;
import com.medi360.exception.ExternalServiceException;
import com.medi360.exception.PatientNotFoundException;
import com.medi360.exception.SlotNotAvailableException;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientClient patientClient;
    private final DoctorClient doctorClient;
    private final NotificationClient notificationClient;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientClient patientClient,
                              DoctorClient doctorClient,
                              NotificationClient notificationClient) {
        this.appointmentRepository = appointmentRepository;
        this.patientClient = patientClient;
        this.doctorClient = doctorClient;
        this.notificationClient = notificationClient;
    }

    private void sendNotification(int userId, String message, String category) {
        try {
            NotificationDTO dto = new NotificationDTO();
            dto.setUserID(userId);
            dto.setMessage(message);
            dto.setCategory(category);
            dto.setStatus("UNREAD");
            notificationClient.addNotification(dto);
        } catch (Exception e) {
            System.err.println("Notification failed for userId " + userId + ": " + e.getMessage());
        }
    }

    private DoctorDTO mapDoctor(DoctorResponseDTO resp) {
        if (resp == null || resp.getDoctor() == null) return null;
        DoctorDTO doc = new DoctorDTO();
        doc.setId(resp.getDoctor().getId());
        doc.setName(resp.getDoctor().getName());
        doc.setDepartment(resp.getDoctor().getDepartment());
        doc.setAvailabilitySchedule(resp.getDoctor().getAvailabilitySchedule());
        doc.setEmail(resp.getDoctor().getEmail());
        return doc;
    }

    private AppointmentWithDetailsDTO buildDTO(Appointment appt) {
        AppointmentWithDetailsDTO dto = new AppointmentWithDetailsDTO();
        dto.setId(appt.getId());
        dto.setDate(appt.getDate());
        dto.setTime(appt.getTime());
        dto.setDurationMinutes(appt.getDurationMinutes());
        dto.setStatus(appt.getStatus());
        dto.setReason(appt.getReason());

        try {
            PatientResponseDTO resp = patientClient.getPatientById(appt.getPatientId());
            if (resp != null) dto.setPatient(resp.getPatient());
        } catch (Exception e) {
            PatientDTO p = new PatientDTO();
            p.setPatientId(appt.getPatientId());
            p.setPatientName("Unknown");
            dto.setPatient(p);
        }

        try {
            DoctorResponseDTO resp = doctorClient.getDoctorById(appt.getDoctorId());
            if (resp != null) dto.setDoctor(mapDoctor(resp));
        } catch (Exception e) {
            DoctorDTO d = new DoctorDTO();
            d.setId(appt.getDoctorId());
            d.setName("Unknown");
            dto.setDoctor(d);
        }

        return dto;
    }

    private boolean isDoctorAvailable(DoctorDTO doctor, LocalTime time) {
        if (doctor.getAvailabilitySchedule() == null) return false;
        String[] range = doctor.getAvailabilitySchedule().split("-");
        LocalTime start = LocalTime.parse(range[0]);
        LocalTime end = LocalTime.parse(range[1]);
        return !time.isBefore(start) && !time.isAfter(end);
    }

    private boolean overlaps(LocalTime s1, LocalTime e1, LocalTime s2, LocalTime e2) {
        return s1.isBefore(e2) && s2.isBefore(e1);
    }

    private LocalDateTime findNextAvailableSlot(int doctorId, String availability,
            LocalDate requestedDate, LocalTime requestedStart,
            int durationMinutes, int excludeId, int maxDaysAhead) {

        String[] range = availability.split("-");
        LocalTime dayStart = LocalTime.parse(range[0]);
        LocalTime dayEnd = LocalTime.parse(range[1]);

        for (int d = 0; d <= maxDaysAhead; d++) {
            LocalDate date = requestedDate.plusDays(d);
            LocalTime candidate = (d == 0 && requestedStart.isAfter(dayStart))
                    ? requestedStart : dayStart;

            while (!candidate.plusMinutes(durationMinutes).isAfter(dayEnd)) {
                LocalTime candidateEnd = candidate.plusMinutes(durationMinutes);
                boolean conflict = false;

                List<Appointment> existing = appointmentRepository
                        .findByDoctorIdAndDateOrderByTimeAsc(doctorId, date);

                for (Appointment a : existing) {
                    if (a.getId() == excludeId) continue;
                    LocalTime exEnd = a.getTime().plusMinutes(a.getDurationMinutes());
                    if (overlaps(candidate, candidateEnd, a.getTime(), exEnd)) {
                        conflict = true;
                        candidate = exEnd;
                        break;
                    }
                }

                if (!conflict) return LocalDateTime.of(date, candidate);
            }
        }
        return null;
    }

    @Transactional
    public Appointment addAppointment(Appointment appointment)
            throws PatientNotFoundException, DoctorNotFoundException, SlotNotAvailableException {

        PatientDTO patient;
        try {
            PatientResponseDTO resp = patientClient.getPatientById(appointment.getPatientId());
            patient = (resp != null) ? resp.getPatient() : null;
        } catch (Exception e) {
            throw new ExternalServiceException("Patient service unavailable");
        }
        if (patient == null) {
            throw new PatientNotFoundException("Patient not found with id " + appointment.getPatientId());
        }

        DoctorDTO doctor;
        try {
            DoctorResponseDTO resp = doctorClient.getDoctorById(appointment.getDoctorId());
            doctor = mapDoctor(resp);
        } catch (Exception e) {
            throw new ExternalServiceException("Doctor service unavailable");
        }
        if (doctor == null) {
            throw new DoctorNotFoundException("Doctor not found with id " + appointment.getDoctorId());
        }

        if (!isDoctorAvailable(doctor, appointment.getTime())) {
            throw new SlotNotAvailableException("Doctor is not available at this time. "
                    + "Working hours: " + doctor.getAvailabilitySchedule());
        }

        LocalDateTime slot = findNextAvailableSlot(
                appointment.getDoctorId(), doctor.getAvailabilitySchedule(),
                appointment.getDate(), appointment.getTime(),
                appointment.getDurationMinutes(), -1, 3);

        if (slot == null) {
            throw new SlotNotAvailableException("No available slot for this doctor");
        }

        appointment.setStatus("BOOKED");

        if (!slot.toLocalTime().equals(appointment.getTime()) ||
            !slot.toLocalDate().equals(appointment.getDate())) {
            appointment.setTime(slot.toLocalTime());
            appointment.setDate(slot.toLocalDate());
            appointment.setStatus("RESCHEDULED");
        }

        Appointment saved = appointmentRepository.save(appointment);

        String bookMsg = String.format(
            "New appointment booked — Patient: %s on %s at %s.%s",
            patient.getPatientName(), saved.getDate(), saved.getTime(),
            saved.getStatus().equals("RESCHEDULED")
                ? " (Original slot was taken — rescheduled automatically)" : "");
        sendNotification(appointment.getDoctorId(), bookMsg, "APPOINTMENT");

        return saved;
    }

    @Transactional
    public Appointment updateAppointment(Appointment updated)
            throws AppointmentNotFoundException, PatientNotFoundException,
                   DoctorNotFoundException, SlotNotAvailableException {

        Appointment existing = appointmentRepository.findById(updated.getId())
                .orElseThrow(() -> new AppointmentNotFoundException(
                        "Appointment not found with id " + updated.getId()));

        int patientId = updated.getPatientId();
        int doctorId = updated.getDoctorId();

        PatientResponseDTO presp = patientClient.getPatientById(patientId);
        if (presp == null || presp.getPatient() == null) {
            throw new PatientNotFoundException("Patient not found with id " + patientId);
        }
        

        DoctorResponseDTO dresp = doctorClient.getDoctorById(doctorId);
        if (dresp == null || dresp.getDoctor() == null) {
            throw new DoctorNotFoundException("Doctor not found with id " + doctorId);
        }
        DoctorDTO doctor = mapDoctor(dresp);

        existing.setPatientId(patientId);
        existing.setDoctorId(doctorId);
        existing.setDurationMinutes(updated.getDurationMinutes());
        existing.setReason(updated.getReason());

        String status = updated.getStatus();

        if ("CANCELLED".equalsIgnoreCase(status) ||
            "RESCHEDULED".equalsIgnoreCase(status)) {

            if (updated.getReason() == null || updated.getReason().trim().isEmpty()) {
                throw new SlotNotAvailableException("Reason is required");
            }
        }

        if ("COMPLETED".equalsIgnoreCase(status)) {
            existing.setStatus("COMPLETED");
            existing.setDate(updated.getDate());
            existing.setTime(updated.getTime());
            return appointmentRepository.save(existing);
        }

        if ("CANCELLED".equalsIgnoreCase(status)) {
            existing.setStatus("CANCELLED");
            existing.setDate(updated.getDate());
            existing.setTime(updated.getTime());
            return appointmentRepository.save(existing);
        }

        if (!isDoctorAvailable(doctor, updated.getTime())) {
            throw new SlotNotAvailableException(
                    "Doctor not available at " + updated.getTime());
        }

        List<Appointment> existingOnDay = appointmentRepository
                .findByDoctorIdAndDateOrderByTimeAsc(doctorId, updated.getDate());

        for (Appointment a : existingOnDay) {
            if (a.getId() == existing.getId()) continue;

            LocalTime exEnd = a.getTime().plusMinutes(a.getDurationMinutes());
            LocalTime newEnd = updated.getTime().plusMinutes(updated.getDurationMinutes());

            if (overlaps(updated.getTime(), newEnd, a.getTime(), exEnd)) {
                throw new SlotNotAvailableException("Slot already booked");
            }
        }

        existing.setStatus("RESCHEDULED");
        existing.setDate(updated.getDate());
        existing.setTime(updated.getTime());

        return appointmentRepository.save(existing);
    }

    @Transactional
    public void deleteAppointment(int id) throws AppointmentNotFoundException {
        Appointment a = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException(
                        "Appointment not found with id " + id));
        appointmentRepository.delete(a);
    }

    public Appointment getAppointmentById(int id) throws AppointmentNotFoundException {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException(
                        "Appointment not found with id " + id));
    }

    public List<AppointmentWithDetailsDTO> getAllAppointmentsWithDetails() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::buildDTO)
                .collect(Collectors.toList());
    }

    public Page<Appointment> getAllAppointmentsWithPagination(Pageable pageable) {
        return appointmentRepository.findAll(pageable);
    }

    public List<AppointmentWithDetailsDTO> getAppointmentsByDoctorIdWithDetails(int doctorId)
            throws DoctorNotFoundException {
        try {
            DoctorResponseDTO resp = doctorClient.getDoctorById(doctorId);
            if (resp == null || resp.getDoctor() == null) {
                throw new DoctorNotFoundException("Doctor not found with id " + doctorId);
            }
        } catch (DoctorNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new ExternalServiceException("Doctor service unavailable");
        }
        return appointmentRepository.findByDoctorIdOrderByDateAscTimeAsc(doctorId)
                .stream()
                .map(this::buildDTO)
                .collect(Collectors.toList());
    }

    public List<Appointment> getAppointmentsByDoctorAndDate(int doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndDateOrderByTimeAsc(doctorId, date);
    }
    
    public AppointmentWithDetailsDTO getAppointmentByIdWithDetails(int id)
            throws AppointmentNotFoundException {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException(
                        "Appointment not found with id " + id));
        return buildDTO(appt);
    }

    public Page<AppointmentWithDetailsDTO> getAllAppointmentsWithDetailsPaginated(Pageable pageable) {
        return appointmentRepository.findAll(pageable)
                .map(this::buildDTO);
    }
}