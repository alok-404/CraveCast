// src/api/api.js
import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:3000/api",
    baseURL: "https://cravecast.onrender.com/api",

  withCredentials: true,
});

export default API;
