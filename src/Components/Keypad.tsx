import React from "react";
import { useWordle } from "../context/WordleContext";

export default function Keypad() {
  const { usedLetters } = useWordle();
  return (
    <div className="keypad">
      {usedLetters.map((letter, index) => (
        <div style={{ background: letter?.color }} key={index} role={letter?.letter}>{letter?.letter}</div>
      ))}
    </div>
  );
}
