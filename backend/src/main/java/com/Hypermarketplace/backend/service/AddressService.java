package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.AddressRequest;
import com.Hypermarketplace.backend.dto.AddressResponse;
import com.Hypermarketplace.backend.exception.ResourceNotFoundException;
import com.Hypermarketplace.backend.model.Address;
import com.Hypermarketplace.backend.repository.AddressRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public AddressResponse createAddress(String userId, AddressRequest request) {
        Address address = new Address();
        address.setUserId(userId);
        address.setLabel(request.getLabel());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());

        // Handle default address logic
        if (request.getIsDefault() != null && request.getIsDefault()) {
            // Unset any existing default address for this user
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(existingDefault -> {
                        existingDefault.setDefault(false);
                        addressRepository.save(existingDefault);
                    });
            address.setDefault(true);
        } else {
            address.setDefault(false);
        }

        Address savedAddress = addressRepository.save(address);
        return new AddressResponse(savedAddress);
    }

    public List<AddressResponse> getUserAddresses(String userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        return addresses.stream()
                .map(AddressResponse::new)
                .collect(Collectors.toList());
    }

    public AddressResponse updateAddress(String userId, String addressId, AddressRequest request) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or you don't have permission to edit it"));

        address.setLabel(request.getLabel());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());

        // Handle default address logic
        if (request.getIsDefault() != null && request.getIsDefault()) {
            // Unset any existing default address for this user (except this one)
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(existingDefault -> {
                        if (!existingDefault.getId().equals(addressId)) {
                            existingDefault.setDefault(false);
                            addressRepository.save(existingDefault);
                        }
                    });
            address.setDefault(true);
        } else if (request.getIsDefault() != null && !request.getIsDefault()) {
            address.setDefault(false);
        }

        Address updatedAddress = addressRepository.save(address);
        return new AddressResponse(updatedAddress);
    }

    public void deleteAddress(String userId, String addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or you don't have permission to delete it"));

        addressRepository.delete(address);
    }

    public AddressResponse setDefaultAddress(String userId, String addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or you don't have permission to modify it"));

        // Unset any existing default address for this user
        addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(existingDefault -> {
                    if (!existingDefault.getId().equals(addressId)) {
                        existingDefault.setDefault(false);
                        addressRepository.save(existingDefault);
                    }
                });

        // Set this address as default
        address.setDefault(true);
        Address updatedAddress = addressRepository.save(address);
        return new AddressResponse(updatedAddress);
    }
}
