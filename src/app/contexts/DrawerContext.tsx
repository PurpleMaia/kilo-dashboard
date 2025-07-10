'use client'
import { createContext, useContext, useState } from 'react';

interface DrawerContextType {
    isOpen: boolean,
    openDrawer: () => void,
    closeDrawer: () => void,
}
const DrawerContext = createContext<DrawerContextType | undefined>(undefined)    

export function DrawerProvider({ children }: {children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    // callable functions from anywhere
    const openDrawer = () => setIsOpen(true) 
    const closeDrawer = () => setIsOpen(false)

    return (
        <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
            {children}
        </DrawerContext.Provider>
    )
}

export const useDrawer = () => {
    const context = useContext(DrawerContext);
    if (context === undefined) {
        throw new Error('useDrawer must be used within a DrawerProvider');
    }
    return context;
}