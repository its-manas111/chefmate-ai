import { useState } from "react";
import IngredientInput from "./components/IngredientInput";
import PreferencePanel from "./components/PreferencePanel";
import RecipeList from "./components/RecipeList";
import { Sparkles } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeInput, setActiveInput] = useState("photo");

  const [preferences, setPreferences] = useState({
    diet: "veg",
    timeMinutes: "any",
    cuisine: "any",
    leftoverMinimizer: true,
    nutritionalGoal: "none",
  });

  const findRecipes = async () => {
    if (ingredients.length === 0) {
      setError(
        "Add at least one ingredient before searching for recipes."
      );
      setRecipes([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/get-recipes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ingredients,
            preferences,
          }),
        }
      );

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch recipes."
        );
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setRecipes(
        Array.isArray(data.recipes)
          ? data.recipes
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while fetching recipes."
      );

      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const filters = [];
    
    if (preferences.diet !== "veg") {
      const dietIcons = {
        "veg": "🥗",
        "eggetarian": "🍳",
        "non-veg": "🍖",
      };
      const dietLabels = {
        "veg": "Vegetarian",
        "eggetarian": "Eggetarian",
        "non-veg": "Non-Veg",
      };
      filters.push({
        id: "diet",
        label: `${dietIcons[preferences.diet]} ${dietLabels[preferences.diet]}`,
      });
    }

    if (preferences.timeMinutes !== "any") {
      filters.push({
        id: "time",
        label: `⏱️ Under ${preferences.timeMinutes} mins`,
      });
    }

    if (preferences.cuisine !== "any") {
      const cuisineIcons = {
        "indian": "🇮🇳",
        "italian": "🍝",
        "chinese": "🥡",
        "mexican": "🌮",
        "mediterranean": "🫒",
        "thai": "🌶️",
        "american": "🍔",
      };
      filters.push({
        id: "cuisine",
        label: `${cuisineIcons[preferences.cuisine] || "🌍"} ${preferences.cuisine.charAt(0).toUpperCase() + preferences.cuisine.slice(1)}`,
      });
    }

    if (preferences.nutritionalGoal !== "none") {
      const nutritionIcons = {
        "high-protein": "💪",
        "weight-loss": "🥬",
        "low-carb": "🥑",
      };
      filters.push({
        id: "nutrition",
        label: `${nutritionIcons[preferences.nutritionalGoal] || "🌟"} ${preferences.nutritionalGoal.replace("-", " ").charAt(0).toUpperCase() + preferences.nutritionalGoal.slice(1)}`,
      });
    }

    if (preferences.leftoverMinimizer) {
      filters.push({
        id: "waste",
        label: "♻️ Waste Less Mode",
      });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900">
      {/* Premium Hero Header */}
      <header className="relative overflow-hidden border-b border-emerald-100/50 bg-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        {/* Glass effect gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-orange-500/5 to-emerald-500/5" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-orange-500 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-700">
                    ChefMate AI
                  </h1>
                  <p className="text-xs md:text-sm font-medium text-slate-600 mt-1">
                    Cook smarter. Waste less.
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
                Discover delicious recipes from your available ingredients. Smart recommendations that minimize food waste.
              </p>
            </div>

            {/* AI Badge */}
            <div className="hidden sm:block">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-orange-50 px-4 py-2 ring-1 ring-emerald-200/50">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="border-b border-slate-200/50 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-5 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Applied Filters:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/50 animate-scale-in"
                  >
                    {filter.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <IngredientInput
              apiBaseUrl={API_BASE_URL}
              ingredients={ingredients}
              setIngredients={setIngredients}
              onFindRecipes={findRecipes}
              activeInput={activeInput}
              setActiveInput={setActiveInput}
            />

            <PreferencePanel
              preferences={preferences}
              setPreferences={setPreferences}
            />
          </aside>

          {/* Recipe Section */}
          <section>
            <RecipeList
              recipes={recipes}
              loading={loading}
              error={error}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;