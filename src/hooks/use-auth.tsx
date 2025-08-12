import { useState, useEffect, createContext, useContext } from "react";
import { getAinaID, getUserID } from "@/lib/server-utils";

interface AuthContextType {
  user: string | null;
  aina: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [aina, setAina] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUserInfo = async () => {
        try {
            const userID = await getUserID();
            setUser(userID);

            const ainaID = await getAinaID(userID);
            setAina(ainaID);

            setLoading(false)
        } catch (error) {
            console.error('Error fetching user ID:', error);
            setUser(null);
            setLoading(false);
        }
    }
    fetchUserInfo();


  }, []);
  

  return (
    <AuthContext.Provider value={{ user, aina }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};