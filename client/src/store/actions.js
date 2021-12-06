import axios from "axios";
import { API_URL } from "../http";
import AuthService from "../services/auth-service";

export const ACTION_LOGIN = (email, password) => {
  return async (dispatch) => {
    try {
      const res = await AuthService.login(email, password);
      localStorage.setItem("token", res.data.accessToken);
      dispatch({type : "SET_AUTH", payload : true})

    } catch (e) {
      dispatch({type : "SET_AUTH", payload : false})
      console.log(e.response?.data?.message);
    }

  }
}

export const registration = async (email, password) => {
  try {
    const res = await AuthService.registration(email, password)
    localStorage.setItem("token", res.data.accessToken);

  } catch (e) {
    console.log(e.response?.data?.message);
  }
}

export const logout = async (email, password) => {
  try {
    const res = await AuthService.logout();
    localStorage.removeItem("token");

  } catch (e) {
    console.log(e.response?.data?.message);
  }
}

export const checkAuth = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${API_URL}refresh`, {withCredentials : true});
      localStorage.setItem("token", res.data.accessToken);
      dispatch({type : "SET_AUTH", payload : true})
    } catch (e) {
      dispatch({type : "SET_AUTH", payload : false})
      console.log("err", e.response?.data?.message);
    }

  }
}

export const ACTION_LOGOUT = () => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${API_URL}logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
      dispatch({type : "SET_AUTH", payload : false})
    } catch (e) {
      console.log("err", e);
    }
  }
}