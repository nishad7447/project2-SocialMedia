import axios from 'axios'; 

export const axiosInstance = axios.create({
    headers: {
        'authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    }
})

axiosInstance.interceptors.response.use(
    (response) => {
        console.log(response)
      if ( response?.data?.message === 'jwt expired') {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        window.location.replace('/signin');   
       }
      return response;
    },
    (error) => {
        console.log(error)
      if ( error?.response?.data?.message === 'jwt expired') {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
            window.location.replace('/signin');
          }
      return Promise.reject(error);
    }
  );