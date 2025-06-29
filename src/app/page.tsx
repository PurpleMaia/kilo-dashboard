
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSessionToken } from "./lib/auth";

export default async function Home() {
  // Simple login/signup form (client component)
  // For demo, just show the form UI
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-lime-800 p-4 md:h-52">
      </div>
      <div className="mt-4 flex grow flex-col gap-4">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          {/* just add the font in the tailwind line */}
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal antialiased`}>
            <strong>Welcome to KILO Dashboard.</strong>
          </p>
          <form className="flex flex-col gap-4" action="/api/login" method="POST">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="rounded border px-3 py-2"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="rounded border px-3 py-2"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-lime-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-lime-700 md:text-base"
            >
              Log in / Sign up
            </button>
          </form>
        </div>
        {/* <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          Add Hero Images Here, good practice to set w & h to be the aspect ration identical to source img
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
