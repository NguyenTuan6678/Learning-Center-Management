import { roles } from "../utils/constants";
import createApiService from "./commonService/baseApiService";
import { getLocalData } from "./localStorage";

const api = createApiService({
  baseURL: import.meta.env.VITE_API_URL,
});

const getCurrentLoggedInUser = () => {
  const token = getLocalData("accessToken");
  const role = getLocalData(roles);
  const id = getLocalData("accountId");
  if (token && role && id) {
    return { token, role, id };
  }
  return null;
};

export const create = (payload) => {
  return api.makeRequest({
    url: "/api/account/create",
    method: "POST",
    data: payload,
  });
};

export const update = (payload) => {
  return api.makeRequest({
    url: `/api/account/update/${payload.id}`,
    method: "PUT",
    data: {
      username: payload.username,
      password: payload.password,
      role: payload.role,
    },
  });
};

export const getall = (payload) => {
  const page = payload.page || 0;
  const size = payload.size || 10;
  return api.makeRequest({
    url: `/api/account/listacc?page=${page}&size=${size}`,
    method: "GET",
    data: payload,
  });
};

export const deleteAccount = (payload) => {
  const token = getLocalData("accessToken");

  const loggedInUser = getCurrentLoggedInUser();

  if (!token || !loggedInUser) {
    console.error("Token hoặc thông tin người dùng không tồn tại!");
    return Promise.reject("Không thể xác thực người dùng.");
  }

  if (payload === loggedInUser.id) {
    console.warn("Không thể xóa tài khoản hiện tại đang đăng nhập.");
    return Promise.reject("Bạn không thể tự xóa chính mình.");
  }

  return api.makeRequest({
    url: `/api/account/delete/${payload}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const search = (payload) => {
  return api.makeRequest({
    url: `/api/account/search?name=${payload}`,
    method: "GET",
  });
};
