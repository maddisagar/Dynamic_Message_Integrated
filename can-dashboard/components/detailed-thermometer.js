import React from "react";

const DetailedThermometer = ({ value, max = 100, orientation = "vertical" }) => {
  const percentage = (value / max) * 100;

  const getColor = () => {
    if (value < 30) return "#22c55e"; // green
    if (value < 60) return "#facc15"; // yellow
    return "#ef4444"; // red
  };

  if (orientation === "horizontal") {
    return (
      <div className="flex flex-col items-center">
        <svg
          width="170"
          height="50"
          viewBox="0 0 170 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bulb */}
          <circle
            cx="40"
            cy="25"
            r="15"
            stroke="#6b7280"
            strokeWidth="2"
            fill={getColor()}
          />
          {/* Thermometer Outer */}
          <rect
            x="55"
            y="20"
            width="100"
            height="10"
            rx="5"
            stroke="#6b7280"
            strokeWidth="2"
            fill="#f3f4f6"
          />
          {/* Liquid Fill */}
          <rect
            x="55"
            y="20"
            width={(percentage * 100) / 100}
            height="10"
            rx="5"
            fill={getColor()}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        width="50"
        height="150"
        viewBox="0 0 50 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Thermometer Outer */}
        <rect
          x="20"
          y="10"
          width="10"
          height="100"
          rx="5"
          stroke="#6b7280"
          strokeWidth="2"
          fill="#f3f4f6"
        />
        {/* Liquid Fill */}
        <rect
          x="20"
          y={110 - percentage}
          width="10"
          height={percentage}
          rx="5"
          fill={getColor()}
        />
        {/* Bulb */}
        <circle
          cx="25"
          cy="125"
          r="15"
          stroke="#6b7280"
          strokeWidth="2"
          fill={getColor()}
        />
      </svg>
    </div>
  );
};

export default DetailedThermometer;
