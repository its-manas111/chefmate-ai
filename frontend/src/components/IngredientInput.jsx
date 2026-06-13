export default function IngredientInput() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Ingredients
      </h2>

      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        Upload Photo
      </div>

      <textarea
        className="w-full border rounded-lg mt-4 p-3"
        rows="4"
        placeholder="Type ingredients..."
      />
    </div>
  );
}