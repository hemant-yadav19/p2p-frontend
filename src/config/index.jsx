import axios from "axios";

export const BASE_URL = "https://peer-to-peer-skill-exchange.onrender.com";
export const createServer = axios.create({
    baseURL:BASE_URL,
});