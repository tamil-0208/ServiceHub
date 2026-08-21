package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.model.Provider;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProviderRepository extends MongoRepository<Provider, String> {

    Optional<Provider> findByUserId(String userId);

    boolean existsByUserId(String userId);
}