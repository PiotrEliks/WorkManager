import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdating: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error(error.response.data.message);
      set({ authUser: null});
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async (data) => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  changePassword: async (userId, password) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put(`/auth/${userId}/changePassword`, {
        password
      });
      set({ authUser: res.data });
      toast.success("Hasło zostało zmienione");
    } catch (error) {
      console.error("Error in updateUser: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdating: false });
    }
  },

}));