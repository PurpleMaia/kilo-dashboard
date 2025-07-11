import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import DownloadDataButton from "./components/DownloadData";
import CustomGPTNavButton from "./components/CustomGPTNav";

export default function Chat() {

    return (
        <>
            <div className="p-4">
                <Card className="bg-white border border-gray-300 shadow-md">
                    <CardHeader>
                        <CardTitle>
                            Talk to Kilo LLM
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">1. Download your data</h2>
                        </div>
                        <ul className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>Click the Download Data button below.</li>
                            <li>Choose a secure folder on your device and save the file(s).</li>
                            <li>Make a note of the filename(s) (e.g. <code className="bg-gray-100 px-1 rounded">sensor_data_2025-07-11.csv</code>).</li>
                        </ul>
                        
                        <div className="flex justify-center my-4">
                            <DownloadDataButton />
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Upload to Kilo LLM Custom GPT</h2>
                            <p className="text-gray-700 mb-4">
                            Below is a link to the Kilo LLM Custom GPT made by Purple Maiʻa Foundation&apos;s ʻĀina Foundry Builders Team.                                                    
                            </p>

                            <p className="text-gray-700 mb-4">
                            When you are ready to prompt the GPT, upload the data you just downloaded into the prompt. When your files appear, the GPT is ready to answer questions about your data.
                            </p>

                            <div className="flex justify-center my-4">
                                <CustomGPTNavButton />
                            </div>                            

                        </div>

                    </CardContent>
                </Card>
            </div>
        </>
    )
}