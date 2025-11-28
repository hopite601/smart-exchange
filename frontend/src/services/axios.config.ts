import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data.data;
    },
    (error) => {
        const message = error.response?.data?.data?.message || error.message;
        throw new Error(message);
    }
);
