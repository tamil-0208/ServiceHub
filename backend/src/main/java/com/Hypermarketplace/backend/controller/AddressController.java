package com.Hypermarketplace.backend.controller;

import com.Hypermarketplace.backend.dto.AddressRequest;
import com.Hypermarketplace.backend.dto.AddressResponse;
import com.Hypermarketplace.backend.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest request,
            Authentication authentication) {

        String userId = authentication.getName();
        AddressResponse response = addressService.createAddress(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<AddressResponse>> getMyAddresses(Authentication authentication) {
        String userId = authentication.getName();
        List<AddressResponse> addresses = addressService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable String id,
            @Valid @RequestBody AddressRequest request,
            Authentication authentication) {

        String userId = authentication.getName();
        AddressResponse response = addressService.updateAddress(userId, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable String id,
            Authentication authentication) {

        String userId = authentication.getName();
        addressService.deleteAddress(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<AddressResponse> setDefaultAddress(
            @PathVariable String id,
            Authentication authentication) {

        String userId = authentication.getName();
        AddressResponse response = addressService.setDefaultAddress(userId, id);
        return ResponseEntity.ok(response);
    }
}
