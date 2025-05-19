import createApiService from "./commonService/baseApiService";

const api = createApiService({
  baseURL: import.meta.env.VITE_API_URL,
});

export const VNPayService = {
  createPayment: (billId) => {
    return api.makeRequest({
      url: `/api/payments/vnpay/${billId}`,
      method: "POST",
    });
  },

  checkPaymentStatus: (paymentId) => {
    return api.makeRequest({
      url: `/api/payments/status/${paymentId}`,
      method: "GET",
    });
  },
};
