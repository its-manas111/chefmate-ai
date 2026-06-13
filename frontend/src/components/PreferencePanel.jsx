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

  const buttonClass = (active) =>
    `rounded-lg border px-3 py-2 text-sm font-medium transition ${
      active
        ? "border-emerald-700 bg-emerald-700 text-white"
        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
    }`;

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-6 text-xl font-semibold">Your Preferences</h2>

      <div className="mb-6">
        <label className="mb-2 block font-medium">Dietary Mode</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={buttonClass(preferences.diet === "veg")}
            onClick={() => updatePreference("diet", "veg")}
          >
            Veg
          </button>
          <button
            type="button"
            className={buttonClass(preferences.diet === "eggetarian")}
            onClick={() => updatePreference("diet", "eggetarian")}
          >
            Eggetarian
          </button>
          <button
            type="button"
            className={buttonClass(preferences.diet === "non-veg")}
            onClick={() => updatePreference("diet", "non-veg")}
          >
            Non-Veg
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium">Time Available</label>
        <div className="flex flex-wrap gap-2">
          {["15", "30", "60", "any"].map((time) => (
            <button
              key={time}
              type="button"
              className={buttonClass(preferences.timeMinutes === time)}
              onClick={() => updatePreference("timeMinutes", time)}
            >
              {time === "any" ? "Any" : `${time} min`}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium">Cuisine</label>
        <select
          value={preferences.cuisine}
          onChange={(event) => updatePreference("cuisine", event.target.value)}
          className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="any">Any</option>
          <option value="indian">Indian</option>
          <option value="italian">Italian</option>
          <option value="chinese">Chinese</option>
          <option value="mexican">Mexican</option>
          <option value="mediterranean">Mediterranean</option>
          <option value="thai">Thai</option>
          <option value="american">American</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">
            Use what I have (minimize leftovers)
          </span>
          <button
            type="button"
            onClick={() =>
              updatePreference("leftoverMinimizer", !preferences.leftoverMinimizer)
            }
            className={`flex h-7 w-14 items-center rounded-full px-1 transition ${
              preferences.leftoverMinimizer ? "bg-orange-500" : "bg-slate-300"
            }`}
            aria-pressed={preferences.leftoverMinimizer}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow transition ${
                preferences.leftoverMinimizer ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </label>
        {preferences.leftoverMinimizer ? (
          <span className="mt-2 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
            ON
          </span>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block font-medium">Nutritional Goal</label>
        <div className="flex flex-wrap gap-2">
          {[
            ["none", "None"],
            ["high-protein", "High Protein"],
            ["low-carb", "Low Carb"],
            ["weight-loss", "Weight Loss"],
          ].map(([goal, label]) => (
            <button
              key={goal}
              type="button"
              className={buttonClass(preferences.nutritionalGoal === goal)}
              onClick={() => updatePreference("nutritionalGoal", goal)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
