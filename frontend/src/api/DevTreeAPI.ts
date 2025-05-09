import { isAxiosError } from 'axios';
import api from '../Config/axios';
import {  LoginForm, RegisterForm, User, UserHandle } from '../Types';


export async function getUser() {
    try {   
        const {data}= await api<User>('/user');
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new   Error(error.response.data.error);
            
        }
    }
}

export async function udpateProfile(formData:User) {
    try {   
        const {data}= await api.patch<string>('/user',formData);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new   Error(error.response.data.error);
            
        }
    }
}

export async function uploadImage(file:File) {
        
        let formData=new FormData();
        formData.append('file', file)

    try {

        const {data:{image}} :{data:{image:string}}= await api.post('/user/image', formData);
        return image;
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new   Error(error.response.data.error);
            
        }
    }
}

export async function getUserByHandle(handle:string) {
    try {  
        const url = `/${handle}`;
        const {data}= await api<UserHandle>(url);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new   Error(error.response.data.error);
            
        }
    }
}

export async function searchByHandle(handle:string) {
    try {  
        const {data} = await api.post<string>('/search', {handle})
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new   Error(error.response.data.error);
            
        }
    }
}

export async function handleRegister(formData:RegisterForm){
        try {
            const {data} = await api.post(`/auth/register`, formData)
            return data;
        } catch (error) {
            if(isAxiosError(error) && error.response){
                throw new   Error(error.response.data.error);
                
            } 
        }
}


export async function handleLogin(formData:LoginForm){
    try {
      const { data } = await api.post(`/auth/login`, formData)
      return data;
     
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new   Error(error.response.data.error);
      }
    }
  }
