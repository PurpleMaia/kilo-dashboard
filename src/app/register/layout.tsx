import Link from "next/link";

export default function RegisterLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
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
            
            {children}
            
            <div className="text-center">
                <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/" className="text-lime-800 hover:text-lime-700 font-medium">
                    Sign in here
                </Link>
                </p>
            </div>
            </div>
        </div>
      </main>
    );
}