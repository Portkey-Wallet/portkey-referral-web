export const setItem = (key: string, value: string) => {
  return localStorage.setItem(key, value);
};

export const removeItem = (key: string) => {
  if (localStorage.getItem(key) === null) return;
  return localStorage.removeItem(key);
};

export const getItem = (key: string): any => {
  let result = localStorage.getItem(key) || '';

  try {
    result = JSON.parse(result);
    return result;
  } catch (error) {
    return result;
  }
};
