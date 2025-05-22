import createApiService from "./commonService/baseApiService";

const api = createApiService({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createClass = (payload) => {
  return api.makeRequest({
    url: `/api/class/create`,
    method: "POST",
    data: payload,
  });
};

export const updateClass = (id, payload) => {
  return api.makeRequest({
    url: `/api/class/update/${id}`,
    method: "PUT",
    data: payload,
  });
};

export const deleteClass = (id) => {
  return api.makeRequest({
    url: `/api/class/delete/${id}`,
    method: "DELETE",
  });
};

export const getClassById = (id) => {
  return api.makeRequest({
    url: `/api/class/get/${id}`,
    method: "GET",
  });
};

export const searchClassByName = (name) => {
  return api.makeRequest({
    url: `/api/class/search?name=${name}`,
    method: "GET",
  });
};

export const getAllClasses = (payload) => {
  const page = payload.page || 0;
  const size = payload.size || 10;
  return api.makeRequest({
    url: `/api/class/listAll?page=${page}&size=${size}`,
    method: "GET",
    data: payload,
  });
};

export const getClassesByCourse = (courseId) => {
  return api.makeRequest({
    url: `/api/class/course/${courseId}`,
    method: "GET",
  });
};

export const getClassesByTeacher = (teacherId) => {
  return api.makeRequest({
    url: `/api/class/teacher/${teacherId}`,
    method: "GET",
  });
};
