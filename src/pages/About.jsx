// src/pages/About.jsx
import React from "react";
import { FaGlobe, FaHandshake, FaSearchLocation } from "react-icons/fa";

const About = () => {
  return (
    <div className="px-6 py-16 max-w-5xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">About WealthMap</h1>
      <p className="text-gray-700 text-lg mb-8">
        WealthMap is a powerful platform designed to empower users, researchers,
        and businesses to explore, analyze, and understand property ownership,
        valuation, and wealth across the country.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white shadow p-6 rounded">
          <FaGlobe className="text-blue-500 text-4xl mb-3 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Nationwide Data</h3>
          <p className="text-gray-600">
            Access a vast database of properties across the U.S. with detailed
            ownership and valuation insights.
          </p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <FaHandshake className="text-green-500 text-4xl mb-3 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Built for Collaboration</h3>
          <p className="text-gray-600">
            Designed for real estate professionals, teams, and enterprises to work
            together with shared access and reporting.
          </p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <FaSearchLocation className="text-purple-500 text-4xl mb-3 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Intelligent Mapping</h3>
          <p className="text-gray-600">
            Our advanced mapping features allow you to visualize ownership,
            property types, net worth, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
