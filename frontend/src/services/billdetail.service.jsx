import createApiService from "./commonService/baseApiService";

const api = createApiService({
  baseURL: import.meta.env.VITE_API_URL,
});

export const update = (payload) => {
  return api.makeRequest({
    url: `/api/billdetails/update/${payload.id}`,
    method: "PUT",
    data: {
      description: payload.description,
      amount: payload.amount,
      currency: payload.currency,
      paymentStatus: payload.paymentStatus,
      studentId: payload.studentId,
      parentId: payload.parentId,
    },
  });
};

export const get = (payload) => {
  return api.makeRequest({
    url: `/api/billdetails/get/${payload}`,
    method: "GET",
    data: payload,
  });
};

export const getBillForStudent = (billid, studentid) => {
  return api.makeRequest({
    url: `/api/billdetails/${billid}/student/${studentid}`,
    method: "GET",
  });
};

export const getAllBillDetailsForStudent = (studentId) => {
  return api.makeRequest({
    url: `/api/billdetails/student/${studentId}`,
    method: "GET",
  });
};
