import { useState } from "react";
import IngredientInput from "./components/IngredientInput";
import PreferencePanel from "./components/PreferencePanel";
import RecipeList from "./components/RecipeList";

function App() {
  // Ingredient state
  const [ingredients, setIngredients] = useState([]);

  // Recipe results state
  const [recipes, setRecipes] = useState([]);

  // Loading state for API calls
  const [loading, setLoading] = useState(false);

  // User preferences
  const [preferences, setPreferences] = useState({
    diet: "veg",
    cuisine: "any",
    time: "any",
    nutritionalGoal: "none",
    leftoverMinimizer: true,
  });

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-orange-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            🍳 ChefMate AI
          </h1>

          <p className="mt-2 text-lg opacity-90">
            Cook smarter. Waste less.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            <IngredientInput
              ingredients={ingredients}
              setIngredients={setIngredients}
            />

            <PreferencePanel
              preferences={preferences}
              setPreferences={setPreferences}
            />
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2">
            <RecipeList
              recipes={recipes}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
