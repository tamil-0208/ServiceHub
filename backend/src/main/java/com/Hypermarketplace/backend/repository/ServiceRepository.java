package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.model.Service;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends MongoRepository<Service, String> {

    List<Service> findByActiveTrue();

    List<Service> findByActiveTrueAndCategoryId(String categoryId);

    List<Service> findByActiveTrueAndProviderId(String providerId);

    Optional<Service> findByIdAndActiveTrue(String id);

    boolean existsByProviderIdAndCategoryId(String providerId, String categoryId);
}
