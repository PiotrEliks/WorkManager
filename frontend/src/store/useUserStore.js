import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useUserstore = create((set, get) => ({
  users: [],
  areUsersLoading: false,
  isAdding: false,
  isUpdating: false,

  getUsers: async (data) => {
    set({ areUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users/all", data);
      set({ users: res.data });
    } catch (error) {
      console.error(error.response.data.message);
    } finally {
      set({ areUsersLoading: false });
    }
  },

  addUser: async (formData) => {
    set({ isAdding: true });
    try {
      const res = await axiosInstance.post("/users/add", formData);
      set({ users: res.data });
      toast.success("Pracownik został dodany");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isAdding: false });
    }
  },

  deleteUser: async (userId) => {
    set({ areUsersLoading: true });
    try {
      const res = await axiosInstance.delete(`/users/${userId}/delete`);
      set({ users: res.data });
      toast.success("Pracownik został usunięty");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ areUsersLoading: false });
    }
  },

  updateUser: async (userId, formData) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put(`/users/${userId}/update`, formData);
      set({ users: res.data });
      toast.success("Dane pracownika zostały zaktualizowane");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdating: false });
    }
  },

}));