import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { auth, getCurrentUserData } from "../_auth/FirebaseAuth";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [AuthState, setAuthState] = React.useState({
    isAuthenticated: false,
    user: null,
  });
  const [loading, setLoading] = React.useState(true);
  const [scheme, setScheme] = React.useState();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Use getCurrentUserData to check both 'ngos' and 'users' collections
          const firestoreData = await getCurrentUserData();
          console.log("Firestore Data:", firestoreData);

          setAuthState({
            isAuthenticated: true,
            user: firestoreData,
            uid: user.uid,
          });
        } catch (error) {
          console.error("Error fetching Firestore data:", error);
          setAuthState({
            isAuthenticated: true,
            user: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ AuthState, setAuthState, loading, scheme, setScheme }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
export default AuthProvider;
