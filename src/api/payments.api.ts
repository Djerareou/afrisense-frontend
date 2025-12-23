import { httpClient } from './http';
import { API_ENDPOINTS } from './config';

// ==================== Types ====================

export interface InitiatePaymentRequest {
  method: 'MobileMoney' | 'Card' | 'Cash';
  amount: number;
}

export interface InitiatePaymentResponse {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
}

// ==================== API Functions ====================

export const paymentsApi = {
  /**
   * Initiate a payment
   * Requires: Authorization header
   * 
   * @param data - Payment method and amount
   */
  initiate: async (data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> => {
    return httpClient.post<InitiatePaymentResponse>(
      API_ENDPOINTS.PAYMENTS_INITIATE,
      data
    );
  },
};
