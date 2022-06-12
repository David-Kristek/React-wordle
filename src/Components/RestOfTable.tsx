import React from "react";
import { MAX_GUESSES_NUMBER, useWordle } from "../context/WordleContext";
export default function RestOfTable() {
  const { coloredGuesses } = useWordle();
  return (
    <>
      {MAX_GUESSES_NUMBER - coloredGuesses.length > 0 &&
        [
          ...Array(
            MAX_GUESSES_NUMBER - coloredGuesses.length - 1 /* - current gues */
          ),
        ].map((i, index) => (
          <div className="row" key={index}>
            {[...Array(5)].map((i, index) => (
              <div key={index}></div>
            ))}
          </div>
        ))}
    </>
  );
}
