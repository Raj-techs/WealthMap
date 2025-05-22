import React from "react";
import { FaChartLine, FaMapMarkedAlt, FaUserShield } from "react-icons/fa";

const Features = () => {
  return (
    <section id="features" className="py-16 px-6 md:px-20 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">
        Powerful Features
      </h2>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="bg-white shadow-md p-6 rounded-lg">
          <FaMapMarkedAlt className="text-4xl text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Interactive Property Map</h3>
          <p className="text-gray-600">Explore real estate listings with detailed property information and map views with satellite and clustering support.</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg">
          <FaChartLine className="text-4xl text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Wealth Insights</h3>
          <p className="text-gray-600">Analyze ownership and wealth trends for individuals and organizations across regions with dynamic reports.</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg">
          <FaUserShield className="text-4xl text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure & Role-Based Access</h3>
          <p className="text-gray-600">Admins, users, and guests enjoy tailored access experiences with MFA, notifications, and personalized dashboards.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;