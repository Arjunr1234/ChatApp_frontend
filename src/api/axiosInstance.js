import axios from "axios";

//const BASE_URL = "http://localhost:5000"; 
const BASE_URL = 'https://chatapp-backend-unji.onrender.com'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true
});