
import { DrawerProvider } from "@/providers/DrawerProvider";
import { MobileProvider } from "@/providers/MobileProvider";
import { QueryProvider } from "@/providers/QueryClientProvider";
import { AuthProvider } from "./AuthProvider";

export default async function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MobileProvider>
        <DrawerProvider>
            <QueryProvider> 
                {children}
            </QueryProvider>
          </DrawerProvider>
    </MobileProvider>
  );
}