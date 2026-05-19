import axios from "axios";
import toast from "react-hot-toast";

// Use environment variable or detect dev/prod automatically
let API_URL =
    import.meta.env.VITE_API_URL;
if (!API_URL) {
    // For local development (localhost:3000, localhost:3001, etc.)
    if (
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1")
    ) {
        API_URL = "http://localhost:5000/api/v1";
    } else {
        // Production
        API_URL = "https://ivorymist-mcs.onrender.com/api/v1";
    }
}
console.log("🔗 API Base URL:", API_URL);
const API = axios.create({
    baseURL: API_URL,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global response handler: handle 401 to prompt re-login
API.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = (err && err.response && err.response.status) || null;
        if (status === 401) {
            try {
                localStorage.removeItem("token");
            } catch (e) {}
            toast.error("Session expired or unauthorized. Please log in.");
            // redirect to login page
            try {
                window.location.href = "/login";
            } catch (e) {}
        }
        return Promise.reject(err);
    },
);

export default API;