import { initializeApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlHQjg-RYNXT56Vy7Lr1gElGkoNYXc8aw",
  authDomain: "ngoserver-3dfcf.firebaseapp.com",
  projectId: "ngoserver-3dfcf",
  storageBucket: "ngoserver-3dfcf.firebasestorage.app",
  messagingSenderId: "882843929533",
  appId: "1:882843929533:web:6fb4ab3cb87f1bb6a2a0d4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------------------
// User Functions
// ------------------------------

const createUser = async ({ email, password, userdata }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", userCredential.user.uid), {
    ...userdata,
    AppliedServices: [], // ensure array exists
  });
  console.log("User created:", userCredential.user.email);
  return userCredential.user;
};

const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const document = await getDoc(doc(db, "users", userCredential.user.uid));
  return document.exists() ? document.data() : null;
};

// ------------------------------
// NGO Functions
// ------------------------------

const NgoCreateUser = async ({ email, password, userdata }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "ngos", userCredential.user.uid), {
    ...userdata,
    ServicesOffered: [], // ensure array exists
  });
  console.log("NGO created:", userCredential.user.email);
  return userCredential.user;
};

const NgoLoginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const document = await getDoc(doc(db, "ngos", userCredential.user.uid));
  if (document.exists()) {
    const data = document.data();
    return { ...data, isNgo: true };
  }
  return null;
};

// ------------------------------
// Firestore Helpers
// ------------------------------

const getFirestoreUserdata = async (uid) => {
  const document = await getDoc(doc(db, "users", uid));
  return document.exists() ? document.data() : null;
};

const getFirestoreNgodata = async (uid) => {
  const document = await getDoc(doc(db, "ngos", uid));
  return document.exists() ? document.data() : null;
};

const getCurrentUserData = async () => {
  const current = auth.currentUser;
  if (!current) return null;
  const ngoDoc = await getFirestoreNgodata(current.uid);
  if (ngoDoc) return { ...ngoDoc, isNgo: true };
  const userDoc = await getFirestoreUserdata(current.uid);
  return userDoc ? { ...userDoc, isNgo: false } : null;
};

// ------------------------------
// Add & Fetch Services
// ------------------------------

const AddServiceToNgo = async (uid, serviceData) => {
  if (!uid) throw new Error("Missing NGO UID");
  if (!serviceData) throw new Error("Missing service data");

  const ngoRef = doc(db, "ngos", uid);
  const ngoSnap = await getDoc(ngoRef);

  // Initialize if not exists
  if (!ngoSnap.exists()) {
    await setDoc(ngoRef, { ServicesOffered: [] });
  }

  const docRef = await addDoc(collection(db, "services"), serviceData);

  await updateDoc(ngoRef, {
    ServicesOffered: arrayUnion(serviceData),
  });

  console.log("✅ Service added successfully for NGO:", uid);
};

const getServies = async () => {
  const querySnapshot = await getDocs(collection(db, "services"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ------------------------------
// Apply to a Service
// ------------------------------

const ApplyToService = async (serviceId, applicantData, uid) => {
  const serviceRef = doc(db, "services", serviceId);
  const userRef = doc(db, "users", uid);

  const [serviceSnap, userSnap] = await Promise.all([
    getDoc(serviceRef),
    getDoc(userRef),
  ]);

  // ✅ Ensure both docs exist
  if (!serviceSnap.exists()) {
    await setDoc(serviceRef, {
      applicants: [],
      currentApplication: 0,
    });
  }
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      AppliedServices: [],
    });
  }

  // ✅ Re-fetch after initialization
  const serviceData = (await getDoc(serviceRef)).data();
  const userData = (await getDoc(userRef)).data();

  const applicants = Array.isArray(serviceData.applicants)
    ? serviceData.applicants
    : [];
  const appliedServices = Array.isArray(userData.AppliedServices)
    ? userData.AppliedServices
    : [];
  const currentApplication =
    typeof serviceData.currentApplication === "number"
      ? serviceData.currentApplication
      : 0;

  // ✅ Add default status and date to applicant
  const enrichedApplicant = {
    ...applicantData,
    status: "Pending", // default status for new application
    appliedDate: new Date().toISOString().split("T")[0], // e.g., "2025-10-31"
  };

  // ✅ Apply safely
  await updateDoc(serviceRef, {
    applicants: arrayUnion(enrichedApplicant),
    currentApplication: currentApplication + 1,
  });

  await updateDoc(userRef, {
    AppliedServices: arrayUnion(serviceId),
  });

  console.log("✅ Applied to service successfully:", serviceId);
};

// ------------------------------
// Signout
// ------------------------------

const signout = async () => {
  await signOut(auth);
  console.log("User signed out successfully");
};

// ------------------------------
// Exports
// ------------------------------


const approveApplicant = async (serviceId, applicantEmail) => {
  try {
    const serviceRef = doc(db, "services", serviceId);
    const serviceSnap = await getDoc(serviceRef);

    if (!serviceSnap.exists()) throw new Error("Service not found");

    const serviceData = serviceSnap.data();
    const updatedApplicants = serviceData.applicants.map((app) => {
      if (app.email === applicantEmail) {
        return { ...app, status: "Approved" };
      }
      return app;
    });

    await updateDoc(serviceRef, { applicants: updatedApplicants });

    console.log(`✅ Applicant ${applicantEmail} approved.`);
  } catch (err) {
    console.error("🔥 Error approving applicant:", err.message);
    throw err;
  }
};

// 🔹 Reject applicant
const rejectApplicant = async (serviceId, applicantEmail) => {
  try {
    const serviceRef = doc(db, "services", serviceId);
    const serviceSnap = await getDoc(serviceRef);

    if (!serviceSnap.exists()) throw new Error("Service not found");

    const serviceData = serviceSnap.data();
    const updatedApplicants = serviceData.applicants.map((app) => {
      if (app.email === applicantEmail) {
        return { ...app, status: "Rejected" };
      }
      return app;
    });

    await updateDoc(serviceRef, { applicants: updatedApplicants });

    console.log(`❌ Applicant ${applicantEmail} rejected.`);
  } catch (err) {
    console.error("🔥 Error rejecting applicant:", err.message);
    throw err;
  }
};

export {
  auth,
  app,
  createUser,
  loginUser,
  NgoCreateUser,
  NgoLoginUser,
  AddServiceToNgo,
  signout,
  getFirestoreUserdata,
  getFirestoreNgodata,
  getServies,
  getCurrentUserData,
  ApplyToService,
  approveApplicant,
  rejectApplicant,
};
