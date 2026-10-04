"use client";

import { Plus, Trash2 } from "lucide-react";
import type { IngredientInput as IngredientInputType } from "@/types/database";

interface IngredientInputProps {
  ingredients: IngredientInputType[];
  onChange: (ingredients: IngredientInputType[]) => void;
}

export function IngredientInputList({
  ingredients,
  onChange,
}: IngredientInputProps) {
  function update(index: number, field: keyof IngredientInputType, value: string) {
    const next = ingredients.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(next);
  }

  function remove(index: number) {
    onChange(ingredients.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...ingredients, { quantity: "", unit: "", name: "" }]);
  }

  return (
    <div className="space-y-3">
      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-2 items-center"
        >
          <input
            className="input col-span-3"
            placeholder="Qté"
            value={ingredient.quantity}
            onChange={(e) => update(index, "quantity", e.target.value)}
          />
          <input
            className="input col-span-3"
            placeholder="Unité"
            value={ingredient.unit}
            onChange={(e) => update(index, "unit", e.target.value)}
          />
          <input
            className="input col-span-5"
            placeholder="Ingrédient"
            value={ingredient.name}
            onChange={(e) => update(index, "name", e.target.value)}
            required={index === 0}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="col-span-1 btn-ghost !px-2"
            aria-label="Supprimer l'ingrédient"
            disabled={ingredients.length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-secondary">
        <Plus className="h-4 w-4" /> Ajouter un ingrédient
      </button>
    </div>
  );
}
