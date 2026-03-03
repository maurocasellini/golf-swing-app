"use client";

import { Drill } from "@/types/analysis";

interface DrillCardProps {
  drill: Drill;
}

export default function DrillCard({ drill }: DrillCardProps) {
  const priorityColors = {
    1: "bg-golf-700 text-white",
    2: "bg-golf-500 text-white",
    3: "bg-golf-300 text-golf-900",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold flex-shrink-0 ${priorityColors[drill.priority]}`}>
          {drill.priority}
        </span>
        <div>
          <h4 className="font-semibold text-gray-900">{drill.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">Targets: {drill.targetFault}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">{drill.description}</p>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-gray-50 p-2">
          <p className="text-[10px] font-semibold text-gray-500 uppercase">Equipment</p>
          <p className="text-xs text-gray-700 mt-0.5">{drill.equipmentNeeded}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <p className="text-[10px] font-semibold text-gray-500 uppercase">Reps</p>
          <p className="text-xs text-gray-700 mt-0.5">{drill.repetitions}</p>
        </div>
        <div className="rounded-lg bg-golf-50 p-2">
          <p className="text-[10px] font-semibold text-golf-700 uppercase">Feel Cue</p>
          <p className="text-xs text-golf-800 mt-0.5">{drill.feelCue}</p>
        </div>
      </div>
    </div>
  );
}
