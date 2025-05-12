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
      description: payload.description,
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
