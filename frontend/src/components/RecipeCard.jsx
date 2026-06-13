import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, ShoppingCart } from "lucide-react";

const cuisineLabels = {
  indian: "Indian",
  italian: "Italian",
  chinese: "Chinese",
  mexican: "Mexican",
  mediterranean: "Mediterranean",
  thai: "Thai",
  american: "American",
};

const dietLabels = {
  veg: "Veg",
  eggetarian: "Egg",
  "non-veg": "Non-Veg",
};

/**
 * Displays one ranked recipe with ingredient matching, nutrition, and citation.
 * @param {{
 * recipe: {
 * name: string,
 * cuisine: string,
 * timeMinutes: number,
 * diet: string,
 * matchScore: number,
 * availableIngredients: string[],
 * missingIngredients: string[],
 * steps: string[],
 * nutrition: { calories: number, protein: string, carbs: string },
 * citation: string,
 * tags: string[]
 * }
 * }} props
 */
export default function RecipeCard({ recipe }) {
  const [expanded, setExpanded] = useState(false);
  const available = recipe.availableIngredients || [];
  const missing = recipe.missingIngredients || [];
  const totalIngredients = available.length + missing.length;
  const matchScore = Math.max(0, Math.min(100, Number(recipe.matchScore || 0)));
  const cuisineKey = recipe.cuisine?.toLowerCase?.() || "any";

  return (
    <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-snug text-slate-950">
            {recipe.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">
              {dietLabels[recipe.diet] || recipe.diet || "Diet"}
            </span>
            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-orange-700">
              {cuisineLabels[cuisineKey] || recipe.cuisine || "Any Cuisine"}
            </span>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-700">
          <Clock size={14} />
          {recipe.timeMinutes || "Any"} min
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">
            You have {available.length}/{totalIngredients || available.length} ingredients
          </span>
          <span className="font-semibold text-emerald-700">{matchScore}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-emerald-600"
            style={{ width: `${matchScore}%` }}
          />
        </div>
      </div>

      {available.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            Available
          </p>
          <div className="flex flex-wrap gap-2">
            {available.map((ingredient) => (
              <span
                key={ingredient}
                className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {missing.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            Missing
          </p>
          <div className="flex flex-wrap gap-2">
            {missing.map((ingredient) => (
              <span
                key={ingredient}
                className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
              >
                <ShoppingCart size={12} />
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3 text-center text-sm">
        <div>
          <p className="text-xs text-slate-500">Calories</p>
          <p className="font-semibold">{recipe.nutrition?.calories || "n/a"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Protein</p>
          <p className="font-semibold">{recipe.nutrition?.protein || "n/a"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Carbs</p>
          <p className="font-semibold">{recipe.nutrition?.carbs || "n/a"}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {expanded ? "Hide Steps" : "See Steps"}
      </button>

      {expanded ? (
        <ol className="mt-4 space-y-2 text-sm text-slate-700">
          {(recipe.steps || []).map((step, index) => (
            <li key={`${step}-${index}`} className="flex gap-2">
              <span className="font-semibold text-emerald-700">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <footer className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-500">
        Source: {recipe.citation || "Foundry IQ knowledge base"}
      </footer>
    </article>
  );
}
