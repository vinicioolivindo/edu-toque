import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../utils/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Define o formato dos nossos dados globais
type AuthContextType = {
  user: User | null;
  userType: 'estudante' | 'educador' | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, userType: null, isLoading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'estudante' | 'educador' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // O Firebase avisa automaticamente quando alguém loga ou desloga
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Busca o tipo de usuário no banco de dados
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserType(docSnap.data().userType);
        }
      } else {
        setUser(null);
        setUserType(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userType, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar em qualquer tela
export const useAuth = () => useContext(AuthContext);