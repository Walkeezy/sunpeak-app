import { getDesignTokensByZoom } from "./getDesignTokensByZoom";

test("get correct design tokens for zoom 10", () => {
  expect(getDesignTokensByZoom(10)).toStrictEqual({
    camSize: 40,
    arrowSize: 6,
    borderRadius: "rounded-xl",
  });
});

test("get correct design tokens for zoom 11", () => {
  expect(getDesignTokensByZoom(11)).toStrictEqual({
    camSize: 50,
    arrowSize: 8,
    borderRadius: "rounded-xl",
  });
});
