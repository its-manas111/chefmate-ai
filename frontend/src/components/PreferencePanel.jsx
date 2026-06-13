export default function PreferencePanel({
  preferences,
  setPreferences,
}) {
  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const buttonClass = (active) =>
    `px-3 py-2 rounded-lg border transition ${
      active
        ? "bg-green-600 text-white border-green-600"
        : "bg-white hover:bg-slate-100"
    }`;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        Your Preferences
      </h2>

      {/* Diet */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          Dietary Mode
        </label>

        <div className="flex gap-2 flex-wrap">
          <button
            className={buttonClass(
              preferences.diet === "veg"
            )}
            onClick={() =>
              updatePreference("diet", "veg")
            }
          >
            🌱 Veg
          </button>

          <button
            className={buttonClass(
              preferences.diet === "eggetarian"
            )}
            onClick={() =>
              updatePreference("diet", "eggetarian")
            }
          >
            🥚 Eggetarian
          </button>

          <button
            className={buttonClass(
              preferences.diet === "non-veg"
            )}
            onClick={() =>
              updatePreference("diet", "non-veg")
            }
          >
            🍗 Non-Veg
          </button>
        </div>
      </div>

      {/* Time */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          Time Available
        </label>

        <div className="flex gap-2 flex-wrap">
          {["15", "30", "60", "any"].map((time) => (
            <button
              key={time}
              className={buttonClass(
                preferences.time === time
              )}
              onClick={() =>
                updatePreference("time", time)
              }
            >
              {time === "any"
                ? "⏳ Any"
                : `⏱ ${time} min`}
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          Cuisine
        </label>

        <select
          value={preferences.cuisine}
          onChange={(e) =>
            updatePreference(
              "cuisine",
              e.target.value
            )
          }
          className="w-full border rounded-lg p-2"
        >
          <option value="any">Any</option>
          <option value="indian">Indian</option>
          <option value="italian">Italian</option>
          <option value="chinese">Chinese</option>
          <option value="mexican">Mexican</option>
          <option value="mediterranean">
            Mediterranean
          </option>
        </select>
      </div>

      {/* Waste Minimizer */}
      <div className="mb-6">
        <label className="flex items-center justify-between">
          <span>
            ♻️ Use what I have
          </span>

          <input
            type="checkbox"
            checked={
              preferences.leftoverMinimizer
            }
            onChange={(e) =>
              updatePreference(
                "leftoverMinimizer",
                e.target.checked
              )
            }
          />
        </label>
      </div>

      {/* Nutrition */}
      <div>
        <label className="block font-medium mb-2">
          Nutrition Goal
        </label>

        <div className="flex gap-2 flex-wrap">
          {[
            "none",
            "high-protein",
            "low-carb",
            "weight-loss",
          ].map((goal) => (
            <button
              key={goal}
              className={buttonClass(
                preferences.nutritionalGoal ===
                  goal
              )}
              onClick={() =>
                updatePreference(
                  "nutritionalGoal",
                  goal
                )
              }
            >
              {goal}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
