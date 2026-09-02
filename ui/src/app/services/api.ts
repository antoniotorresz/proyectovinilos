export const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH;
console.log("API_BASE_PATH:", API_BASE_PATH); // debug temporal

export const buildApiUrl = (resource: string): string => {
    return `${API_BASE_PATH}${resource}`;
};