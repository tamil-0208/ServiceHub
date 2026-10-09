package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.dto.RatingSummaryResponse;

public interface ReviewRepositoryCustom {

    RatingSummaryResponse getRatingSummary(String providerId);
}
