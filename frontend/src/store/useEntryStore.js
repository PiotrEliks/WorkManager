import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'

export const useEntryStore = create((set, get) => ({
  entries: [],
  areEntriesLoading: false,

  getUserEntries: async (userId) => {
    set({ areEntriesLoading: true });
    try {
      const res = await axiosInstance.get(`/entries/${userId}`);

      set({ entries: res.data });
    } catch (error) {
      console.error(error.response.data.message);
    } finally {
      set({ areEntriesLoading: false });
    }
  },

}));