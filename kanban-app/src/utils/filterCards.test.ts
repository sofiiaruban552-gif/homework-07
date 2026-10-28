import { describe, it, expect } from "vitest";

import { cards } from "@/test/fixtures";
import filterCards from "./filterCards";

describe("filterCards", () => {
 it.each([
   {
     name: "trims whitespace from the search query",
     query: "  dashboard  ",
     onlyMine: false,
     userId: 100,
     expectedIds: [2],
   },
   {
     name: "filters cards assigned to the current user",
     query: "",
     onlyMine: true,
     userId: 100,
     expectedIds: [1, 3],
   },
   {
     name: "combines search and only-mine filters",
     query: "  login  ",
     onlyMine: true,
     userId: 100,
     expectedIds: [1, 3],
   },
 ])("$name", ({ query, onlyMine, userId, expectedIds }) => {
   expect(
     filterCards(cards, { query, onlyMine, userId }).map((card) => card.id),
   ).toEqual(expectedIds);
 });
});
