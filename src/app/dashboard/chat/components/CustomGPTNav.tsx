import { Button } from "@/app/ui/button"
import { SquareArrowOutUpRight } from "lucide-react"
import Link from "next/link"

export default function CustomGPTNavButton() {
    const CUSTOMGPTLINK = "https://chatgpt.com/g/g-68702795ac3c81919a1376b2ba0f785a-kilo-llm-ike-aina-intelligence"
    return (
        <>
            <Link href={CUSTOMGPTLINK} target='_blank' rel="noopener noreferrer" >
                <Button variant="outline" className="bg-white border-gray-400 text-gray-600 shadow-md">
                        
                        <SquareArrowOutUpRight className="!w-6 !h-6" />
                        Go to Kilo LLM Custom GPT
                </Button>
            </Link>
        </>
    )

}