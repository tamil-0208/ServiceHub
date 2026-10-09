package com.Hypermarketplace.backend.repository;

import com.Hypermarketplace.backend.dto.RatingSummaryResponse;
import com.Hypermarketplace.backend.model.Review;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Repository
public class ReviewRepositoryCustomImpl implements ReviewRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    public ReviewRepositoryCustomImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public RatingSummaryResponse getRatingSummary(String providerId) {
        Aggregation aggregation = newAggregation(
                match(Criteria.where("providerId").is(providerId)),
                group("providerId")
                        .avg("rating").as("averageRating")
                        .count().as("totalReviews")
        );

        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "reviews", Document.class);
        Document resultDoc = results.getUniqueMappedResult();

        if (resultDoc == null) {
            return new RatingSummaryResponse(providerId, 0.0, 0);
        }

        Number avgRatingNum = (Number) resultDoc.get("averageRating");
        Number totalReviewsNum = (Number) resultDoc.get("totalReviews");

        double avgRating = avgRatingNum != null ? Math.round(avgRatingNum.doubleValue() * 100.0) / 100.0 : 0.0;
        long totalReviews = totalReviewsNum != null ? totalReviewsNum.longValue() : 0L;

        return new RatingSummaryResponse(providerId, avgRating, totalReviews);
    }
}
