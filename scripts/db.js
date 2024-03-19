const getLocalData = (key) => {
  const getData = JSON.parse(localStorage.getItem(key));
  return getData;
};

const setLocalData = (key, value) => {
  const setData = localStorage.setItem(key, JSON.stringify(value));
  return setData;
};

export { getLocalData, setLocalData };
