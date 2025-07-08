'use client'
import { useEffect, useState } from "react";
import { BookmarkSquareIcon, PencilIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface UserData {
    username: string,
    email: string,
    created_at: Date,
    role: string,
    aina_name: string,
    needsAinaSetup: boolean
}

export default function Profile() {
    
    const [editingProfile, setEditingProfile] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/profile')

            if (!response.ok) {
                throw new Error('Failed to fetch sheet data');  
            }

            const userData = await response.json();
            console.log(userData)            
            setUserData(userData)        
        } catch (error) {
            console.log(`Failed to load data: ${error}`);
        }
    }

    const handleSaveProfile = () => {
        setEditingProfile(false);
        // In a real app, this would save to the backend
        console.log('Saving profile:', userData);
      };
    
      const handleCancelEdit = () => {
        setEditingProfile(false);
        // Reset to original data
      };


      useEffect(() => {
        fetchUserData();
      }, []);

    return (
        <>
         <div className="max-w-7xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                    <h1 className="text-2xl font-bold text-gray-900">{userData?.username}</h1>
                    <p className="text-gray-600 capitalize">{userData?.role}</p>
                    {/* <p className="text-sm text-gray-500">Member since {userData?.created_at}</p> */}
                    </div>
                </div>
                <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                </button>
                </div>

                {editingProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={userData?.username}
                        // onChange={(e) => setProfileData({...userData, fullName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={userData?.email}
                        // onChange={(e) => setProfileData({...userData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    </div>                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        value={userData?.aina_name}
                        // onChange={(e) => setProfileData({...userData, site: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-3">
                    <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveProfile}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                    >
                        <BookmarkSquareIcon className="h-4 w-4 mr-2" />
                        Save Changes
                    </button>
                    </div>
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                    <p className="text-gray-900">{userData?.email}</p>
                    {/* <p className="text-gray-900">{userData.phone}</p> */}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                        { userData?.needsAinaSetup ? (
                            <div> continue set up </div>
                        ) : (
                            <p className="text-gray-900">{userData?.aina_name}</p>
                        )
                        }

                    </div>
                </div>
                )}
            </div>

            {/* Site Information */}
            {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h2>
                <div className="space-y-4">                                                            
                    <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Last System Update</h3>
                    <p className="text-gray-900">{siteInfo.lastUpdate}</p>
                    </div>
                </div>
            </div> */}
        </div>
        </>
    )
}