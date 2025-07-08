import RegistrationForm from "./components/RegistrationStep1";
import Link from "next/link";

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
    <>
      <RegistrationForm />    
      <div className="text-center">
          <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/" className="text-lime-800 hover:text-lime-700 font-medium">
              Sign in here
          </Link>
          </p>
      </div>
    </>        
  );
} 