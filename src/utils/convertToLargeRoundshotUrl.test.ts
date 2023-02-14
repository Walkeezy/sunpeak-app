import { convertToLargeRoundshotUrl } from "./convertToLargeRoundshotUrl";

test("convert 500px roundshot url correctly", () => {
  expect(
    convertToLargeRoundshotUrl("https://backend.roundshot.com/cams/151/500")
  ).toBe("https://backend.roundshot.com/cams/151/1000");
});

test("convert 400px roundshot url correctly", () => {
  expect(
    convertToLargeRoundshotUrl("https://backend.roundshot.com/cams/500/400")
  ).toBe("https://backend.roundshot.com/cams/500/1000");
});

test("return input url if its not a roundshot url", () => {
  expect(convertToLargeRoundshotUrl("https://xyz.com/cams/123/456")).toBe(
    "https://xyz.com/cams/123/456"
  );
});
