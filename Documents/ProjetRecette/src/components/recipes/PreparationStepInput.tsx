"use client";

import { Plus, Trash2 } from "lucide-react";
import type { PreparationStepInput as StepInput } from "@/types/database";

interface PreparationStepInputProps {
  steps: StepInput[];
  onChange: (steps: StepInput[]) => void;
}

export function PreparationStepInputList({
  steps,
  onChange,
}: PreparationStepInputProps) {
  function update(index: number, value: string) {
    onChange(
      steps.map((step, i) =>
        i === index ? { instruction: value } : step
      )
    );
  }

  function remove(index: number) {
    onChange(steps.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...steps, { instruction: "" }]);
  }

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-2 items-start">
          <span className="mt-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-medium text-rose-600">
            {index + 1}
          </span>
          <textarea
            className="input min-h-[80px] resize-y"
            placeholder={`Étape ${index + 1}`}
            value={step.instruction}
            onChange={(e) => update(index, e.target.value)}
            required={index === 0}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="btn-ghost !px-2 mt-1"
            aria-label="Supprimer l'étape"
            disabled={steps.length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-secondary">
        <Plus className="h-4 w-4" /> Ajouter une étape
      </button>
    </div>
  );
}
