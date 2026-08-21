package com.Hypermarketplace.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "providers")
public class Provider {

    @Id
    private String id;

    private String userId;

    private String businessName;

    private String description;

    private String phone;

    private String experience;

    private String address;

    private boolean verified;
}