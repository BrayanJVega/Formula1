import { create } from 'zustand';
export const useUIStore = create((set) => ({
    sidebarOpen: false,
    theme: 'dark',
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
//# sourceMappingURL=ui.store.js.map