import React from "react";

export default function Logo({ className = "h-8" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto text-[#FF6B00]"
        fill="currentColor"
      >
        <path d="M75,25 C75,11.19 63.81,0 50,0 C36.19,0 25,11.19 25,25 C25,32.84 28.6,39.84 34.19,44.4 L65.81,55.6 C71.4,60.16 75,67.16 75,75 C75,88.81 63.81,100 50,100 C36.19,100 25,88.81 25,75 L25,65 L45,65 L45,75 C45,77.76 47.24,80 50,80 C52.76,80 55,77.76 55,75 C55,71.74 53.07,68.91 50.19,67.75 L18.37,56.61 C12.14,54.43 7.81,48.65 7.81,41.97 C7.81,32.6 15.41,25 24.78,25 L75,25 Z M50,60 C44.48,60 40,55.52 40,50 C40,44.48 44.48,40 50,40 C55.52,40 60,44.48 60,50 C60,55.52 55.52,60 50,60 Z" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-slate-900">
        Senzoly
      </span>
    </div>
  );
}
