import api from "./axios";

export const getBuildings = async () => {
  const res = await api.get("/buildings");
  return res.data;
};

export const getLots = async () => {
  const res = await api.get("/lots");
  return res.data;
};

export const getAvailability = async () => {
  const res = await api.get("/slots/availability");
  return res.data;
};
