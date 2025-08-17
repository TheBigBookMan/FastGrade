import axios, { AxiosInstance } from "axios";

console.log('import.meta:', import.meta);
console.log('import.meta.env:', import.meta.env);
export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});