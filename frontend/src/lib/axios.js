import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://panel-api.elektropomiar.net.pl/api",
  withCredentials: true,
})