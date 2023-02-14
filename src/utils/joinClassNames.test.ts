import { joinClassNames } from "./joinClassNames";

test("join two css classes", () => {
  expect(joinClassNames(["class-1", "class-2"])).toBe("class-1 class-2");
});

test("join two css classes with condition", () => {
  expect(joinClassNames(["class-1", "class-2", true && "class-3"])).toBe(
    "class-1 class-2 class-3"
  );
});

test("return empty string", () => {
  expect(joinClassNames([])).toBe("");
});
