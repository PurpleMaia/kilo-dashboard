'use client'

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const handleLogout = async () => {
        setLoading(true)

        // Call server logout        
        const response = await fetch('/api/signout', {
            method: 'POST',
        });
        
        if (!response.ok) {
            throw new Error('Logout failed');
        }

        setLoading(false)
        router.push('/')
    }

    return (
        <>
            <Button variant='outline' onClick={handleLogout}>
                {loading ? 'Logging out...' : 'Logout'}
            </Button>
        </>
    )
}