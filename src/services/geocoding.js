
//  src/services/geocoding.js
import axios from "axios";

export const geocodeOCA = async (address) => {
  const key = "a7d5f8ddfa31439eb994c8ca151b4d4a";  // free signup
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    address
  )}&key=${key}&limit=1`;
  const { data } = await axios.get(url);
  if (!data.results.length) throw new Error("Address not found");
  const { lat, lng } = data.results[0].geometry;
  const city = data.results[0].components.city || "";
  return { lat, lng, city };
};
