package com.usermicroservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.usermicroservice.DTO.LoginRequestDTO;
import com.usermicroservice.DTO.LoginResponseDTO;
import com.usermicroservice.DTO.RegisterRequestDTO;
import com.usermicroservice.DTO.UserResponseDTO;
import com.usermicroservice.db.UserRepository;
import com.usermicroservice.entities.User;
import com.usermicroservice.exception.BadRequestException;
import com.usermicroservice.feign.AuditlogFeign;
import com.usermicroservice.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditlogFeign auditFeign;

    // ✅ REGISTER
    public UserResponseDTO register(RegisterRequestDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            tryLog(() -> auditFeign.log("AUTH.REGISTER_FAILED", 0));
            throw new BadRequestException("Email already registered: " + dto.getEmail());
        }

        User user = new User();
        user.setUserName(dto.getUserName());
        user.setUserEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setUserRole(dto.getRole());
        user.setUserPhone(dto.getPhoneNumber());

        User saved = userRepository.save(user);

        tryLog(() -> auditFeign.log(
                "AUTH.REGISTER_SUCCESS | UserID: " + saved.getUserId(),
                saved.getUserId()
        ));

        UserResponseDTO response = new UserResponseDTO();
        response.setUserId(saved.getUserId());
        response.setUserName(saved.getUserName());
        response.setEmail(saved.getUserEmail());
        response.setRole(saved.getUserRole());
        response.setPhoneNumber(saved.getUserPhone());

        return response;
    }

    // ✅ LOGIN
    public LoginResponseDTO login(LoginRequestDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail()).orElse(null);

        if (user == null) {
            tryLog(() -> auditFeign.log("AUTH.LOGIN_FAILED", 0));
            throw new BadRequestException("Invalid email");
        }

        if ("REJECT".equalsIgnoreCase(user.getStatus())) {
            tryLog(() -> auditFeign.log("AUTH.LOGIN_FAILED", user.getUserId()));
            throw new BadRequestException("Admin not approved");
        }

        if ("PENDING".equalsIgnoreCase(user.getStatus())) {
            tryLog(() -> auditFeign.log("AUTH.LOGIN_FAILED", user.getUserId()));
            throw new BadRequestException("Account pending approval");
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            tryLog(() -> auditFeign.logFailure("AUTH.LOGIN", "Wrong password"));
            throw new BadRequestException("Password Invalid");
        }

        String token = jwtUtil.generateToken(user.getUserEmail(), user.getUserRole());

        tryLog(() -> auditFeign.log(
                "AUTH.LOGIN_SUCCESS | Email: " + user.getUserEmail(),
                user.getUserId()
        ));

        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setEmail(user.getUserEmail());
        response.setRole(user.getUserRole());
        response.setUserName(user.getUserName());
        response.setUserId(user.getUserId());

        return response;
    }

    // ✅ UPDATE PASSWORD
    public String updatePassword(String email, String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException(
                        "No account found with email: " + email));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tryLog(() -> auditFeign.log(
                "AUTH.PASSWORD_UPDATED | Email: " + email,
                user.getUserId()
        ));

        return "Password updated successfully";
    }

    // ✅ Helper — swallows audit failures so main flow is never broken
    private void tryLog(Runnable auditCall) {
        try {
            auditCall.run();
        } catch (Exception e) {
            System.err.println("Audit log failed (non-critical): " + e.getMessage());
        }
    }
}