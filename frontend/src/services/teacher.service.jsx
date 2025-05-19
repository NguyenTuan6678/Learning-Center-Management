import createApiService from "./commonService/baseApiService";

const api = createApiService({
  baseURL: import.meta.env.VITE_API_URL,
});

export const create = (payload) => {
  return api.makeRequest({
    url: "/api/teacher/create",
    method: "POST",
    data: payload,
  });
};

export const update = (payload, data) => {
  return api.makeRequest({
    url: `/api/teacher/update/${payload}`,
    method: "PUT",
    data: data,
  });
};

export const getall = (payload) => {
  const page = payload.page || 0;
  const size = payload.size || 10;
  return api.makeRequest({
    url: `/api/teacher/teacherList?page=${page}&size=${size}`,
    method: "GET",
    data: payload,
  });
};

export const deleteTeacher = (payload) => {
  return api.makeRequest({
    url: `/api/teacher/delete/${payload}`,
    method: "DELETE",
  });
};

export const search = (payload) => {
  return api.makeRequest({
    url: `/api/teacher/search?name=${payload}`,
    method: "GET",
  });
};

export const upload = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log("File info:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  return api.makeRequest({
    url: `/api/teacher/upload`,
    method: "POST",
    data: formData,
  });
};

export const getAllTeacherSer = () => {
  return api.makeRequest({
    url: `/api/teacher/listAll`,
    method: "GET",
  });
};
