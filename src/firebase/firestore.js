import { db } from "./config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const addProperty = async (propertyData) => {
  const propertyWithMeta = {
    ...propertyData,
    createdAt: serverTimestamp(),
  };
  await addDoc(collection(db, "properties"), propertyWithMeta);
};