import { all, call, put, takeEvery } from "redux-saga/effects";

import { login, logout } from "../../services/auth.service";
import { removeLocalData, setLocalData } from "../../services/localStorage";
import { isLoggedInText, roles } from "../../utils/constants";
import authSlice from "./slice";
import alertSlice from "../alert/slice";
import { set } from "lodash";

function* loginSaga({ payload }) {
  try {
    const response = yield call(login, payload);
    if (response.status === 200) {
      const data = response.data;
      const { accessToken, role, id, studentId, teacherId } = data;
      console.log("****data saga: ", data);
      if (accessToken) {
        setLocalData(isLoggedInText, true);
        setLocalData("accessToken", accessToken);
        setLocalData(roles, role);
        setLocalData("accountId", id);
        setLocalData("studentId", studentId);
        setLocalData("teacherId", teacherId);

        yield put(
          authSlice.actions.loginSuccess({ role, studentId, teacherId })
        );
        // window.location.reload();
        yield put(alertSlice.actions.success("Đăng nhập thành công"));
        window.location.reload();
      } else {
        console.log("**Error");
      }
    } else {
      yield put(alertSlice.actions.error("Đăng nhập không thành công"));
      console.log("** API error");
    }
  } catch (e) {
    yield put(alertSlice.actions.error("Đăng nhập không thành công"));
    console.log(e);
  }
}

function* logoutSaga() {
  try {
    const response = yield call(logout);
    if (response.status === 200) {
      yield put(alertSlice.actions.success("Đăng xuất thành công"));
      console.log("Đăng xuất thành công");
    } else {
      console.log("** API error");
    }
  } catch (e) {
    console.log(e);
  } finally {
    removeLocalData(isLoggedInText);
    removeLocalData("accessToken");
    removeLocalData(roles);
    removeLocalData("userId");
    removeLocalData("studentId");
    removeLocalData("teacherId");
    window.location.reload();
  }
}

export default function* saga() {
  yield all([
    takeEvery(authSlice.actions.login().type, loginSaga),
    takeEvery(authSlice.actions.logout().type, logoutSaga),
  ]);
}
