"use client";

import { useState } from "react";
import { LaunchMonitorData } from "@/types/launch-monitor";

interface LaunchMonitorInputProps {
  value: LaunchMonitorData;
  onChange: (data: LaunchMonitorData) => void;
}

const FIELDS: { key: keyof LaunchMonitorData; label: string; unit: string; placeholder: string }[] = [
  { key: "clubSpeed", label: "Club Speed", unit: "mph", placeholder: "95" },
  { key: "ballSpeed", label: "Ball Speed", unit: "mph", placeholder: "140" },
  { key: "launchAngle", label: "Launch Angle", unit: "°", placeholder: "12.5" },
  { key: "spinRate", label: "Spin Rate", unit: "rpm", placeholder: "2700" },
  { key: "carryDistance", label: "Carry", unit: "yds", placeholder: "230" },
  { key: "totalDistance", label: "Total", unit: "yds", placeholder: "250" },
  { key: "clubPath", label: "Club Path", unit: "°", placeholder: "2.0" },
  { key: "faceAngle", label: "Face Angle", unit: "°", placeholder: "-1.5" },
  { key: "attackAngle", label: "Attack Angle", unit: "°", placeholder: "-3.2" },
  { key: "smashFactor", label: "Smash Factor", unit: "", placeholder: "1.48" },
];

export default function LaunchMonitorInput({ value, onChange }: LaunchMonitorInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof LaunchMonitorData, raw: string) => {
    const num = raw === "" ? undefined : parseFloat(raw);
    onChange({ ...value, [key]: isNaN(num as number) ? undefined : num });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <p className="font-medium text-gray-700 text-sm">Launch Monitor Data</p>
          <p className="text-xs text-gray-500">Optional — add TrackMan / Flightscope data</p>
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 p-4 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {FIELDS.map(({ key, label, unit, placeholder }) => (
              <div key={key}>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                  {label} {unit && <span className="text-gray-400">({unit})</span>}
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder={placeholder}
                  value={value[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-golf-500 focus:outline-none focus:ring-1 focus:ring-golf-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
