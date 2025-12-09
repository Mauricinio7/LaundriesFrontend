import React from "react";

const HomeManagerPage: React.FC = () => {
  return (
    <div className="home-manager-page">
      <div className="content-container">
        <h1 className="welcome-title">
          Bienvenido al Sistema de Laundries App manager de la sucursal
        </h1>
        <p className="welcome-subtitle">
          Tu plataforma de gestión de lavandería
        </p>

        <svg
          className="bubbles-svg"
          viewBox="0 0 400 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Burbujas grandes */}
          <circle
            cx="100"
            cy="150"
            r="40"
            fill="none"
            stroke="#4A90E2"
            strokeWidth="2"
            opacity="0.6"
          />
          <circle
            cx="300"
            cy="120"
            r="35"
            fill="none"
            stroke="#7B68EE"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Burbujas medianas */}
          <circle
            cx="150"
            cy="80"
            r="25"
            fill="none"
            stroke="#50C878"
            strokeWidth="2"
            opacity="0.7"
          />
          <circle
            cx="280"
            cy="220"
            r="30"
            fill="none"
            stroke="#FFB347"
            strokeWidth="2"
            opacity="0.6"
          />
          <circle
            cx="80"
            cy="250"
            r="20"
            fill="none"
            stroke="#FF6B6B"
            strokeWidth="2"
            opacity="0.7"
          />

          {/* Burbujas pequeñas */}
          <circle
            cx="320"
            cy="80"
            r="15"
            fill="none"
            stroke="#4A90E2"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <circle
            cx="200"
            cy="250"
            r="18"
            fill="none"
            stroke="#7B68EE"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <circle
            cx="50"
            cy="100"
            r="12"
            fill="none"
            stroke="#50C878"
            strokeWidth="1.5"
            opacity="0.5"
          />

          {/* Burbujas extras para más movimiento */}
          <circle
            cx="250"
            cy="60"
            r="22"
            fill="none"
            stroke="#FFB347"
            strokeWidth="2"
            opacity="0.5"
          />
          <circle
            cx="120"
            cy="220"
            r="17"
            fill="none"
            stroke="#FF6B6B"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
};

export default HomeManagerPage;
