import { useState } from "react";
import { Camera, ImageUp, ListPlus, Search, X } from "lucide-react";

/**
 * Lets users add ingredients from a fridge photo or typed grocery list.
 * @param {{
 * apiBaseUrl: string,
 * ingredients: string[],
 * setIngredients: (ingredients: string[]) => void,
 * onFindRecipes: () => void,
 * activeInput: "photo"|"text",
 * setActiveInput: (input: "photo"|"text") => void
 * }} props
 */
export default function IngredientInput({
  apiBaseUrl,
  ingredients,
  setIngredients,
  onFindRecipes,
  activeInput,
  setActiveInput,
}) {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const mergeIngredients = (items) => {
    const normalized = items
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    setIngredients([...new Set([...ingredients, ...normalized])]);
  };

  const addIngredients = () => {
    if (!input.trim()) return;

    mergeIngredients(input.split(/,|\n/));
    setInput("");
  };

  const removeIngredient = (item) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== item));
  };

  const handleImageSelect = (file) => {
    if (!file) return;

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError("");
  };

  const identifyIngredients = async () => {
    if (!selectedImage) {
      setUploadError("Choose a fridge or ingredient photo first.");
      return;
    }

    setExtracting(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch(`${apiBaseUrl}/api/extract-ingredients`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not identify ingredients.");
      }

      mergeIngredients(Array.isArray(data.ingredients) ? data.ingredients : []);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-xl font-semibold">Ingredients</h2>

      <div className="mb-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveInput("photo")}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
            activeInput === "photo"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Camera size={16} />
          Photo Upload
        </button>
        <button
          type="button"
          onClick={() => setActiveInput("text")}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
            activeInput === "text"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ListPlus size={16} />
          Type Manually
        </button>
      </div>

      {activeInput === "photo" ? (
        <div className="space-y-3">
          <label
            className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-200 bg-emerald-50/60 px-4 py-6 text-center transition hover:border-emerald-400"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              handleImageSelect(event.dataTransfer.files?.[0]);
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected ingredients"
                className="max-h-48 rounded-md object-cover"
              />
            ) : (
              <>
                <ImageUp className="mb-2 text-emerald-700" size={34} />
                <span className="text-sm font-medium text-slate-800">
                  Drop a photo here or click to upload
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  Supports common image formats
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => handleImageSelect(event.target.files?.[0])}
            />
          </label>

          <button
            type="button"
            onClick={identifyIngredients}
            disabled={extracting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Camera size={18} />
            {extracting ? "Identifying..." : "Identify Ingredients"}
          </button>

          {uploadError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {uploadError}
            </p>
          ) : null}
        </div>
      ) : (
        <div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows="5"
            placeholder="Type ingredients separated by commas or new lines..."
            className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <button
            type="button"
            onClick={addIngredients}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-800"
          >
            <ListPlus size={18} />
            Add Ingredients
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient}
            className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800"
          >
            {ingredient}
            <button
              type="button"
              onClick={() => removeIngredient(ingredient)}
              className="rounded-full p-0.5 hover:bg-emerald-200"
              aria-label={`Remove ${ingredient}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onFindRecipes}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
      >
        <Search size={18} />
        Find Recipes
      </button>
    </div>
  );
}
