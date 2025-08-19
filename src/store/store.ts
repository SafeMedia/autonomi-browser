import { create } from "zustand";

interface AppState {
    address: string;
    setAddress: (a: string) => void;
    mime: string | null;
    data: string | null;
    setContent: (mime: string, data: string) => void;
}

export const useStore = create<AppState>((set) => ({
    address: "",
    setAddress: (a) => set({ address: a }),
    mime: null,
    data: null,
    setContent: (mime, data) => set({ mime, data }),
}));
