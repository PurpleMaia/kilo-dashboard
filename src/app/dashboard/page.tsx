import WeatherWidget from "../components/dashboard/WeatherWidget";
import MahinaWidget from "../components/dashboard/MahinaWidget";
import SensorWidget from "../components/dashboard/SensorWidget";
import SolsticeWidget from "../components/dashboard/SolsticeWidget";

export default async function Page() {
    return (
        <div className="h-full flex bg-gray-50">
        <div className="flex-1 flex flex-col">

        
        <main className="flex-1 p-3 md:p-6 md:overflow-hidden overflow-auto">
          <div className="max-w-full space-y-4 md:space-y-6 h-full md:flex md:flex-col">
            {/* Top Widgets Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 md:flex-shrink-0">
              <WeatherWidget />
              <SolsticeWidget />
              <MahinaWidget />
              <SensorWidget />
              
            </div>
            
            {/* Main Content - Side by Side Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 md:flex-1 md:min-h-0">
              {/* Left Column - Sensor Readings */}
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Sensor Readings</h2>
                {/* <SensorDataChart /> */}
              </div>
              
              {/* Right Column - Diary Entries */}
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Field Diary</h2>
                <div className="space-y-4">
                  {/* <QualitativeObservations /> */}
                  {/* <DataInsights /> */}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
    );
}