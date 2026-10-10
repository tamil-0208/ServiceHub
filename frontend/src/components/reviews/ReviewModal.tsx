import React, { useState } from 'react';
import { apiClient } from '../../api/client';
import type { ReviewRequest } from '../../types';

interface ReviewModalProps {
  bookingId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  bookingId,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: ReviewRequest = {
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      };

      await apiClient.post('/api/reviews', payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to submit review. Ensure booking is completed and not already reviewed.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">⭐ Rate & Review Service</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && (
          <div className="banner banner-error" style={{ marginBottom: '1rem' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Rating *</label>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.75rem', cursor: 'pointer', margin: '0.25rem 0' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    color: star <= rating ? '#f59e0b' : '#cbd5e1',
                    transition: 'transform 0.1s ease',
                  }}
                >
                  ★
                </span>
              ))}
              <span style={{ fontSize: '1rem', fontWeight: 600, alignSelf: 'center', marginLeft: '0.5rem' }}>
                {rating} of 5 Stars
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="review-comment">
              Feedback & Comments (Optional)
            </label>
            <textarea
              id="review-comment"
              className="form-input"
              rows={4}
              placeholder="How was the service? Was the provider punctual, professional, and thorough?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
