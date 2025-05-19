import createApiService from "./commonService/baseApiService";

const api = createApiService({
  baseURL: import.meta.env.VITE_API_URL,
});

const COURSE_API_BASE_URL = "/api/course";

export const createCourse = (payload) => {
  return api.makeRequest({
    url: `/api/course/create`,
    method: "POST",
    data: payload,
  });
};

export const updateCourse = (id, payload) => {
  return api.makeRequest({
    url: `/api/course/update/${id}`,
    method: "PUT",
    data: payload,
  });
};

export const deleteCourse = (id) => {
  return api.makeRequest({
    url: `/api/course/delete/${id}`,
    method: "DELETE",
  });
};

export const searchCourses = (name) => {
  return api.makeRequest({
    url: `${COURSE_API_BASE_URL}/search?name=${name}`,
    method: "GET",
  });
};

export const getAllCourses = (payload) => {
  const page = payload?.page || 0;
  const size = payload?.size || 10;
  return api.makeRequest({
    url: `/api/course/listAll?page=${page}&size=${size}`,
    method: "GET",
    data: payload,
  });
};
