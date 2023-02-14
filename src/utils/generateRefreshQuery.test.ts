import { generateRefreshQuery } from "./generateRefreshQuery";

test("get refresh query for 15:36", () => {
  jest.useFakeTimers().setSystemTime(new Date("2020-01-01 15:36"));
  expect(generateRefreshQuery()).toBe("1-15-30");
});

test("get refresh query for 08:45", () => {
  jest.useFakeTimers().setSystemTime(new Date("2020-01-02 08:47"));
  expect(generateRefreshQuery()).toBe("2-8-45");
});
