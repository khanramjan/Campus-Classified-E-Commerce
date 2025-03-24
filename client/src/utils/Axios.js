import axios from "axios";
import SummaryApi from "../common/SummaryApi";

const Axios = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// Request interceptor
Axios.interceptors.request.use(
    async(config) => {
        const accessToken = localStorage.getItem('accesstoken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
Axios.interceptors.response.use(
    (response) => {
        return response
    },
    async(error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const newAccessToken = await refreshAccessToken(refreshToken);
                    if (newAccessToken) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return Axios(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    localStorage.removeItem('accesstoken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

const refreshAccessToken = async(refreshToken) => {
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });

        const accessToken = response.data.data.accessToken;
        localStorage.setItem('accesstoken', accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error in refreshAccessToken:', error);
        throw error;
    }
}

export default Axios;