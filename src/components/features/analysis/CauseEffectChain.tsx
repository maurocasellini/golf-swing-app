"use client";

import { CauseEffectChain as CauseEffectChainType, SWING_PHASES } from "@/types/analysis";

interface CauseEffectChainProps {
  chain: CauseEffectChainType;
}

const NODE_STYLES = {
  fault: "bg-red-50 border-red-200 text-red-800",
  cause: "bg-orange-50 border-orange-200 text-orange-800",
  effect: "bg-yellow-50 border-yellow-200 text-yellow-800",
};

export default function CauseEffectChain({ chain }: CauseEffectChainProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h4 className="font-semibold text-gray-900 mb-4">{chain.title}</h4>

      {/* Chain nodes */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        {chain.nodes.map((node, i) => {
          const phaseLabel = SWING_PHASES.find((p) => p.key === node.phase)?.label || node.phase;
          return (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`flex-1 rounded-lg border p-3 ${NODE_STYLES[node.type]}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1">
                  {node.type} — {phaseLabel}
                </p>
                <p className="text-sm">{node.observation}</p>
              </div>
              {i < chain.nodes.length - 1 && (
                <>
                  <svg className="h-5 w-5 text-gray-300 flex-shrink-0 hidden sm:block" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <svg className="h-5 w-5 text-gray-300 flex-shrink-0 sm:hidden mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Correction */}
      <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600 mb-1">Correction</p>
        <p className="text-sm text-green-800">{chain.correction}</p>
      </div>
    </div>
  );
}
