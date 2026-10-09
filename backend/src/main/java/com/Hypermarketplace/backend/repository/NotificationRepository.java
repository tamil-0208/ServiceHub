package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.model.Notification;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserId(String userId, Sort sort);

    Optional<Notification> findByIdAndUserId(String id, String userId);

    List<Notification> findByUserIdAndReadFalse(String userId);
}
