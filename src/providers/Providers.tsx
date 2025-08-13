
import { DrawerProvider } from "@/providers/DrawerProvider";
import { MobileProvider } from "@/providers/MobileProvider";
import { QueryProvider } from "@/providers/QueryClientProvider";
import { AuthProvider } from "./AuthProvider";
import { getUserDataFromServer } from "@/lib/auth/cache";

export default async function Providers({ children }: { children: React.ReactNode }) {
  const user = await getUserDataFromServer(); 
  return (
    <MobileProvider>
        <DrawerProvider>
            <QueryProvider> 
                <AuthProvider value={user}>                    
                    {children}
                </AuthProvider>
            </QueryProvider>
          </DrawerProvider>
    </MobileProvider>
  );
}