import React from "react";
import { TrendingUp } from "lucide-react";
import "./StatCard.css";

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="stat-card">
      <div
        className="stat-card-icon"
        style={{ backgroundColor: color }}
      >
        <Icon size={24} />
      </div>
      <div className="stat-card-content">
        <p className="stat-card-title">{title}</p>
        <h3 className="stat-card-value">{value}</h3>
        {trend && (
          <span className="stat-card-trend">
            <TrendingUp size={10} /> {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;