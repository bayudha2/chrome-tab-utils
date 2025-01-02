import { transformDarkColorOpt } from "./color";

test("unit test for transform color option", () => {
  const redOpt = transformDarkColorOpt["red"];
  expect(redOpt.bg).toEqual("#482e2f");
});
