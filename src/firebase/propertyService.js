import { db } from "./config";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

export const fetchPendingProperties = async () => {
  const snapshot = await getDocs(collection(db, "pending_properties"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const approveProperty = async (submission) => {
  const propertyRef = collection(db, "properties");
  await addDoc(propertyRef, {
    ...submission,
    saleStatus: "available"
  });
  await deleteDoc(doc(db, "pending_properties", submission.id));
};

export const deletePendingProperty = async (id) => {
  await deleteDoc(doc(db, "pending_properties", id));
};