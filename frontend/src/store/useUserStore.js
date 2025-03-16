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
      console.log("Error in getUsers: ", error);
    } finally {
      set({ areUsersLoading: false });
    }
  },

  addUser: async (formData) => {
    set({ isAdding: true });
    try {
      console.log(formData)
      const res = await axiosInstance.post("/users/add", formData);
      set({ users: res.data });
      toast.success("Pracownik został dodany");
    } catch (error) {
      console.log("Error in addUser: ", error);
      toast.error("Błąd podczas dodawania pracownika");
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
      console.log("Error in deleteUser: ", error);
      toast.error("Błąd podczas usuwania pracownika");
    } finally {
      set({ areUsersLoading: false });
    }
  },

  updateUser: async (userId, formData) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put(`/users/${userId}/update`, formData);
      set({ users: res.data });
      toast.success("Pracownik został zaktualizowany");
    } catch (error) {
      console.log("Error in updateUser: ", error);
      toast.error("Błąd podczas aktualizowania pracownika");
    } finally {
      set({ isUpdating: false });
    }
  },

}));