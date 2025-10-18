import axios from "axios";

const baseURL = "https://25hour-server.vercel.app/";
// const baseURL = "http://localhost:3000/";

let userId = null;
export function setUserId(id) {
  userId = id;
}

const apicall = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apicall.interceptors.request.use(
  (config) => {
    if (userId) {
      config.headers["user-id"] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apicall;
