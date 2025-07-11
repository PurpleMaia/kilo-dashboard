import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSessionToken } from "./lib/auth";
import LoginForm from "./components/dashboard/LoginForm";

export default async function Home() {
  // Check if user is already logged in (Server Component)
  const sessionCookie = (await cookies()).get('auth_session');
  let canRedirect = false
  if (sessionCookie) {
    try {
      const sessionValidation = await validateSessionToken(sessionCookie.value);
      if (sessionValidation.user) {
        canRedirect = true
        console.log('Valid session, redirecting to dashboard home')
      }
    } catch {
      // Invalid session, continue to login form
      console.log('Invalid session, showing login form');
    }
  }

  if (canRedirect) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-lime-800 p-4 md:h-52">
      </div>
      <div className="mt-4 flex grow flex-col gap-4">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal antialiased`}>
            <strong>Welcome to KILO Dashboard.</strong>
          </p>
          
          {/* Login Form */}
          <LoginForm />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Sign Up Button */}
          <Link
            href="/register"
            className="rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 md:text-base text-center"
          >
            Create New Account
          </Link>
        </div>
        {/* <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          Add Hero Images Here, good practice to set w & h to be the aspect ratio identical to source img
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className='hidden md:block'
            alt='Screenshots of the dashboard project showing desktop version'
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className='md:hidden block'
            alt='Screenshots of the dashboard project showing mobile version'
          /> 
        </div> */}
      </div>
    </main>
  );
}
