package com.Hypermarketplace.backend.service.payment;

import com.Hypermarketplace.backend.model.PaymentMethod;
import com.Hypermarketplace.backend.model.PaymentStatusEnum;
import org.springframework.stereotype.Component;

/**
 * Mock implementation of PaymentGateway for testing and development.
 * Simulates successful payment processing.
 */
@Component
public class MockPaymentGateway implements PaymentGateway {

    @Override
    public PaymentStatusEnum processPayment(double amount, PaymentMethod method) {
        // Simulate successful payment for mock method
        // In a real implementation, this would call the actual payment gateway API
        return PaymentStatusEnum.SUCCESS;
    }

    @Override
    public String getGatewayName() {
        return "MOCK";
    }
}
