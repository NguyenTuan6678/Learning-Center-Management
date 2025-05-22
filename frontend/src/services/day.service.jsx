import createApiService from "./commonService/baseApiService";

const api = createApiService({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAllDays = () => {
  return api.makeRequest({
    url: `/api/day/listAll`,
    method: "GET",
  });
};
