import { useState } from "react";

export default function IngredientInput({
  ingredients,
  setIngredients,
}) {
  const [input, setInput] = useState("");

  const addIngredients = () => {
    if (!input.trim()) return;

    const newItems = input
      .split(/,|\n/)
      .map(item => item.trim())
      .filter(Boolean);

    setIngredients([
      ...new Set([...ingredients, ...newItems])
    ]);

    setInput("");
  };

  const removeIngredient = (item) => {
    setIngredients(
      ingredients.filter(i => i !== item)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Ingredients
      </h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows="4"
        placeholder="Enter ingredients separated by commas or new lines..."
        className="w-full border rounded-lg p-3"
      />

      <button
        onClick={addIngredients}
        className="mt-3 px-4 py-2 rounded-lg bg-green-600 text-white"
      >
        Add Ingredients
      </button>

      <div className="flex flex-wrap gap-2 mt-4">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient}
            className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2"
          >
            {ingredient}

            <button
              onClick={() => removeIngredient(ingredient)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}