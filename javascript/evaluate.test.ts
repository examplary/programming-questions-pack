import { describe, expect, it, vi } from "vitest";

import { evaluate } from "./evaluate";

// evaluate() logs the errors it catches
vi.spyOn(console, "log").mockImplementation(() => {});

describe("evaluate", () => {
  it("passes when a bare assertion holds", async () => {
    const result = await evaluate(
      "const result = [1, 2, 3];",
      "expect(result).toEqual([1, 2, 3]);",
    );

    expect(result).toEqual({
      completed: true,
      lines: [{ success: true, title: "Passed", message: "Ran without errors" }],
    });
  });

  it("reports every `it` block, by name", async () => {
    const result = await evaluate(
      "function double(n) { return n * 2; }",
      `
        it('doubles 2', () => expect(double(2)).toBe(4));
        it('doubles 0', () => expect(double(0)).toBe(0));
      `,
    );

    expect(result).toEqual({
      completed: true,
      lines: [
        { success: true, fail: false, message: "doubles 2" },
        { success: true, fail: false, message: "doubles 0" },
      ],
    });
  });

  it("fails the `it` blocks whose assertions don't hold", async () => {
    const result = await evaluate(
      "const result = [3, 2, 1];",
      `
        it('result is an array', () => expect(Array.isArray(result)).toBe(true));
        it('result is sorted', () => expect(result).toEqual([1, 2, 3]));
      `,
    );

    expect(result.completed).toBe(false);
    expect(result.lines).toEqual([
      { success: true, fail: false, message: "result is an array" },
      { success: false, fail: true, message: "result is sorted" },
    ]);
  });

  it("fails with the error when a bare assertion doesn't hold", async () => {
    const result = await evaluate(
      "const result = 1;",
      "expect(result).toBe(2);",
    );

    expect(result.completed).toBe(false);
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0]).toMatchObject({ fail: true, title: "Error" });
    expect(result.lines[0].message).toContain("toBe");
  });

  it("fails with the syntax error when the code doesn't parse", async () => {
    const result = await evaluate(
      "const result = [1, 2",
      "expect(result).toEqual([1, 2]);",
    );

    expect(result).toEqual({
      completed: false,
      lines: [
        { fail: true, title: "Error", message: expect.any(String) },
      ],
    });
  });

  it("fails when the code throws", async () => {
    const result = await evaluate(
      "const result = undefinedFunction();",
      "expect(result).toBe(1);",
    );

    expect(result.completed).toBe(false);
    expect(result.lines[0]).toMatchObject({ fail: true, title: "Error" });
    expect(result.lines[0].message).toContain("undefinedFunction");
  });

  it("fails when the code returns before the assertions run", async () => {
    const result = await evaluate("return 5;", "expect(1).toBe(1);");

    expect(result).toEqual({
      completed: false,
      lines: [
        {
          fail: true,
          title: "Error",
          message:
            "Did not complete running - are you calling `return` in your code?",
        },
      ],
    });
  });

  it("names a test by the describe blocks in the assertions too", async () => {
    const result = await evaluate(
      "const result = 1;",
      "describe('result', () => { it('is one', () => expect(result).toBe(1)); });",
    );

    expect(result.lines).toEqual([
      { success: true, fail: false, message: "result - is one" },
    ]);
  });

  it("isn't affected by an earlier run whose assertions threw", async () => {
    await evaluate("const result = 1;", "expect(result).toBe(2);");
    const result = await evaluate(
      "const result = 1;",
      "it('is one', () => expect(result).toBe(1));",
    );

    expect(result.lines).toEqual([
      { success: true, fail: false, message: "is one" },
    ]);
  });

  it("doesn't run the tests of earlier runs again", async () => {
    let earlierRuns = 0;
    (globalThis as any).countRun = () => earlierRuns++;
    await evaluate("", "it('earlier', () => countRun());");
    await evaluate("", "it('later', () => {});");

    expect(earlierRuns).toBe(1);
  });

  it("only reports the tests of its own run", async () => {
    await evaluate("const a = 1;", "it('first run', () => expect(a).toBe(1));");
    const result = await evaluate(
      "const b = 2;",
      "it('second run', () => expect(b).toBe(2));",
    );

    expect(result.lines).toEqual([
      { success: true, fail: false, message: "second run" },
    ]);
  });
});
