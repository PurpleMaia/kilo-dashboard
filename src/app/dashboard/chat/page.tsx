import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import ExportDataButton from "./components/ExportData";

export default function Chat() {

    return (
        <>
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Talk to Kilo LLM
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        instructions <ExportDataButton />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}