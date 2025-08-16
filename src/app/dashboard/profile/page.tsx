'use client'
import { UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { redirect } from 'next/navigation';
import { useLogout, useQueryUserData } from '@/hooks/use-auth';

export default function Profile() {
    const { data: user } = useQueryUserData()
    const logout = useLogout()        

    // Check for stored data in user cache (same as useAuthGuard)
    if (!user) {
        redirect('/')
    }

    return (
        <>
         <div className="max-w-7xl mx-auto space-y-6 p-4 mb-96">
            {/* Profile Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">                    
                {/* Profile Header Top: Avatar, Name, Role, Edit Button */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
                            {/* <p className="text-gray-600 capitalize">{user?.role}</p> */}
                        </div>
                    </div>                                
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                        <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                        {user?.aina ? (
                            <p className="text-gray-900">{user?.aina.name}</p>
                        ) : (
                            <Button variant="outline" onClick={() => redirect('/register/aina')}>
                                Continue Set Up
                            </Button>
                        )}
                    </div>
                </div>                                                                            
                <div className='flex justify-end'>
                    <Button variant='outline' onClick={() => logout.mutate()}
                        >
                        {logout.isPending ? 'Logging out...' : 'Log Out'}
                    </Button>
                </div>     
            </div>          
        </div>
        </>
    )
}