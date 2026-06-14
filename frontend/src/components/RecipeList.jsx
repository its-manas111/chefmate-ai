import RecipeCard from "./RecipeCard";
import LoadingSpinner from "./LoadingSpinner";
import { AlertCircle, ChefHat, RotateCcw } from "lucide-react";

/**
 * Renders recipe results, including loading, empty, and error states.
 * @param {{ recipes: object[], loading: boolean, error: string }} props
 */
export default function RecipeList({ recipes, loading, error }) {
  const recipeItems = Array.isArray(recipes)
    ? [...recipes].sort((a, b) => Number(b.matchScore || 0) - Number(a.matchScore || 0))
    : [];

  return (
    <div className="min-h-[500px] rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50 hover:ring-slate-300/50 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">Recipe Results</h2>
        <p className="mb-6 text-xs text-slate-500">
          {loading ? "Searching..." : `Found ${recipeItems.length} ${recipeItems.length === 1 ? "recipe" : "recipes"}`}
        </p>

        {loading ? (
          // Premium Loading State
          <LoadingSpinner />
        ) : error ? (
          // Error State
          <div className="rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 p-6 ring-1 ring-red-200/50">
            <div className="flex gap-4">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Couldn't generate recipes</h3>
                <p className="mt-1 text-sm text-red-800">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-95"
                >
                  <RotateCcw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : recipeItems.length === 0 ? (
          // Empty State
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center ring-1 ring-slate-200/50">
            <div className="mb-4 text-5xl">🍽️</div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Add ingredients to get started
            </h3>
            <p className="text-sm text-slate-600">
              Upload a fridge photo or type in your available ingredients, then we'll find delicious recipes for you.
            </p>
          </div>
        ) : (
          // Recipe Grid
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {recipeItems.map((recipe, index) => (
              <div
                key={recipe.id || recipe.name}
                className={`stagger-${(index % 6) + 1}`}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
