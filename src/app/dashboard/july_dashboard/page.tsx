import Card from "@/app/components/dashboard/Card";
import WeatherCard from "./Weather";
import MoonPhaseCard from "./MoonPhase";
import SolsticeCard from "./Solstice";
import SensorSummary from "./SensorSummary";
import AgTestingSummary from "./AgTestingSummary";
import JournalPanel from "./JournalPanel";
import SensorDataPanel from "./SensorDataPanel";

export default function JulyDashboard() {
  return (
    <div className="flex h-full">
      {/* The SideNav will be rendered by the dashboard layout automatically */}
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-6 items-center w-full">
          <div className="flex flex-col gap-4 w-full max-w-3xl">
            <Card title="Weather Summary">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <div className="font-semibold text-gray-700 mb-1">Weather</div>
                  <WeatherCard />
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-semibold text-gray-700 mb-1">Moon</div>
                  <MoonPhaseCard />
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-semibold text-gray-700 mb-1">SOLSTICE</div>
                  <SolsticeCard />
                </div>
              </div>
            </Card>
            <SensorSummary />
            <AgTestingSummary />
            <div className="flex flex-col md:flex-row gap-6 mt-6 w-full">
              <div className="flex-1 min-w-0">
                <JournalPanel />
              </div>
              <div className="flex-1 min-w-0">
                <SensorDataPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
