import { axiosInstance } from "../api/axiosInstance";




export const signupService = async (name, email, phone, password) => {
      try {
          
          const response = await axiosInstance.post('/api/auth/signup', {name, email, phone, password});
          return response.data
        
      } catch (error) {
           console.log("Error :", error);
           throw error
      }
}



export const signInService = async (email, password) => {
     try {
          const response = await axiosInstance.post('/api/auth/signin', {email, password});
          return response.data;
        
     } catch (error) {
        console.log("Error in Service: ", error);
        throw error
     }
}

export const logoutService = async() => {
    try {
        const response = await axiosInstance.put('/api/auth/logout');
        return response.data
        
    } catch (error) {
        console.log("Error in logout: ", error);
        throw error
    }
}

export const sendMessageService = async(receiverId, message) => {
    try {
        const response = await axiosInstance.post(`/api/chat/send/${receiverId}`, {message});
        return response.data
        
    } catch (error) {
        console.log("Error in handleMessageService: ",error);
        throw error;
        
    }
}

export const getChatService = async(userTochatId) => {
    try {
        const response = await axiosInstance.get(`/api/chat/messages/${userTochatId}`);
        return response.data
        
    } catch (error) {
        console.log("Error in getChatService; ", error);
        throw error
    }
}