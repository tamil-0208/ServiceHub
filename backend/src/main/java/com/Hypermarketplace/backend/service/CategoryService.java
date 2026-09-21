package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.CategoryRequest;
import com.Hypermarketplace.backend.dto.CategoryResponse;
import com.Hypermarketplace.backend.exception.ConflictException;
import com.Hypermarketplace.backend.exception.ResourceNotFoundException;
import com.Hypermarketplace.backend.model.Category;
import com.Hypermarketplace.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new ConflictException("Category with name '" + request.getName() + "' already exists");
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIconUrl(request.getIconUrl());
        category.setActive(true);

        Category savedCategory = categoryRepository.save(category);
        return new CategoryResponse(savedCategory);
    }

    public List<CategoryResponse> getAllActiveCategories() {
        return categoryRepository.findByActiveTrue()
                .stream()
                .map(CategoryResponse::new)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(String id) {
        Category category = categoryRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return new CategoryResponse(category);
    }

    public CategoryResponse updateCategory(String id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // Check if new name conflicts with existing category (case-insensitive)
        if (!category.getName().equalsIgnoreCase(request.getName()) &&
            categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new ConflictException("Category with name '" + request.getName() + "' already exists");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIconUrl(request.getIconUrl());

        Category updatedCategory = categoryRepository.save(category);
        return new CategoryResponse(updatedCategory);
    }

    public CategoryResponse softDeleteCategory(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setActive(false);
        Category deactivatedCategory = categoryRepository.save(category);
        return new CategoryResponse(deactivatedCategory);
    }
}
