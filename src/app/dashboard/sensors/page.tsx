"use client";

import { useState, useEffect } from "react";

interface Sensor {
  id: string;
  type: string;
  name: string;
  deployed: boolean;
  site: string;
  location: string;
}

const SITES = [
  { name: "Nation of Hawaii", locations: ["Loiʻi 1", "Loʻi 2", "Loʻi 3"] },
];

const SENSOR_TYPES = [
  "TDS",
  "pH",
  "Temperature",
  "Soil Moisture",
  "Turbidity",
  "Rainfall",
  "VOC",
  "Air Quality",
  "Weather",
  "Microcontroller",
  // Add more as needed
];

const SENSOR_STORAGE_KEY = "sensors";

const defaultSensors: Sensor[] = [
  { id: "ID1", type: "Rainfall", name: "Tipping Bucket Rainfall Sensor", deployed: true, site: "Nation of Hawaii", location: "Loiʻi 1" },
  { id: "ID2", type: "Liquid Level", name: "Non-contact Digital Liquid Level Sensor", deployed: false, site: "Nation of Hawaii", location: "Loʻi 2" },
  { id: "ID3", type: "Turbidity", name: "Analog Turbidity Sensor", deployed: true, site: "Nation of Hawaii", location: "Loʻi 3" },
];

function getInitialSensors(): Sensor[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(SENSOR_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  }
  return defaultSensors;
}

export default function SensorPage() {
  const [sensors, setSensors] = useState<Sensor[]>(getInitialSensors());
  const [view, setView] = useState<"table" | "card">("table");
  const [editing, setEditing] = useState<Sensor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Sensor>>({});

  useEffect(() => {
    localStorage.setItem(SENSOR_STORAGE_KEY, JSON.stringify(sensors));
  }, [sensors]);

  // Toggle deployed status
  const handleToggleDeployed = (id: string) => {
    setSensors(sensors => sensors.map(s => s.id === id ? { ...s, deployed: !s.deployed } : s));
  };

  // Delete sensor
  const handleDelete = (id: string) => {
    setSensors(sensors => sensors.filter(s => s.id !== id));
    setModalOpen(false);
  };

  // Open modal for edit or add
  const handleEdit = (sensor: Sensor) => {
    setEditing(sensor);
    setForm(sensor);
    setModalOpen(true);
  };
  const handleAdd = () => {
    setEditing(null);
    // auto-assign id as 'ID' + (max numeric part + 1)
    let nextIdNum = 1;
    if (sensors.length) {
      const maxIdNum = Math.max(
        ...sensors
          .filter(s => typeof s.id === 'string' && s.id.startsWith('ID'))
          .map(s => parseInt((s.id as string).replace('ID', '')) || 0)
      );
      nextIdNum = maxIdNum + 1;
    }
    const defaultSite = SITES[0]?.name || '';
    const defaultLocation = SITES[0]?.locations[0] || '';
    setForm({
      id: `ID${nextIdNum}`,
      type: SENSOR_TYPES[0],
      name: "",
      deployed: false,
      site: defaultSite,
      location: defaultLocation,
    });
    setModalOpen(true);
  };

  // Save sensor (edit or add)
  const handleSave = () => {
    if (!form.type || !form.name || !form.location) return;
    if (editing) {
      setSensors(sensors => sensors.map(s => s.id === (editing.id) ? { ...form as Sensor } : s));
    } else {
      setSensors(sensors => [...sensors, form as Sensor]);
    }
    setModalOpen(false);
    setEditing(null);
    setForm({});
  };

  // Card view
  const SensorCard = ({ sensor }: { sensor: Sensor }) => (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-2 relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <button onClick={() => handleEdit(sensor)} className="text-xs text-purple-600 underline">Edit</button>
        <button onClick={() => handleDelete(sensor.id)} className="text-xs text-red-600 underline">Delete</button>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">ID: {sensor.id}</span>
        <span className="ml-2">Type: {sensor.type}</span>
      </div>
      <div>Name: {sensor.name}</div>
      <div>Location: {sensor.location}</div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-gray-500">Deployed</span>
        <button
          onClick={() => handleToggleDeployed(sensor.id)}
          className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none ${sensor.deployed ? 'bg-green-500' : 'bg-gray-300'}`}
          aria-label="Toggle deployed"
        >
          <span
            className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${sensor.deployed ? 'translate-x-4' : ''}`}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sensors</h1>
        <div className="flex gap-2 items-center">
          <button
            className={`px-3 py-1 rounded ${view === "table" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => setView("table")}
          >
            Table View
          </button>
          <button
            className={`px-3 py-1 rounded ${view === "card" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => setView("card")}
          >
            Card View
          </button>
          <button
            className="ml-4 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
            onClick={handleAdd}
          >
            + Add Sensor
          </button>
        </div>
      </div>
      {view === "table" ? (
        <table className="min-w-full border border-gray-200 rounded-lg text-sm bg-white">
          <thead>
            <tr>
              <th className="p-2 border-b text-left">ID</th>
              <th className="p-2 border-b text-left">Type</th>
              <th className="p-2 border-b text-left">Name</th>
              <th className="p-2 border-b text-left">Deployed</th>
              <th className="p-2 border-b text-left">Location</th>
              <th className="p-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map(sensor => (
              <tr key={sensor.id}>
                <td className="p-2 border-b">{sensor.id}</td>
                <td className="p-2 border-b">{sensor.type}</td>
                <td className="p-2 border-b">{sensor.name}</td>
                <td className="p-2 border-b">
                  <button onClick={() => handleToggleDeployed(sensor.id)}>
                    <span className={`inline-block w-3 h-3 rounded-full ${sensor.deployed ? "bg-green-500" : "bg-gray-300"}`} title={sensor.deployed ? "Deployed" : "Not deployed"}></span>
                    {sensor.deployed ? " Yes" : " No"}
                  </button>
                </td>
                <td className="p-2 border-b">{sensor.location}</td>
                <td className="p-2 border-b">
                  <button onClick={() => handleEdit(sensor)} className="text-xs text-purple-600 underline mr-2">Edit</button>
                  <button onClick={() => handleDelete(sensor.id)} className="text-xs text-red-600 underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map(sensor => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      )}
      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => { setModalOpen(false); setEditing(null); }}
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Sensor" : "Add Sensor"}</h2>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col text-sm">
                ID
                <input
                  className="border rounded px-2 py-1 mt-1 bg-gray-100"
                  value={form.id}
                  disabled
                />
              </label>
              <label className="flex flex-col text-sm">
                Type
                <select
                  className="border rounded px-2 py-1 mt-1"
                  value={form.type || ""}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                >
                  {SENSOR_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm">
                Name
                <input
                  className="border rounded px-2 py-1 mt-1"
                  value={form.name || ""}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label className="flex flex-col text-sm">
                Site
                <select
                  className="border rounded px-2 py-1 mt-1"
                  value={form.site || ""}
                  onChange={e => {
                    const newSite = e.target.value;
                    const siteObj = SITES.find(s => s.name === newSite);
                    setForm(f => ({
                      ...f,
                      site: newSite,
                      location: siteObj && siteObj.locations.length > 0 ? siteObj.locations[0] : ""
                    }));
                  }}
                >
                  {SITES.map(site => (
                    <option key={site.name} value={site.name}>{site.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm">
                Location
                <select
                  className="border rounded px-2 py-1 mt-1"
                  value={form.location || ""}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                >
                  {(SITES.find(s => s.name === form.site)?.locations || []).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!form.deployed}
                  onChange={e => setForm(f => ({ ...f, deployed: e.target.checked }))}
                />
                Deployed
              </label>
              <button
                className="mt-4 px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-300"
                onClick={handleSave}
                disabled={!form.type || !form.name || !form.site || !form.location}
              >
                Save
              </button>
              {editing && (
                <button
                  className="mt-2 px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                  onClick={() => handleDelete(editing.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

