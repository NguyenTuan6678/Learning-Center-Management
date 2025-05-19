import { createSlice } from "@reduxjs/toolkit";

import { getLocalData, setLocalData } from "../../services/localStorage";
import { isLoggedInText, roles } from "../../utils/constants";
import { set } from "lodash";

const initialState = {
  userData: {
    username: "",
    password: "",
  },
  isLoggedIn: getLocalData(isLoggedInText)
    ? getLocalData(isLoggedInText)
    : false,
  role: getLocalData(roles) ? getLocalData(roles) : "user",
  errorMassage: false,
  studentId: getLocalData("studentId") || null,
};

const reducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userData = action.payload;
    },
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.role = action.payload.role;
      state.studentId = action.payload.studentId;
      state.teacherId = action.payload.teacherId;
      setLocalData(roles, action.payload.role);
      setLocalData("studentId", action.payload.studentId);
      setLocalData("teacherId", action.payload.teacherId);
      setLocalData(isLoggedInText, true);
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.role = "user";
    },
    resetAuthState: () => initialState,
  },
});

export default reducer;
