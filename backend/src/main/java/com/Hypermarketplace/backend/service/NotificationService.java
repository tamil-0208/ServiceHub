package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.NotificationResponse;
import com.Hypermarketplace.backend.exception.ResourceNotFoundException;
import com.Hypermarketplace.backend.model.Notification;
import com.Hypermarketplace.backend.model.NotificationTypeEnum;
import com.Hypermarketplace.backend.repository.NotificationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void notify(String userId, NotificationTypeEnum type, String message) {
        Notification notification = new Notification(userId, type, message);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyNotifications(String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(
                userId,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return notifications.stream()
                .map(NotificationResponse::new)
                .collect(Collectors.toList());
    }

    public NotificationResponse markAsRead(String userId, String notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return new NotificationResponse(saved);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadFalse(userId);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
    }
}
