package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.model.Address;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends MongoRepository<Address, String> {

    List<Address> findByUserId(String userId);

    Optional<Address> findByIdAndUserId(String id, String userId);

    Optional<Address> findByUserIdAndIsDefaultTrue(String userId);
}
