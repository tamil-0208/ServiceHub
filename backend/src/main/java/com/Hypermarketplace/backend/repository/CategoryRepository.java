package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends MongoRepository<Category, String> {

    List<Category> findByActiveTrue();

    Optional<Category> findByIdAndActiveTrue(String id);

    boolean existsByNameIgnoreCase(String name);
}
