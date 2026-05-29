interface UIState {
    sidebarOpen: boolean;
    theme: 'dark' | 'light';
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}
export declare const useUIStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UIState>>;
export {};
//# sourceMappingURL=ui.store.d.ts.map