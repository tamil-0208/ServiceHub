package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.UserRequest;
import com.Hypermarketplace.backend.dto.UserResponse;
import com.Hypermarketplace.backend.model.User;
import com.Hypermarketplace.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse createUser(UserRequest request) {

    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already registered");
    }

    String encodedPassword =
            passwordEncoder.encode(request.getPassword());

    User user = new User(
            request.getName(),
            request.getEmail(),
            encodedPassword,
            "CUSTOMER"
    );

    User savedUser = userRepository.save(user);

    return new UserResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole()
    );
}

}