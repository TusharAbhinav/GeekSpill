"use client";
import React from "react";
import { TypeAnimation } from "react-type-animation";
const TypeAnimationComponent = () => {
  return (
    <TypeAnimation
      sequence={[
        "Your one-stop destination for the latest tech insights from industry giants. Never miss a beat in the fast-paced world of technology.",
      ]}
      wrapper="span"
      speed={50}
    />
  );
};

export default TypeAnimationComponent;
