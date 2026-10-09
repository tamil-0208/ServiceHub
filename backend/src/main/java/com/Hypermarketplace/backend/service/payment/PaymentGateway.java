package com.Hypermarketplace.backend.service.payment;

import com.Hypermarketplace.backend.model.PaymentMethod;
import com.Hypermarketplace.backend.model.PaymentStatusEnum;

/**
 * Interface for payment gateway integration.
 * Implementations can be swapped out for different payment providers (Razorpay, Stripe, etc.)
 * without changing the PaymentService logic.
 */
public interface PaymentGateway {

    /**
     * Process a payment for the given amount.
     * @param amount The amount to process
     * @param method The payment method to use
     * @return PaymentStatusEnum indicating the result of the payment processing
     */
    PaymentStatusEnum processPayment(double amount, PaymentMethod method);

    /**
     * Get the name of this payment gateway implementation.
     * @return The gateway name (e.g., "MOCK", "RAZORPAY", "STRIPE")
     */
    String getGatewayName();
}
