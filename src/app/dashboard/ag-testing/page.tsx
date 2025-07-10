'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { recentTests } from "../../../../data/sample_data";
import TestDetailPopup from "./components/TestDetailPopup";

interface Test {
  id: string;
  type: string;
  date: string;
  sampler: string;
  data: Array<{
    site: string;
    [key: string]: string | number | undefined;
  }>;
}

export default function AgTesting() {  
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCardClick = (test: Test) => {
    setSelectedTest(test);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedTest(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 space-y-6">
        {recentTests.map((test) => (
          <div key={test.id}>
            <Card 
              className="border-gray-300 shadow-md bg-white cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
              onClick={() => handleCardClick(test)}
            >
              <CardHeader>
                <CardTitle>
                  {test.type}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex grow gap-2">
                    <p className="font-bold">Sampled by: </p>
                    {test.sampler}
                  </div>                              
                  <div className="flex grow gap-2">
                    <p className="font-bold">Date: </p>
                    {test.date}
                  </div>          

                  <div className="grid grid-cols-2">

                  </div>                          
                </div>  
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <TestDetailPopup
        test={selectedTest}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  );
}
