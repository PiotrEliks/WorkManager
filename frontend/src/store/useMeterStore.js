import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useMeterStore = create((set, get) => ({
  meters: [],
  areMetersLoading: false,
  isAdding: false,
  isUpdating: false,

  getMeters: async (data) => {
    set({ areMetersLoading: true });
    try {
      const res = await axiosInstance.get("/meters/all", data);
      set({ meters: res.data });
    } catch (error) {
      console.error(error.response.data.message);
    } finally {
      set({ areMetersLoading: false });
    }
  },

  addMeter: async (formData) => {
    set({ isAdding: true });
    try {
      const res = await axiosInstance.post("/meters/meter/add", formData);
      set({ meters: res.data });
      toast.success("Miernik został dodany");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isAdding: false });
    }
  },

  deleteMeter: async (meterId) => {
    set({ areMetersLoading: true });
    try {
      const res = await axiosInstance.delete(`/meters/meter/delete/${meterId}`);
      set({ meters: res.data });
      toast.success("Miernik został usunięty");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      set({ areMetersLoading: false });
    }
  },

  updateMeter: async (meterId, formData) => {
    set({ isUpdating: true });
    try {
      const payload = Object.entries(formData).reduce((acc, [key, value]) => {
        acc[key] = value === '' ? null : value
        return acc
      }, {})
      const res = await axiosInstance.put(`/meters/meter/update/${meterId}`, payload);
      set({ meters: res.data });
      toast.success("Miernik został zaktualizowany");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdating: false });
    }
  },

  getMeter: async (meterId) => {
    try {
      const res = await axiosInstance.get(`/meters/meter/${meterId}`);
      return res.data;
    } catch (error) {
      console.error(error.response.data.message);
    }
  },

}));