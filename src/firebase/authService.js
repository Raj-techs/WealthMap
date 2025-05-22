import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

// Sign up and assign role
export const registerUser = async (email, password, role, username) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  

  await setDoc(doc(db, "users", uid), {
    email,
    role,
    username
  });

  return userCredential;
};

// Login and fetch role
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  // After login
 localStorage.setItem("userId", uid); 

  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) throw new Error("No role found");

  const role = userDoc.data().role;
  return { user: userCredential.user, role };
};
