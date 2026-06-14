import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Flame, Zap, Leaf, ShoppingCart, CheckCircle2 } from "lucide-react";

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
  veg: "Vegetarian",
  eggetarian: "Eggetarian",
  "non-veg": "Non-Veg",
};

const dietColors = {
  veg: {
    background: "from-green-50 to-emerald-50",
    border: "ring-green-200",
    badge: "bg-green-100 text-green-800",
    icon: "🥗",
    score: {
      high: "bg-green-500",
      medium: "bg-lime-500",
      low: "bg-amber-500",
    }
  },
  eggetarian: {
    background: "from-amber-50 to-orange-50",
    border: "ring-amber-200",
    badge: "bg-amber-100 text-amber-800",
    icon: "🍳",
    score: {
      high: "bg-green-500",
      medium: "bg-lime-500",
      low: "bg-amber-500",
    }
  },
  "non-veg": {
    background: "from-red-50 to-rose-50",
    border: "ring-red-200",
    badge: "bg-red-100 text-red-800",
    icon: "🍖",
    score: {
      high: "bg-green-500",
      medium: "bg-lime-500",
      low: "bg-amber-500",
    }
  },
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
  const dietKey = recipe.diet?.toLowerCase?.() || "veg";
  const dietColor = dietColors[dietKey] || dietColors.veg;

  // Determine score color
  const getScoreColor = () => {
    if (matchScore >= 90) return "bg-green-500";
    if (matchScore >= 70) return "bg-lime-500";
    if (matchScore >= 50) return "bg-amber-500";
    return "bg-slate-400";
  };

  const getScoreBgColor = () => {
    if (matchScore >= 90) return "bg-green-50";
    if (matchScore >= 70) return "bg-lime-50";
    if (matchScore >= 50) return "bg-amber-50";
    return "bg-slate-100";
  };

  return (
    <article className={`group rounded-2xl bg-gradient-to-br ${dietColor.background} p-5 shadow-sm ring-1 ${dietColor.border} transition-all duration-300 hover:shadow-lg hover:ring-opacity-100 animate-fade-in-up`}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold leading-snug text-slate-950 line-clamp-2 group-hover:text-emerald-700 transition-colors">
              {recipe.name}
            </h3>
          </div>

          {/* Match Score Badge */}
          <div className={`flex-shrink-0 rounded-full ${getScoreBgColor()} px-3 py-1.5 min-w-fit`}>
            <div className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${getScoreColor()}`} />
              <span className="text-sm font-bold text-slate-900">{matchScore}%</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full ${dietColor.badge} px-3 py-1 text-xs font-semibold`}>
            <span>{dietColor.icon}</span>
            {dietLabels[dietKey] || recipe.diet || "Diet"}
          </span>
          
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
            <span>🌍</span>
            {cuisineLabels[cuisineKey] || recipe.cuisine || "Any"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            <Clock size={12} />
            {recipe.timeMinutes || "?"} min
          </span>
        </div>
      </div>

      {/* Match Score Bar */}
      <div className="mb-4 space-y-2 py-3 border-y border-slate-200/50">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">
            {available.length}/{totalIngredients || available.length} ingredients available
          </span>
          {available.length === totalIngredients && (
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 size={14} />
              Complete
            </span>
          )}
        </div>
        <div className="h-2.5 rounded-full bg-slate-200/60 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getScoreColor()}`}
            style={{ width: `${matchScore}%` }}
          />
        </div>
      </div>

      {/* Available Ingredients */}
      {available.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">
            ✓ Have ({available.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {available.slice(0, 6).map((ingredient) => (
              <span
                key={ingredient}
                className="inline-flex items-center gap-1 rounded-full bg-white/70 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-emerald-200/50 hover:ring-emerald-300 transition-all"
              >
                <CheckCircle2 size={12} className="text-emerald-600" />
                {ingredient}
              </span>
            ))}
            {available.length > 6 && (
              <span className="text-xs text-slate-500 px-2 py-1">+{available.length - 6} more</span>
            )}
          </div>
        </div>
      )}

      {/* Missing Ingredients */}
      {missing.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">
            🛒 Need ({missing.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missing.slice(0, 6).map((ingredient) => (
              <span
                key={ingredient}
                className="inline-flex items-center gap-1 rounded-full bg-white/70 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200/50 hover:ring-amber-300 transition-all"
              >
                <ShoppingCart size={12} />
                {ingredient}
              </span>
            ))}
            {missing.length > 6 && (
              <span className="text-xs text-slate-500 px-2 py-1">+{missing.length - 6} more</span>
            )}
          </div>
        </div>
      )}

      {/* Nutrition Info */}
      <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg bg-white/50 backdrop-blur-sm p-3 text-center text-sm">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-600">🔥 Calories</p>
          <p className="text-sm font-bold text-slate-900">{recipe.nutrition?.calories || "—"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-600">💪 Protein</p>
          <p className="text-sm font-bold text-slate-900">{recipe.nutrition?.protein || "—"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-600">🍞 Carbs</p>
          <p className="text-sm font-bold text-slate-900">{recipe.nutrition?.carbs || "—"}</p>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300/50 bg-white/50 backdrop-blur-sm px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-white hover:border-slate-400 active:scale-95"
      >
        {expanded ? (
          <>
            <ChevronUp size={16} />
            Hide Steps
          </>
        ) : (
          <>
            <ChevronDown size={16} />
            View Steps
          </>
        )}
      </button>

      {/* Steps (Expanded) */}
      {expanded && (
        <div className="mt-4 space-y-3 border-t border-slate-200/50 pt-4 animate-fade-in-up">
          {(recipe.steps || []).map((step, index) => (
            <div
              key={`${step}-${index}`}
              className="flex gap-3 rounded-lg bg-white/50 backdrop-blur-sm p-3"
              style={{
                animation: `fade-in-up 0.3s ease-out ${index * 50}ms both`,
              }}
            >
              <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700 text-xs">
                {index + 1}
              </div>
              <p className="flex-1 text-sm text-slate-700 leading-relaxed">{step}</p>
            </div>
          ))}

          {/* Source */}
          <div className="border-t border-slate-200/50 pt-3">
            <p className="text-xs text-slate-500">
              📚 Source: <span className="font-medium">{recipe.citation || "Recipe Database"}</span>
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
