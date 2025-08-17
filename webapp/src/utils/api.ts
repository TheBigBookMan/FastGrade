import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});