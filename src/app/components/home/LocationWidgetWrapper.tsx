
import { fetchSensorsData } from "../../lib/data";
import LocationWidget from "./LocationWidget";

export default async function LocationWidgetWrapper() {
  const locations = await fetchSensorsData();
  return <LocationWidget locations={locations} />;
}