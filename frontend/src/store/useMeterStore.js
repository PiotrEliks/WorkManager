import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useMeterStore = create((set, get) => ({
  meters: [],
  areMetersLoading: false,
  isAdding: false,
  isUpdating: false,
  totalItems: 0,

  getMeters: async (page, pageSize, type, fullData) => {
    set({ areMetersLoading: true });
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('pageSize', pageSize);

      if (fullData) {
        queryParams.append('fullData', true);
      }

      const res = await axiosInstance.get(`/meters?${queryParams.toString()}`);
      
      if (fullData) {
        return res.data.meters;
      } else {
        set({ 
          meters: res.data.meters,
          totalItems: res.data.totalItems,
        });
      }
    } catch (error) {
      console.error(error.response.data.message);
    } finally {
      set({ areMetersLoading: false });
    }
  },

  addMeter: async (formData) => {
    set({ isAdding: true });
    try {
      const res = await axiosInstance.post("/meters", formData);
      set((state) => ({
        meters: [res.data, ...state.meters]
      }));
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
      await axiosInstance.delete(`/meters/${meterId}`);
      set((state) => ({
        meters: state.meters.filter((m) => m.id !== meterId),
      }));
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
      const res = await axiosInstance.put(`/meters/${meterId}`, payload);
      // set((state) => ({
      //   meters: state.meters.map((m) =>
      //     m.id === meterId ? res.data : m  
      //   ),
      // }));
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
      const res = await axiosInstance.get(`/meters/${meterId}`);
      return res.data;
    } catch (error) {
      console.error(error.response.data.message);
    }
  },

}));