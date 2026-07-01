import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'code-pulse-vf4w.vercel.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

