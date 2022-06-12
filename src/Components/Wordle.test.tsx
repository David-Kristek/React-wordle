import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import {
  MAX_GUESSES_NUMBER,
  WordleProvider,
  WORD_LENGTH,
} from "../context/WordleContext";
import Wordle from "./Wordle";
import { newSolution } from "../services/axios";

jest.mock("../services/axios");
const renderWordle = () =>
  render(
    <WordleProvider>
      <Wordle />
    </WordleProvider>
  );
const mockSolutionData = () => {
  // const data = new Promise((resolve) => {
  //   resolve({ data: ["wordle"] });
  // });
  const data = { data: ["wordl"] };
  // @ts-ignore
  newSolution.mockResolvedValue(data);
};
beforeEach(() => {
  mockSolutionData();
  localStorage.clear(); 
});
afterEach(cleanup);

const pressEnter = (html: HTMLElement) =>
  fireEvent.keyUp(html, { key: "Enter", code: 13, charCode: 13 });

const enterText = (html: HTMLElement, text: string) =>
  fireEvent.keyUp(html, { key: text });

test("fetches new solution", async () => {
  mockSolutionData();
  const { getByText, getByRole } = renderWordle();
  expect(getByText("Loading")).toBeInTheDocument();
  expect(newSolution).toHaveBeenCalledTimes(1);
  await waitFor(() => {
    getByRole("wordle");
  });
});
test("renders layout correctly", async () => {
  const { container, getByRole } = renderWordle();
  await waitFor(() => {
    getByRole("wordle");
  });
  const rows = container.getElementsByClassName("row");
  expect(rows).toHaveLength(MAX_GUESSES_NUMBER);
  // @ts-ignore
  [...rows].forEach((row) => {
    expect(row.children).toHaveLength(WORD_LENGTH);
  });
});

test("win", async () => {
  const { getByRole, getByText } = renderWordle();
  await waitFor(() => {
    getByRole("wordle");
  });
  const wordle = getByRole("wordle");
  enterText(wordle, "wordl");
  pressEnter(wordle);
  await waitFor(() => {
    getByRole("modal");
    getByText("You win 🙂");
  });
});
test("wrong attemp", async () => {
  const { getByRole, queryByRole } = renderWordle();
  await waitFor(() => {
    getByRole("wordle");
  });
  const wordle = getByRole("wordle");
  enterText(wordle, "blame");
  pressEnter(wordle);
  await waitFor(() => {
    expect(queryByRole("modal")).not.toBeInTheDocument();
  });
});
test("lost", async () => {
  const { getByRole, getByText } = renderWordle();
  await waitFor(() => {
    getByRole("wordle");
  });
  const wordle = getByRole("wordle");
  ["ahoja", "adjad", "djlas", "sbrdu", "adfad", "dadda"].forEach((word) => {
    enterText(wordle, word);
    pressEnter(wordle);
  });
  await waitFor(() => {
    getByRole("modal");
    getByText(`You lost 😥, solution was "wordl"`);
  });
});
test("colors correctly", async () => {
  const { getByRole, getByText, container } = renderWordle();
  await waitFor(() => {
    getByRole("wordle");
  });
  const wordle = getByRole("wordle");
  enterText(wordle, "wrxyw");
  pressEnter(wordle);
  let children = container.getElementsByClassName("row")[0].children;

  expect(children[0]).toHaveStyle("background: GREEN");
  expect(children[1]).toHaveStyle("background: YELLOW");
  expect(children[2]).toHaveStyle("background: GREY");
  expect(children[3]).toHaveStyle("background: GREY");
  expect(children[4]).toHaveStyle("background: YELLOW");

  enterText(wordle, "wrodl");
  pressEnter(wordle);
  children = container.getElementsByClassName("row")[1].children;

  expect(children[0]).toHaveStyle("background: GREEN");
  expect(children[1]).toHaveStyle("background: YELLOW");
  expect(children[2]).toHaveStyle("background: YELLOW");
  expect(children[3]).toHaveStyle("background: GREEN");
  expect(children[4]).toHaveStyle("background: GREEN");

  enterText(wordle, "wordl");
  pressEnter(wordle);
  children = container.getElementsByClassName("row")[2].children;

  expect(children[0]).toHaveStyle("background: GREEN");
  expect(children[1]).toHaveStyle("background: GREEN");
  expect(children[2]).toHaveStyle("background: GREEN");
  expect(children[3]).toHaveStyle("background: GREEN");
  expect(children[4]).toHaveStyle("background: GREEN");
});
test("keypad", async () => {
  const { getByRole, getByText, container } = renderWordle();
  await waitFor(() => {
    getByRole("wordle");
  });
  const wordle = getByRole("wordle");
  enterText(wordle, "wrdxo");
  pressEnter(wordle);
  expect(getByRole("w")).toHaveStyle("background: GREEN");
  expect(getByRole("x")).toHaveStyle("background: GREY");
  expect(getByRole("d")).toHaveStyle("background: YELLOW");
  expect(getByRole("o")).not.toHaveStyle("background: GREY");

  enterText(wordle, "owedr");
  pressEnter(wordle);

  expect(getByRole("w")).toHaveStyle("background: GREEN");
  expect(getByRole("d")).toHaveStyle("background: GREEN");
});
test("validation", async () => {
  const { getByRole, getByText, container } = renderWordle();
  await waitFor(() => {
    getByRole("wordle");
  });
  const wordle = getByRole("wordle");
  enterText(wordle, "hello");
  pressEnter(wordle);
  let children = container.getElementsByClassName("row")[0].children;

  enterText(wordle, "hello");
  pressEnter(wordle);
  expect(children[0]).toHaveStyle("background: GREY");
  enterText(wordle, "helloa");
  children = container.getElementsByClassName("row")[1].children;

  expect(children[0]).not.toHaveStyle("background: GREY");
});
