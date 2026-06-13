import RecipeCard from "./RecipeCard";

/**
 * Renders recipe results, including loading, empty, and error states.
 * @param {{ recipes: object[], loading: boolean, error: string }} props
 */
export default function RecipeList({ recipes, loading, error }) {
  const recipeItems = Array.isArray(recipes)
    ? [...recipes].sort((a, b) => Number(b.matchScore || 0) - Number(a.matchScore || 0))
    : [];

  return (
    <div className="min-h-[500px] rounded-lg bg-white/60 p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-xl font-semibold">Recipe Results</h2>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-lg bg-white p-5 ring-1 ring-slate-200"
            >
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
              <div className="mt-6 h-2 rounded bg-slate-200" />
              <div className="mt-6 flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((chip) => (
                  <div key={chip} className="h-7 w-20 rounded-full bg-slate-200" />
                ))}
              </div>
              <div className="mt-8 h-20 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : recipeItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No recipes found. Try adding more ingredients or changing preferences.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {recipeItems.map((recipe) => (
            <RecipeCard key={recipe.id || recipe.name} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
