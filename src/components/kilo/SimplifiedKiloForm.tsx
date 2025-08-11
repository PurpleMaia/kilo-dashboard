'use client'

import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from "react"
import { Moon } from "lucide-react"

// Define a simple kilo schema
const kiloSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    video: z.any().optional(),
    image: z.any().optional(),
})
type KiloFormType = z.infer<typeof kiloSchema>

export default function SimplifiedKiloForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<KiloFormType>({
        resolver: zodResolver(kiloSchema),
    })
    const [file, setFile] = useState<File | null>(null)
    const [image, setImage] = useState<File | null>(null)

    const onSubmit = async (data: KiloFormType) => {
        // Handle form data, file, and image upload logic here
        console.log(data)
        reset()
    }

    return (
        <div className="border rounded-lg shadow-md border-gray-300 bg-white max-w-xl mx-auto p-6">        
            <p className="mb-4 text-gray-600 text-md">
                Please write down your kilo observations and where you are.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                <div className="border border-gray-300 rounded-lg shadow-sm p-4 mb-2 bg-gray-50">
                    <h3 className="text-lg font-bold mb-2 text-gray-700 gap-2 flex items-center"><Moon className="h-5 w-5"></Moon>Mahina</h3>
                    <p className="text-md font-semibold text-gray-700"> Akua </p>
                    <p> Support vegetative growth; consider foliar feed</p>
                </div>

                <textarea
                    {...register('description')}
                    placeholder="Describe your kilo..."
                    className="border border-gray-400 shadow-sm rounded p-2 min-h-28 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.description && <span className="text-red-500 text-xs">{errors.description.message as string}</span>}
                <div className="flex flex-col md:flex-row gap-2 mt-4">
                    <label className="flex-1 flex flex-col items-start">
                        <span className="text-xs text-gray-500 mb-1">Attach a video (optional)</span>
                        <input
                            type="file"
                            accept="video/*"
                            {...register('video')}
                            className="file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold file:cursor-pointer"
                        />
                    </label>
                    <label className="flex-1 flex flex-col items-start">
                        <span className="text-xs text-gray-500 mb-1">Attach a picture (optional)</span>
                        <input
                            type="file"
                            accept="image/*"
                            {...register('image')}
                            className="file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-green-50 file:text-green-700 file:font-semibold file:cursor-pointer"
                        />
                    </label>
                </div>
                <Button type="submit" className="mt-2 w-full bg-lime-800 text-white" >Submit</Button>
            </form>
        </div>
    )
}