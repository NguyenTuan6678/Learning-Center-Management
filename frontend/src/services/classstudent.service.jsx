import createApiService from "./commonService/baseApiService";

const api = createApiService({
  baseURL: import.meta.env.VITE_API_URL,
});

export const addStudentToClass = (payload) => {
  return api.makeRequest({
    url: `/api/classstudents/create`,
    method: "POST",
    data: payload,
  });
};

export const removeStudentFromClass = (id) => {
  return api.makeRequest({
    url: `/api/classstudents/delete/${id}`,
    method: "DELETE",
  });
};

export const getClassStudentById = (id) => {
  return api.makeRequest({
    url: `/api/classstudents/${id}`,
    method: "GET",
  });
};

export const getAllClassStudents = (payload) => {
  const page = payload.page || 0;
  const size = payload.size || 10;
  return api.makeRequest({
    url: `/api/classstudents/listAll?page=${page}&size=${size}`,
    method: "GET",
    data: payload,
  });
};

export const getClassStudentsByClass = (classId) => {
  return api.makeRequest({
    url: `/api/classstudents/class/${classId}`,
    method: "GET",
  });
};

export const getClassStudentsByStudent = (studentId) => {
  return api.makeRequest({
    url: `/api/classstudents/student/${studentId}`,
    method: "GET",
  });
};
