import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useProtectiveEquipmentStore = create((set, get) => ({
  equipment: [],
  isEquipmentLoading: false,
  isAdding: false,
  isUpdating: false,
  totalItems: 0,

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  sortConfig: { key: null, direction: 'asc' },
  setSortConfig: (key, direction) => set({ sortConfig: { key, direction } }),

  getEq: async (page, pageSize, type, fullData, filterText = '', sortConfig = { key: null, direction: 'asc' }) => {
    set({ isEquipmentLoading: true });
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('pageSize', pageSize);
      queryParams.append('type', type);

      if (fullData) {
        queryParams.append('fullData', true);
      }

      if (filterText) {
        queryParams.append('filterText', filterText);
      }

      if (sortConfig.key) {
        queryParams.append('sortBy', sortConfig.key);
        queryParams.append('sortDirection', sortConfig.direction);
      }

      const res = await axiosInstance.get(`/protectiveEquipment?${queryParams.toString()}`);

      if (fullData) {
        return res.data.equipment;
      } else {
        set({ 
          equipment: res.data.equipment,
          totalItems: res.data.totalItems,
        });
      }
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