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
      const res = await axiosInstance.get("/protectiveEquipment", data);
      set({ equipment: res.data });
    } catch (error) {
      console.error(error.response.data.message);
    } finally {
      set({ isEquipmentLoading: false });
    }
  },

  addEq: async (formData) => {
    set({ isAdding: true });
    try {
      const res = await axiosInstance.post("/protectiveEquipment", formData);
      set((state) => ({
        equipment: [res.data, ...state.equipment]
      }));
      toast.success("Sprzęt został dodany");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isAdding: false });
    }
  },

  deleteEq: async (eqId) => {
    set({ isEquipmentLoading: true });
    try {
      await axiosInstance.delete(`/protectiveEquipment/${eqId}`);
      set((state) => ({
        equipment: state.equipment.filter((eq) => eq.id !== eqId),
      }));
      toast.success("Sprzęt został usunięty");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isEquipmentLoading: false });
    }
  },

  updateEq: async (eqId, formData) => {
    set({ isUpdating: true });
    try {
      const payload = Object.entries(formData).reduce((acc, [key, value]) => {
        acc[key] = value === '' ? null : value
        return acc
      }, {})
      const res = await axiosInstance.put(`/protectiveEquipment/${eqId}`, payload);
      // set((state) => ({
      //   equipment: state.equipment.map((eq) =>
      //     eq.id === eqId ? res.data : eq  
      //   ),
      // }));
      toast.success("Sprzęt został zaktualizowany");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdating: false });
    }
  },

  getEqById: async (eqId) => {
    try {
      const res = await axiosInstance.get(`protectiveEquipment/${eqId}`);
      return res.data;
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
  },

}));