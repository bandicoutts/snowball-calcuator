export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Snowball Debt Calculator
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Take control of your debt with smart payoff strategies
        </p>
        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </a>
          <a
            href="/signup"
            className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
