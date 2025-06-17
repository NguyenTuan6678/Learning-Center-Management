import createApiService from "./commonService/baseApiService";

const api = createApiService({
  baseURL: import.meta.env.VITE_API_URL,
});

export const create = (payload) => {
  return api.makeRequest({
    url: "/api/bill/create",
    method: "POST",
    data: payload,
  });
};

export const getall = (payload) => {
  return api.makeRequest({
    url: "/api/bill/listAll",
    method: "GET",
    data: payload,
  });
};

export const deletebill = (payload) => {
  return api.makeRequest({
    url: `/api/bill/delete/${payload}`,
    method: "DELETE",
  });
};
