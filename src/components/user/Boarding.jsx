import React from "react";

const steps = [
  {
    title: "Welcome to WealthMap",
    description: "Explore property insights and ownership.",
    video: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
  },
  {
    title: "Map Features",
    description: "Use filters and search to explore the interactive map.",
    video: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
  },
  {
    title: "Bookmark & Report",
    description: "Bookmark properties and generate detailed reports.",
    video: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
  },
];

const Boarding = () => {
  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-800 mb-8">
        🚀 Welcome to Your WealthMap Journey!
      </h2>
      <div className="w-full flex flex-col gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl border border-blue-200 shadow-md transition-transform hover:scale-105"
          >
            <div className="flex-1 mb-4 sm:mb-0 sm:mr-6">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2">
                {index + 1}. {step.title}
              </h3>
              <p className="text-base text-gray-700">{step.description}</p>
              <a
                href={step.video}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
              >
                Watch Tutorial
              </a>
            </div>
            <div className="w-full sm:w-60 aspect-video rounded-lg overflow-hidden shadow">
              <iframe
                src={step.video}
                title={step.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boarding;