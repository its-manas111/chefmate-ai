/**
 * Preference controls used to personalize recipe search and ranking.
 * @param {{
 * preferences: {
 * diet: string,
 * timeMinutes: string,
 * cuisine: string,
 * leftoverMinimizer: boolean,
 * nutritionalGoal: string
 * },
 * setPreferences: (updater: function) => void
 * }} props
 */
export default function PreferencePanel({ preferences, setPreferences }) {
  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Diet options with icons and labels
  const dietOptions = [
    { value: "veg", label: "Vegetarian", icon: "🥗", color: "from-green-500 to-emerald-600" },
    { value: "eggetarian", label: "Eggetarian", icon: "🍳", color: "from-amber-500 to-orange-600" },
    { value: "non-veg", label: "Non-Veg", icon: "🍖", color: "from-red-500 to-rose-600" },
  ];

  const timeOptions = [
    { value: "15", label: "15 mins", icon: "⚡" },
    { value: "30", label: "30 mins", icon: "⏱️" },
    { value: "60", label: "60 mins", icon: "🕒" },
    { value: "any", label: "Any time", icon: "∞" },
  ];

  const cuisineOptions = [
    { value: "any", label: "Any", icon: "🌍" },
    { value: "indian", label: "Indian", icon: "🇮🇳" },
    { value: "italian", label: "Italian", icon: "🍝" },
    { value: "chinese", label: "Chinese", icon: "🥡" },
    { value: "mexican", label: "Mexican", icon: "🌮" },
    { value: "mediterranean", label: "Mediterranean", icon: "🫒" },
    { value: "thai", label: "Thai", icon: "🌶️" },
  ];

  const nutritionOptions = [
    { value: "none", label: "None", icon: "🌟" },
    { value: "high-protein", label: "High Protein", icon: "💪" },
    { value: "weight-loss", label: "Weight Loss", icon: "🥬" },
    { value: "low-carb", label: "Low Carb", icon: "🥑" },
  ];

  const buttonClass = (active) =>
    `relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
      active
        ? "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20 scale-105"
        : "ring-1 ring-slate-200 hover:ring-slate-300 hover:shadow-md"
    }`;

  const dietButtonClass = (value) => {
    const isActive = preferences.diet === value;
    const option = dietOptions.find((opt) => opt.value === value);
    return `relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden group ${
      isActive
        ? `ring-2 ring-slate-900 shadow-lg scale-105 text-white`
        : "ring-1 ring-slate-200 hover:ring-slate-300 hover:shadow-md text-slate-700"
    }`;
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 hover:ring-slate-300/50 transition-all duration-300">
      <h2 className="mb-1 text-lg font-semibold text-slate-900">Preferences</h2>
      <p className="mb-6 text-xs text-slate-500">Customize your search</p>

      {/* Diet Section */}
      <div className="mb-8">
        <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-700">
          📋 Dietary Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {dietOptions.map((option) => {
            const isActive = preferences.diet === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updatePreference("diet", option.value)}
                className={dietButtonClass(option.value)}
              >
                {/* Gradient background for active state */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} -z-10`} />
                )}
                
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-xs leading-tight">{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Section */}
      <div className="mb-8">
        <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-700">
          ⏱️ Time Available
        </label>
        <div className="grid grid-cols-2 gap-2">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updatePreference("timeMinutes", option.value)}
              className={`${buttonClass(preferences.timeMinutes === option.value)} flex items-center justify-center gap-2 bg-white`}
            >
              <span className="text-lg">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine Section */}
      <div className="mb-8">
        <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-700">
          🌍 Cuisine
        </label>
        <div className="grid grid-cols-2 gap-2">
          {cuisineOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updatePreference("cuisine", option.value)}
              className={`${buttonClass(preferences.cuisine === option.value)} flex items-center justify-center gap-2 bg-white`}
            >
              <span className="text-lg">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nutrition Section */}
      <div className="mb-8">
        <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-700">
          🏥 Nutrition Goal
        </label>
        <div className="grid grid-cols-2 gap-2">
          {nutritionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updatePreference("nutritionalGoal", option.value)}
              className={`${buttonClass(preferences.nutritionalGoal === option.value)} flex items-center justify-center gap-2 bg-white`}
            >
              <span className="text-lg">{option.icon}</span>
              <span className="text-xs">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Waste Minimizer Toggle */}
      <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4 ring-1 ring-green-200/50">
        <button
          type="button"
          onClick={() =>
            updatePreference("leftoverMinimizer", !preferences.leftoverMinimizer)
          }
          className={`w-full flex items-center justify-between gap-3 transition-all duration-300 ${
            preferences.leftoverMinimizer ? "opacity-100" : "opacity-75"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">♻️</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">Waste Less Mode</p>
              <p className="text-xs text-slate-600">Prioritize using available ingredients</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div
            className={`relative h-6 w-10 rounded-full transition-colors duration-300 ${
              preferences.leftoverMinimizer ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
                preferences.leftoverMinimizer ? "translate-x-4" : ""
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
