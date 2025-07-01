import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSessionToken } from "../lib/auth";
import RegistrationForm from "./components/RegistrationForm";

export default async function RegisterPage() {
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

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-lime-800 p-4 md:h-52">
      </div>
      <div className="mt-4 flex grow flex-col gap-4">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal antialiased`}>
            <strong>Create Your Account</strong>
          </p>
          <p className="text-gray-600">Join KILO Dashboard to start monitoring your sensors.</p>
          
          <RegistrationForm />
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/" className="text-lime-800 hover:text-lime-700 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 