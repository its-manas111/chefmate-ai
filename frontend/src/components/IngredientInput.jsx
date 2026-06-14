import { useState } from "react";
import { Camera, Upload, X, Check, AlertCircle } from "lucide-react";

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
  const [dragActive, setDragActive] = useState(false);

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

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError("");
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageSelect(files[0]);
    }
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
      // Reset image after successful extraction
      setSelectedImage(null);
      setPreviewUrl("");
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 hover:ring-slate-300/50 transition-all duration-300">
      {/* Header */}
      <h2 className="mb-1 text-lg font-semibold text-slate-900">Add Ingredients</h2>
      <p className="mb-5 text-xs text-slate-500">Build your ingredient list</p>

      {/* Tab Switcher */}
      <div className="mb-5 inline-flex items-center rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveInput("photo")}
          className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeInput === "photo"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Camera size={16} />
          Photo
        </button>
        <button
          type="button"
          onClick={() => setActiveInput("text")}
          className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeInput === "text"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Upload size={16} />
          Manual
        </button>
      </div>

      {/* Photo Upload Section */}
      {activeInput === "photo" && (
        <div className="space-y-4">
          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
              dragActive
                ? "border-emerald-400 bg-emerald-50/50"
                : "border-slate-300 bg-slate-50/50 hover:border-slate-400"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect(e.target.files?.[0])}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Upload ingredient image"
            />

            <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
              <div className={`mb-3 transition-transform duration-300 ${dragActive ? "scale-110" : ""}`}>
                <Upload
                  size={32}
                  className={`${dragActive ? "text-emerald-500" : "text-slate-400"}`}
                />
              </div>
              <p className="text-sm font-medium text-slate-900">
                Drop image here or click to browse
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="group relative overflow-hidden rounded-lg ring-1 ring-slate-200">
              <img
                src={previewUrl}
                alt="Ingredient preview"
                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl("");
                  setSelectedImage(null);
                  setUploadError("");
                }}
                className="absolute top-2 right-2 rounded-lg bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3 ring-1 ring-red-200">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-600" />
              <p className="text-xs text-red-700">{uploadError}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            type="button"
            onClick={identifyIngredients}
            disabled={!selectedImage || extracting}
            className="w-full rounded-lg bg-emerald-600 py-2.5 px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/30"
          >
            {extracting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Analyze Ingredients"
            )}
          </button>
        </div>
      )}

      {/* Manual Text Input Section */}
      {activeInput === "text" && (
        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                addIngredients();
              }
            }}
            placeholder="Type ingredients here (comma or line separated)&#10;e.g., chicken, tomato, garlic&#10;or paste from your shopping list"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all duration-200 resize-none"
            rows="4"
            aria-label="Ingredient text input"
          />

          <button
            type="button"
            onClick={addIngredients}
            disabled={!input.trim()}
            className="w-full rounded-lg bg-emerald-600 py-2.5 px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/30"
          >
            Add Ingredients
          </button>
        </div>
      )}

      {/* Ingredient Chips */}
      {ingredients.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="mb-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Your Ingredients ({ingredients.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <div
                key={ingredient}
                className="group relative animate-scale-in rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-900 ring-1 ring-emerald-200/50 hover:ring-emerald-300 transition-all duration-200 hover:shadow-md"
                style={{
                  animation: `scale-in 0.3s ease-out ${index * 50}ms both`,
                }}
              >
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 opacity-75" />
                  <span>{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient)}
                    className="ml-1 rounded-full hover:bg-emerald-200 p-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    aria-label={`Remove ${ingredient}`}
                  >
                    <X size={14} className="text-emerald-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Find Recipes Button */}
          <button
            type="button"
            onClick={onFindRecipes}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 py-3 px-4 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-105 active:scale-95"
          >
            Find Recipes
          </button>
        </div>
      )}
    </div>
  );
}
