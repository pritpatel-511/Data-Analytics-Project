import React from "react";
import Lottie from "lottie-react";
import animationData from "./Animation - 1751527491424.json";
import "./ExcelLoading.css";

export default function ExcelLoading() {
  return (
    <div className="loading-overlay">
      <Lottie animationData={animationData} loop autoplay style={{ width: 200 }} />
    </div>
  );
}
