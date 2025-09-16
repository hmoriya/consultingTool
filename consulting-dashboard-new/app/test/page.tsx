export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Tailwind Test</h1>
        <p className="text-gray-600">If you can see styled text with gradient background, Tailwind is working.</p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Test Button
        </button>
      </div>
    </div>
  )
}