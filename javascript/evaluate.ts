import jest from "jest-lite";
import { v4 as uuid } from "uuid";

/** One line of test output, shown to the student and saved as the answer's `context.lines`. */
export type ResultLine = {
  success?: boolean;
  fail?: boolean;
  title?: string;
  message: string;
};

export type EvaluationResult = {
  /** Whether every assertion passed */
  completed: boolean;
  lines: ResultLine[];
};

/**
 * jest-lite keeps every test it was given and runs them all again on each
 * `run()`, and a describe block that throws (e.g. a failing `expect()` outside
 * an `it()`) stays open, so later ones nest inside it. It doesn't export a
 * way to reset that, so this empties its root describe block directly.
 */
const resetJestState = () => {
  const key = Object.getOwnPropertySymbols(globalThis).find(
    (symbol) => symbol.description === "JEST_STATE_SYMBOL",
  );
  const state = key && (globalThis as any)[key];
  if (!state?.rootDescribeBlock) return;

  Object.assign(state.rootDescribeBlock, { children: [], hooks: [], tests: [] });
  state.currentDescribeBlock = state.rootDescribeBlock;
  state.hasFocusedTests = false;
};

/**
 * Runs the student's code followed by the question's Jest-style assertions,
 * in the browser. `code` runs as-is in the page, see the README.
 */
export const evaluate = async (
  code: string,
  assertions: string,
): Promise<EvaluationResult> => {
  const id = uuid();
  const js = `
      let ____xe = '';

      with(jest) {
        (() => { 
          ${code} 

          ;

          describe('${id}', () => {
            ${assertions}
          });
          ____xe = '${id}';
        })();
      }

      return [____xe, await jest.run()];
    `;

  try {
    resetJestState();
    jest.jest.resetAllMocks();
    jest.jest.clearAllMocks();

    let response = await Object.getPrototypeOf(
      async function () {}
    ).constructor(
      "jest",
      js
    )(jest);

    if (!response || response[0] !== id) {
      throw new Error(
        "Did not complete running - are you calling `return` in your code?"
      );
    }

    const res = response[1].filter((r: any) => r.testPath.includes(id));

    if (!res.length) {
      return {
        completed: true,
        lines: [
          {
            success: true,
            title: "Passed",
            message: "Ran without errors",
          },
        ],
      };
    }

    const completed = res.every((r: any) => r.status === "pass");
    return {
      completed,
      lines: res.map((r: any) => ({
        success: r.status === "pass",
        fail: r.status === "fail",
        // The test's name, and those of describe blocks inside the assertions
        message: r.testPath.slice(r.testPath.indexOf(id) + 1).join(" - "),
      })),
    };
  } catch (e: any) {
    console.log({ e });

    return {
      completed: false,
      lines: [
        {
          fail: true,
          title: "Error",
          message: e.message,
        },
      ],
    };
  }
};
