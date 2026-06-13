export default function RecipeList({
  recipes,
  loading,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 min-h-[500px]">
      <h2 className="text-xl font-semibold mb-4">
        Recipe Results
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <div className="text-gray-500">
          Add ingredients to start discovering recipes.
        </div>
      ) : (
        <div>
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              {recipe.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}