import React from "react";
import { useWordle } from "../context/WordleContext";
import { coloredGuessType } from "../hooks/useWordle";

export default function ColoredGuesses({coloredGuesses} : {coloredGuesses: coloredGuessType[][]}) {
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
