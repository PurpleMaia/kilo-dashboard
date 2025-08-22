'use client'

import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
// import { useState } from "react"

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
    // const [file, setFile] = useState<File | null>(null)
    // const [image, setImage] = useState<File | null>(null)

    const onSubmit = async (data: KiloFormType) => {
        // Handle form data, file, and image upload logic here
        console.log(data)
        reset()
    }

    return (
        <div className="border rounded-lg shadow-lg h-full border-gray-300 bg-white mx-auto p-4">        
            <h1 className="text-gray-600 text-md font-semibold mb-2">
                Please write down your kilo observations.
            </h1>

            <h1 className="text-gray-600 text-md">
                Some guiding questions:
            </h1>

            <div className="font-light text-gray-600 mx-4 mb-2">               
                    <li> What is the water like? (flow, temp) </li>
                    <li> What is the climate like? (rain, wind, clouds) </li>
                    <li> Any new findings in the plants or animals? </li>
                    <li> Any new findings within yourself? </li>                
                </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                <textarea
                    {...register('description')}
                    placeholder="What do you observe?"
                    className="overflow-y-auto touch-none border-2 border-gray-400 shadow-sm rounded p-2 h-96 resize-y focus:outline-none focus:border-lime-600 transition-colors"
                />
                {errors.description && <span className="text-red-500 text-xs">{errors.description.message as string}</span>}
                {/* <div className="flex flex-col md:flex-row gap-2 mt-4">
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
                </div> */}
                <Button type="submit" className="mt-2 w-full bg-lime-800 text-white" >Submit</Button>                
            </form>
        </div>
    )
}