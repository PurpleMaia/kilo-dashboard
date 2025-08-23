
import { MobileProvider } from "@/providers/MobileProvider";
import { QueryProvider } from "@/providers/QueryClientProvider";

export default async function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MobileProvider>
        <QueryProvider> 
            {children}
        </QueryProvider>
    </MobileProvider>
  );
}