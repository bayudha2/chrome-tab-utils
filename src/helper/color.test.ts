import { transformColorOpt } from "./color";

test("unit test for transform color option", () => {
  const redOpt = transformColorOpt["red"];
  expect(redOpt.bg).toEqual("#482e2f");
});
