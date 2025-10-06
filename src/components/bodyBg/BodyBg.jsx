// src/components/BackgroundBlobs.jsx
import React, { useEffect, useState } from "react";
import "./bodyBg.module.css";

const BodyBg = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // عدد الكور = 3
    const newPositions = Array.from({ length: 3 }, () => ({
      top: Math.floor(Math.random() * 80) + "%",
      left: Math.floor(Math.random() * 80) + "%",
      size: Math.floor(Math.random() * 200) + 150, // من 150 إلى 350px
    }));
    setPositions(newPositions);
  }, []);

  return (
    <div className="blobs-container">
      {positions.map((pos, index) => (
        <div
          key={index}
          className="blob"
          style={{
            top: pos.top,
            left: pos.left,
            width: pos.size,
            height: pos.size,
          }}
        />
      ))}
    </div>
  );
};

export default BodyBg;
