import React from "react";
import { useWordle } from "../context/WordleContext";

export default function ColoredGuesses() {
  const { coloredGuesses } = useWordle();
  return (
    <>
      {coloredGuesses.map((word, index) => (
        <div className="row" key={index}>
          {word.map((letter, indexx) => (
            <div style={{ background: letter?.color }} key={indexx}>
              {letter?.letter}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
