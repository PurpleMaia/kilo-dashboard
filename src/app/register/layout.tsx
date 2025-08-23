export default function RegisterLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <main className="flex min-h-screen flex-col p-6">        
        <div className="mt-36 flex grow flex-col gap-4">
          <div className="shadow-lg border-gray-300 flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
            <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal antialiased`}>
                <strong>Create Your Account</strong>
            </p>
            <p className="text-gray-600">Join KILO Dashboard to start monitoring your sensors.</p>
            
            {children}
            
            
          </div>
        </div>
      </main>
    );
}