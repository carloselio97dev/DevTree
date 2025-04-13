import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api= axios.create({
    baseURL:API_URL
})

api.interceptors.request.use((config)=>{
     const token=localStorage.getItem('AUTH_TOKEN');
     if(token){
        config.headers.Authorization= `Bearer ${token}`;
     }
     
     return config;
})
// Para depuración - eliminar en producción
console.log('API URL configurada:', API_URL);

export default api;