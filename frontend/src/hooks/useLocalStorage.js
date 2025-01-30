export const setStorageItem = (data = {}) => {
    const key = String(Object.keys(data)[0]);
    const val = String(data[key]);
    window.localStorage.setItem(key, val);
}

export const getStorageItem = (key) => {
    return window.localStorage.getItem(String(key))
}

export const removeStorageItem = (key) => {
    window.localStorage.removeItem(String(key));
}

export const removeAllStorage = () => {
    window.localStorage.clear();
}