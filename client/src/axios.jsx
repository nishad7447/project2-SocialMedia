import axios from 'axios';

export const axiosInstance = axios.create({
  headers: {
    'authorization': `Bearer ${localStorage.getItem('jwtToken')}`
  }
})


axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.message === 'jwt expired') {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      window.location.replace('/signin');
    }
    return response;
  },
  (error) => {
    console.log(error)
    if (error?.response?.data?.message === 'jwt expired') {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      window.location.replace('/signin');
    }
    return Promise.reject(error);
  }

);

export const axiosAdminInstance = axios.create({
  headers: {
    'authorization': `Bearer ${localStorage.getItem('adminToken')}`
  }
})
axiosAdminInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.message === 'jwt expired') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('role');
      window.location.replace('/admin-login');
    }
    return response;
  },
  (error) => {
    console.log(error)
    if (error?.response?.data?.message === 'jwt expired') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('role');
      window.location.replace('/admin-login');
    }
    return Promise.reject(error);
  }
);