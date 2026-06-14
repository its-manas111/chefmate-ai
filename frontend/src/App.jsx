import { useState } from "react";
import IngredientInput from "./components/IngredientInput";
import PreferencePanel from "./components/PreferencePanel";
import RecipeList from "./components/RecipeList";

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

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="bg-gradient-to-r from-emerald-700 via-lime-600 to-orange-500 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">
            ChefMate AI
          </h1>

          <p className="mt-2 max-w-2xl text-base text-white/90 md:text-lg">
            Smart recipe suggestions from your fridge,
            grocery list, and cooking preferences.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
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