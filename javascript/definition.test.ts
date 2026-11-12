import { describe, expect, it } from "vitest";

import JavaScript from "./definition";
import { evaluate } from "./evaluate";

const { questionType } = JavaScript.toDefinition() as any;
const { en, nl } = questionType.metadata.preview;

describe("JavaScript question type", () => {
  it("keeps the ID questions were created with", () => {
    expect(questionType.id).toBe("examplary.programming.javascript");
  });

  // The Dutch preview is merged over the English one
  it.each([
    ["en", en],
    ["nl", { question: { ...en.question, ...nl.question }, answer: { ...en.answer, ...nl.answer } }],
  ])("has %s preview results that match running its answer", async (_, preview) => {
    const result = await evaluate(
      preview.answer.value,
      preview.question.settings.assertions,
    );

    expect(result).toEqual({
      completed: preview.answer.completed,
      lines: preview.answer.context.lines,
    });
  });
});
