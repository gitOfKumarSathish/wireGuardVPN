import { atom } from "jotai";

// Define global user state
export const userAtom = atom({
    id: null,
    username: "",
});
