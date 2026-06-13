import IngredientInput from "./components/IngredientInput";
import PreferencePanel from "./components/PreferencePanel";
import RecipeList from "./components/RecipeList";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold">
            🍳 ChefMate AI
          </h1>

          <p className="mt-2 text-lg opacity-90">
            Cook smarter. Waste less.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <IngredientInput />
            <PreferencePanel />
          </div>

          <div className="lg:col-span-2">
            <RecipeList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;   