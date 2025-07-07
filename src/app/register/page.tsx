import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSessionToken } from "../lib/auth";
import RegistrationForm from "./components/RegistrationStep1";

export default async function RegisterPage() {
// COMMENTED OUT FOR TESTNG    
//   // Check if user is already logged in
//   const sessionCookie = (await cookies()).get('auth_session');
//   let canRedirect = false;
  
//   if (sessionCookie) {
//     try {
//       const sessionValidation = await validateSessionToken(sessionCookie.value);
//       if (sessionValidation.user) {
//         canRedirect = true;
//       }
//     } catch (error) {
//       console.log('Invalid session, showing registration form');
//     }
//   }

//   if (canRedirect) {
//     redirect('/dashboard');
//   }

  // Fetch aina list from the database

  return (              
      <RegistrationForm />    
  );
} 