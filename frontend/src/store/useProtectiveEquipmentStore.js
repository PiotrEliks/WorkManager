import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useProtectiveEquipmentStore = create((set, get) => ({
  equipment: [],
  isEquipmentLoading: false,
  isAdding: false,
  isUpdating: false,

  getEq: async (data) => {
    set({ isEquipmentLoading: true });
    try {
      const res = await axiosInstance.get("/protectiveEquipment/all", data);
      set({ equipment: res.data });
    } catch (error) {
      console.log("Error in getEq: ", error);
    } finally {
      set({ isEquipmentLoading: false });
    }
  },

  addEq: async (formData) => {
    set({ isAdding: true });
    try {
      const res = await axiosInstance.post("/protectiveEquipment/add", formData);
      set({ equipment: res.data });
      toast.success("Sprzęt został dodany");
    } catch (error) {
      console.log("Error in addEq: ", error);
      toast.error("Błąd podczas dodawania sprzętu");
    } finally {
      set({ isAdding: false });
    }
  },

  deleteEq: async (eqId) => {
    set({ isEquipmentLoading: true });
    try {
      const res = await axiosInstance.delete(`/protectiveEquipment//${eqId}/delete`);
      set({ equipment: res.data });
      toast.success("Sprzęt został usunięty");
    } catch (error) {
      console.log("Error in deleteEq: ", error);
      toast.error("Błąd podczas usuwania sprzętu");
    } finally {
      set({ isEquipmentLoading: false });
    }
  },

  updateEq: async (eqId, formData) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put(`/protectiveEquipment/${eqId}/update`, formData);
      set({ equipment: res.data });
      toast.success("Sprzęt został zaktualizowany");
    } catch (error) {
      console.log("Error in updateEq: ", error);
      toast.error("Błąd podczas aktualizowania sprzętu");
    } finally {
      set({ isUpdating: false });
    }
  },

}));