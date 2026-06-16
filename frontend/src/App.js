import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompleteProfile from './components/Dashboards/CompleteProfile';
 
// Appointment
import AppointmentHome from './components/appointment/AppointmentHome';
import AddAppointment from './components/appointment/AddAppointment';
import DeleteAppointment from './components/appointment/DeleteAppointment';
import UpdateAppointment from './components/appointment/UpdateAppointment';
import FindAppointment from './components/appointment/FindAppointment';
import DisplayAppointments from './components/appointment/DisplayAppointments';
import DisplayAppointmentsPaginated from './components/appointment/DisplayAppointmentsPaginated';
 
// Doctor Imports
import DoctorHome from './components/doctor/DoctorHome';
import AddDoctor from './components/doctor/AddDoctor';
import DeleteDoctor from './components/doctor/DeleteDoctor';
import UpdateDoctor from './components/doctor/UpdateDoctor';
import FindDoctor from './components/doctor/FindDoctor';
import DisplayDoctors from './components/doctor/DisplayDoctors';
import DisplayDoctorsPaginated from './components/doctor/DisplayDoctorsPaginated';
 
 
// Patient
import PatientHome from './components/patient/PatientHome';
import AddPatient from './components/patient/AddPatient';
import DeletePatient from './components/patient/DeletePatient';
import UpdatePatient from './components/patient/UpdatePatient';
import FindPatient from './components/patient/FindPatient';
import DisplayPatients from './components/patient/DisplayPatients';
import DisplayPatientsPaginated from './components/patient/DisplayPatientsPaginated';
 
// Invoice
import InvoiceHome from './components/invoice/InvoiceHome';
import AddInvoice from './components/invoice/AddInvoice';
import DeleteInvoice from './components/invoice/DeleteInvoice';
import UpdateInvoice from './components/invoice/UpdateInvoice';
import FindInvoice from './components/invoice/FindInvoice';
import DisplayInvoices from './components/invoice/DisplayInvoices';
import DisplayInvoicesPaginated from './components/invoice/DisplayInvoicesPaginated';
 
// Insurance Claim
import InsuranceClaimHome from './components/insurance_claim/InsuranceClaimHome';
import AddInsuranceClaim from './components/insurance_claim/AddInsuranceClaim';
import DeleteInsuranceClaim from './components/insurance_claim/DeleteInsuranceClaim';
import UpdateInsuranceClaim from './components/insurance_claim/UpdateInsuranceClaim';
import FindInsuranceClaim from './components/insurance_claim/FindInsuranceClaim';
import DisplayInsuranceClaims from './components/insurance_claim/DisplayInsuranceClaims';
import DisplayInsuranceClaimsPaginated from './components/insurance_claim/DisplayInsuranceClaimsPaginated';
 
// Compliance
import ComplianceReportHome from './components/compliance_report/ComplianceReportHome';
import AddCompliance from './components/compliance_report/AddCompliance';
import DeleteCompliance from './components/compliance_report/DeleteCompliance';
import UpdateCompliance from './components/compliance_report/UpdateCompliance';
import FindCompliance from './components/compliance_report/FindCompliance';
import DisplayCompliance from './components/compliance_report/DisplayCompliance';
import DisplayCompliancePaginated from './components/compliance_report/DisplayCompliancePaginated';
 
 
// KPI
 
import KpiReportHome from './components/kpi_report/KpiReportHome';
import AddKpi from './components/kpi_report/AddKpi';
import FindKpi from './components/kpi_report/FindKpi';
import DisplayKpi from './components/kpi_report/DisplayKpi';
import DisplayKpiPaginated from './components/kpi_report/DisplayKpiPaginated';
 
 
// User
import UserHome from './components/user/UserHome';
import AddUser from './components/user/AddUser';
import DeleteUser from './components/user/DeleteUser';
import UpdateUser from './components/user/UpdateUser';
import FindUser from './components/user/FindUser';
import MyProfile from './components/user/MyProfile';
import FindAllUser from './components/user/FindAllUser';
import UserPage from './components/user/UserPage';
 
// Auditlog
import AuditlogHome from './components/auditlog/AuditlogHome';
import FindAuditlog from './components/auditlog/FindAuditlog';
import AddAuditlog from './components/auditlog/AddAuditlog';
import FindAllAuditlog from './components/auditlog/FindAllAuditlog';
import AuditLogPage from './components/auditlog/AuditLogPage';
 
// Notification
import NotificationHome from './components/notification/NotificationHome';
import AddNotification from './components/notification/AddNotification';
import DeleteNotification from './components/notification/DeleteNotification';
import FindNotification from './components/notification/FindNotification';
import UpdateNotification from './components/notification/UpdateNotification';
import FindAllNotification from './components/notification/FindAllNotification';
import NotificationPage from './components/notification/NotificationPage'
 
// Bed
import BedHome from './components/bed/BedHome';
import AddBed from './components/bed/AddBed';
import DeleteBed from './components/bed/DeleteBed';
import FindBed from './components/bed/FindBed';
import UpdateBed from './components/bed/UpdateBed';
import FindAllBed from './components/bed/FindAllBed';
import AssignBed from './components/bed/AssignBed';
import DischargeBed from './components/bed/DischargeBed';
import PaginatedBed from './components/bed/PaginatedBed';
 
// Ward
import WardHome from './components/ward/WardHome';
import AddWard from './components/ward/AddWard';
import UpdateWard from './components/ward/UpdateWard';
import DeleteWard from './components/ward/DeleteWard';
import FindWard from './components/ward/FindWard';
import FindAllWard from './components/ward/FindAllWard';
import WardOccupancyReport from './components/ward/WardOccupancyReport';
import PaginatedWard from './components/ward/PaginatedWard';
 
// Authentication
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Auth/Home';
 
// Dashboards
import AdminDash from './components/Dashboards/AdminDash';
import ReceptionistDD from './components/Dashboards/ReceptionistDD';
import DoctorDD from './components/Dashboards/DoctorDD';
import NurseDD from './components/Dashboards/NurseDD';
import FinanceDD from './components/Dashboards/FinanceDD';
import ComplianceDD from './components/Dashboards/ComplianceDD';
 
 
// Nurse
import NurseHome from './components/Nurse/NurseHome';
import NurseDashboard from './components/Nurse/NurseDashboard';
import AddVitals from './components/Nurse/Vitals/AddVitals';
import ViewVitals from './components/Nurse/Vitals/ViewVitals';
import AddCareNote from './components/Nurse/CareNotes/AddCareNote';
import ViewCareNotes from './components/Nurse/CareNotes/ViewCareNotes';
import UserApproval from './components/user/UserApproval';
import PatientNotification from './components/patient/PatientNotification';
import DoctorNotification from './components/doctor/DoctorNotification';
import Userpage from './components/common/Userpage';
import Appointmentpage from './components/common/Appointmentpage';
import Bedpage from './components/common/Bedpage';
import Wardpage from './components/common/Wardpage';
import Doctorpage from './components/common/Doctorpage';
import Patientpage from './components/common/Patientpage';
import Auditpage from './components/common/Auditpage';
import Userapproval from './components/common/Userapproval';
import Notificationpage from './components/common/Notificationpage';
import Updatepassword from './components/Auth/Updatepassword';
import Doctorreg from './components/Auth/Doctorreg';
import EditDoctor from './components/doctor/EditDoctor';
 
function App() {
 
const ALL_ROLES        = ["ADMIN","DOCTOR","RECEPTIONIST","FINANCEOFFICER","COMPLIANCE_OFFICER","NURSE"];
const ADMIN_ONLY       = ["ADMIN"];
const ADMIN_DR  = ["ADMIN","DOCTOR","RECEPTIONIST"];
const ADMIN_NURSE    = ["ADMIN","NURSE"];
const ADMIN_COMPLIANCE = ["ADMIN","COMPLIANCE_OFFICER"];
const ADMIN_FINANCE    = ["ADMIN","FINANCEOFFICER"];
const ADMIN_RECEPTIONIST      = ["ADMIN","RECEPTIONIST", "DOCTOR"];
const ADMIN_DOCTOR      = ["ADMIN","DOCTOR"];
const FINANCE=["ADMIN","FINANCEOFFICER"];
const RECEPTIONIST_ONLY=["RECEPTIONIST"];
const DOCTOR_ONLY=["DOCTOR"];
const NURSE_ONLY=["NURSE"];
const FINANCEOFFICER_ONLY=["FINANCEOFFICER"];
const COMPLIANCE_ONLY=["COMPLIANCE_OFFICER"]
 
 
function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
 
    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
    return children;
  }
 
 
  function Unauthorized() {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <h3 className="text-danger">Access Denied</h3>
        <p className="text-muted">You don't have permission to view this page.</p>
        <button className="btn btn-primary mt-3" onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }
 
  return (
    <Router>
      <ToastContainer />
      <Routes>
 
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/login" element={<Login />} />
        <Route path="/updatepass" element={<Updatepassword />} />
        <Route path="/editprofile" element={<UpdateUser />} />
        <Route path="/notifications" element={<FindAllNotification />} />
        <Route path="/notificationd" element={<DoctorNotification />} />
        <Route path="/doctorreg" element={<Doctorreg />} />
        <Route path="/editdoctor" element={<EditDoctor />} />
 
        <Route  path="/admindd" element={<ProtectedRoute allowedRoles={ADMIN_ONLY}><AdminDash /></ProtectedRoute>}>
          <Route path="userp" element={<Userpage />}/>
          <Route path="patientp" element={<Patientpage />} />
          <Route path="doctorp" element={<Doctorpage />} />
          <Route path="appointmentp" element={<Appointmentpage />} />
          <Route path="bedp" element={<PaginatedBed />} />
          <Route path="wardp" element={<Wardpage />} />
          <Route path="adminp" element={<Auditpage />} />
          <Route path="userapproval" element={<Userapproval />} />
          <Route path="notificationp" element={<Notificationpage />} />
          <Route path="compliancep" element={<DisplayCompliancePaginated />} />
          <Route path="kpip"        element={<DisplayKpiPaginated />} />
         
        </Route>
        <Route path="/receptionistdd" element={<ProtectedRoute allowedRoles={RECEPTIONIST_ONLY}><ReceptionistDD /></ProtectedRoute>} />
        <Route path="/doctordd" element={<ProtectedRoute allowedRoles={DOCTOR_ONLY}><DoctorDD /></ProtectedRoute>} />
        <Route path="/complete-profile" element={<ProtectedRoute allowedRoles={DOCTOR_ONLY}><CompleteProfile /></ProtectedRoute>} />
        <Route path="/nursedd" element={<ProtectedRoute allowedRoles={NURSE_ONLY}><NurseDD /></ProtectedRoute>} />
        <Route path="/financedd" element={<ProtectedRoute allowedRoles={FINANCEOFFICER_ONLY}><FinanceDD /></ProtectedRoute>} />
        <Route path="/compilancedd" element={<ProtectedRoute allowedRoles={COMPLIANCE_ONLY}><ComplianceDD /></ProtectedRoute>} />
       
        <Route path="/profile" element={<ProtectedRoute allowedRoles={ALL_ROLES}><MyProfile /></ProtectedRoute>} />
 
        {}
        <Route path="/user" element={<ProtectedRoute allowedRoles={ADMIN_ONLY}><UserHome /></ProtectedRoute>}>
          <Route path="add" element={<AddUser />} />
          <Route path="delete/:id" element={<DeleteUser />} />
          <Route path="update/:id" element={<UpdateUser />} />
          <Route path="find" element={<FindUser />} />
          <Route path="findall" element={<FindAllUser />} />
          <Route path="paginated" element={<UserPage />} />
          <Route path="approval" element={<UserApproval />} />
        </Route>
       
        {}
        <Route path="/auditlog" element={<ProtectedRoute allowedRoles={ADMIN_ONLY}><AuditlogHome /></ProtectedRoute>}>
          <Route path="add" element={<AddAuditlog />} />
          <Route path="find" element={<FindAuditlog />} />
          <Route path="findall" element={<FindAllAuditlog />} />
          <Route path="paginated" element={<AuditLogPage />} />
        </Route>
 
        {}
        <Route path="/notification" element={<ProtectedRoute allowedRoles={ALL_ROLES}><NotificationHome /></ProtectedRoute>}>
          <Route path="add" element={<AddNotification />} />
          <Route path="update/:id" element={<UpdateNotification />} />
          <Route path="delete/:id" element={<DeleteNotification />} />
          <Route path="find" element={<FindNotification />} />
          <Route path="findall" element={<FindAllNotification />} />
          <Route path="paginated" element={<NotificationPage />} />
        </Route>
       
        {}
        <Route path="/appointment" element={<ProtectedRoute allowedRoles={ADMIN_DR}><AppointmentHome /></ProtectedRoute>}>
            <Route path="add" element={<AddAppointment/>}></Route>
            <Route path="delete/:aid" element={<DeleteAppointment/>}></Route>
            <Route path="edit/:aid" element={<UpdateAppointment />}></Route>
            <Route path="find" element={<FindAppointment />}></Route>
            <Route path="display" element={<DisplayAppointments />}></Route>
            <Route path="displayPaginated" element={<DisplayAppointmentsPaginated />} />
        </Route>
 
        {}
        <Route path="/doctor" element={<ProtectedRoute allowedRoles={ADMIN_DR}><DoctorHome /></ProtectedRoute>}>
          <Route path="delete/:id" element={<DeleteDoctor />} />
          <Route path="update/:id" element={<UpdateDoctor />} />
          <Route path="add" element={<AddDoctor />} />
          <Route path="find" element={<FindDoctor />} />
          <Route path="display" element={<DisplayDoctors />} />
          <Route path="displayPaginated" element={<DisplayDoctorsPaginated />} />
        </Route>
 
        {}
        <Route path="/patient" element={<ProtectedRoute allowedRoles={ADMIN_RECEPTIONIST}><PatientHome /></ProtectedRoute>}>
          <Route path="add" element={<AddPatient />} />
          <Route path="update/:pid" element={<UpdatePatient />} />
          <Route path="delete/:pid" element={<DeletePatient />} />
          <Route path="find" element={<FindPatient />} />
          <Route path="display" element={<DisplayPatients />} />
          <Route path="displayPaginated" element={<DisplayPatientsPaginated />} />
          <Route path="patientnotificaion" element={<PatientNotification />} />
        </Route>
 
        {}
        <Route path="/invoice" element={<ProtectedRoute allowedRoles={ADMIN_FINANCE}><InvoiceHome /></ProtectedRoute>}>
          <Route path="add" element={<AddInvoice />} />
          <Route path="update/:iid" element={<UpdateInvoice />} />
          <Route path="delete/:iid" element={<DeleteInvoice />} />
          <Route path="find" element={<FindInvoice />} />
          <Route path="display" element={<DisplayInvoices />} />
          <Route path="displayPaginated" element={<DisplayInvoicesPaginated />} />
        </Route>
 
        {}
        <Route path="/insuranceClaim" element={<ProtectedRoute allowedRoles={FINANCE}><InsuranceClaimHome /></ProtectedRoute>}>
          <Route path="add" element={<AddInsuranceClaim />} />
          <Route path="update/:claimId" element={<UpdateInsuranceClaim />} />
          <Route path="delete/:claimId" element={<DeleteInsuranceClaim />} />
          <Route path="find" element={<FindInsuranceClaim />} />
          <Route path="display" element={<DisplayInsuranceClaims />} />
          <Route path="displayPaginated" element={<DisplayInsuranceClaimsPaginated />} />
        </Route>
 
        {}
        <Route path="/compliance_report" element={<ProtectedRoute allowedRoles={ADMIN_COMPLIANCE}><ComplianceReportHome /></ProtectedRoute>}>
          <Route path="add" element={<AddCompliance />} />
          <Route path="update/:id" element={<UpdateCompliance />} />
          <Route path="delete/:id" element={<DeleteCompliance />} />
          <Route path="find" element={<FindCompliance />} />
          <Route path="display" element={<DisplayCompliance />} />
          <Route path="paginated" element={<DisplayCompliancePaginated />} />
        </Route>
 
        <Route path="/user" element={<ProtectedRoute allowedRoles={ADMIN_ONLY}><UserHome /></ProtectedRoute>}>
          <Route path="add" element={<AddUser />} />
          <Route path="delete/:id" element={<DeleteUser />} />
          <Route path="find" element={<FindUser />} />
          <Route path="findall" element={<FindAllUser />} />
          <Route path="paginated" element={<UserPage />} />
          <Route path="approval" element={<UserApproval />} />
        </Route>
 
        <Route path="/auditlog" element={<ProtectedRoute allowedRoles={ADMIN_ONLY}><AuditlogHome /></ProtectedRoute>}>
          <Route path="add" element={<AddAuditlog />} />
          <Route path="find" element={<FindAuditlog />} />
          <Route path="findall" element={<FindAllAuditlog />} />
          <Route path="paginated" element={<AuditLogPage />} />
        </Route>
        <Route path="/notification" element={<ProtectedRoute allowedRoles={ADMIN_DR}><FindAllNotification /></ProtectedRoute>}>
          <Route path="add" element={<AddNotification />} />
          <Route path="update/:id" element={<UpdateNotification />} />
          <Route path="delete/:id" element={<DeleteNotification />} />
          <Route path="find" element={<FindNotification />} />
          <Route path="findall" element={<FindAllNotification />} />
          <Route path="paginated" element={<NotificationPage />} />
        </Route>
 
        {}
        <Route path="/bed" element={<ProtectedRoute allowedRoles={ADMIN_NURSE}><BedHome /></ProtectedRoute>}>
          <Route path="add" element={<AddBed />} />
          <Route path="update/:bedId" element={<UpdateBed />} />
          <Route path="delete/:bedId" element={<DeleteBed />} />
          <Route path="find" element={<FindBed />} />
          <Route path="findAll" element={<FindAllBed />} />
          <Route path="assignBed" element={<AssignBed />} />
          <Route path="dischargeBed" element={<DischargeBed />} />
          <Route path="pages" element={<PaginatedBed />} />
        </Route>
 
        {}
        <Route path="/ward" element={<ProtectedRoute allowedRoles={ADMIN_NURSE}><WardHome /></ProtectedRoute>}>
          <Route path="add" element={<AddWard />} />
          <Route path="update/:wardId" element={<UpdateWard />} />
          <Route path="delete/:wardId" element={<DeleteWard />} />
          <Route path="find" element={<FindWard />} />
          <Route path="findAll" element={<FindAllWard />} />
          <Route path="occupancy" element={<WardOccupancyReport />} />
          <Route path="pages" element={<PaginatedWard />} />
        </Route>
 
        <Route path="/kpi_report" element={<ProtectedRoute allowedRoles={["ADMIN","FINANCEOFFICER","COMPLIANCE_OFFICER"]}><KpiReportHome /></ProtectedRoute>}>
          <Route path="add" element={<AddKpi />} />
          <Route path="find" element={<FindKpi />} />
          <Route path="display" element={<DisplayKpi />} />
          <Route path="displayPaginated" element={<DisplayKpiPaginated />} />
          </Route>
 
        {}
        <Route path="/nursedd" element={<ProtectedRoute allowedRoles={NURSE_ONLY}><NurseHome /></ProtectedRoute>}>
          <Route index element={<NurseDashboard />} />
          <Route path="dashboard" element={<NurseDashboard />} />
          <Route path="vitals/add" element={<AddVitals />} />
          <Route path="vitals/view" element={<ViewVitals />} />
          <Route path="carenotes/add" element={<AddCareNote />} />
          <Route path="carenotes/view" element={<ViewCareNotes />} />
        </Route>
 
      </Routes>
 
    </Router>
  );
}
 
export default App;
 
 