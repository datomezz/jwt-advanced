import axios from "axios";
export const API_URL = "http://localhost:5000/";

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
});


$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});


$api.interceptors.response.use(config => {
  return config;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response.status === 401 && error.config && !error.originalRequest._isRety) {
    try {
      error.originalRequest._isRety = true;
      const res = await axios.get(`${API_URL}refresh`, { withCredentials: true });
      localStorage.setItem("token", res?.data?.accessToken);
      return $api.request(originalRequest);

    } catch (e) {
      console.log("Not Authorized");
    }
  }
});

export default $api;