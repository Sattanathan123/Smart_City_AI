import React, { useState, useEffect } from "react";
import { Brain, HelpCircle, TrendingUp, Info } from "lucide-react";
import { shapApi, ShapExplanationResponse } from "@/lib/api";

interface ShapExplanationCardProps {
  modelType?: "conflict" | "priority";
  payload?: Record<string, any>;
}

export const ShapExplanationCard: React.FC<ShapExplanationCardProps> = ({
  modelType = "conflict",
  payload = {},
}) => {
  const [data, setData] = useState<ShapExplanationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    shapApi
      .getExplanation({ modelType, ...payload })
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [modelType, JSON.stringify(payload)]);

  if (loading) {
    return (
      <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#64748B] flex items-center gap-2">
        <Brain className="h-4 w-4 animate-spin text-[#1E3A8A]" />
        Computing SHAP Feature Importance Tensors...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-[#1E3A8A]" />
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">SHAP Explainability & Feature Importance</h3>
            <p className="text-[11px] text-[#64748B]">
              Why this AI model generated this {modelType.toUpperCase()} prediction
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-[#1E3A8A]">
          <TrendingUp className="h-3 w-3" /> SHAP v0.42 Tensor Engine
        </span>
      </div>

      <p className="text-xs text-[#334155] bg-slate-50 p-3 rounded-lg border border-[#E2E8F0] font-medium leading-relaxed">
        <strong>Summary:</strong> {data.explanationSummary}
      </p>

      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="h-3.5 w-3.5 text-[#1E3A8A]" /> Feature Weight Contribution Matrix
        </h4>
        {data.features.map((f, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#0F172A]">
              <span>{f.feature}</span>
              <span className={f.impactType === "POSITIVE" ? "text-emerald-700" : "text-amber-700"}>
                {f.percentage}% ({f.weight > 0 ? `+${f.weight}` : f.weight})
              </span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  f.impactType === "POSITIVE" ? "bg-[#1E3A8A]" : "bg-amber-500"
                }`}
                style={{ width: `${Math.max(5, f.percentage)}%` }}
              />
            </div>
            <p className="text-[10px] text-[#64748B] flex items-center gap-1">
              <Info className="h-2.5 w-2.5 shrink-0 text-[#94A3B8]" /> {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
