import React from "react";

const TermsAndServices = () => {
  return (
    <section className="px-4 py-8 sm:px-8 md:px-16 max-w-4xl mx-auto bg-white shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl">
      <header className="flex items-center gap-3 mb-6">
        <span className="text-4xl sm:text-5xl">📜</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800">
          Welcome to WealthMap: Our Terms of Service
        </h2>
      </header>
      <p className="text-gray-700 mb-5 text-base sm:text-lg leading-relaxed">
        We're excited to have you on board! By using <span className="font-semibold text-blue-700">WealthMap</span>, you join a community that values transparency, privacy, and responsible data use. Please take a moment to read our terms below—your trust means everything to us.
      </p>
      <ul className="list-disc pl-6 text-gray-700 text-base sm:text-lg space-y-2">
        <li>
          <span className="font-semibold text-blue-700">Use Responsibly:</span> Our data is for your personal insight and growth. Please don’t misuse, redistribute, or resell it.
        </li>
        <li>
          <span className="font-semibold text-blue-700">Data is Approximate:</span> Ownership and valuation figures are best estimates. Make decisions wisely and consult professionals when needed.
        </li>
        <li>
          <span className="font-semibold text-blue-700">Respect Privacy:</span> We’re committed to protecting your privacy and expect the same from all users.
        </li>
      </ul>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-500">
          Have questions? <a href="mailto:support@wealthmap.com" className="text-blue-600 underline">Contact us</a> anytime.
        </p>
        <p className="text-xs text-gray-400">Last updated: May 2025</p>
      </div>
    </section>
  );
};

export default TermsAndServices;