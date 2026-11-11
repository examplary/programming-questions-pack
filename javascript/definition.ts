import { QuestionType } from "@examplary/apps";

const assertionsExample = `it('sumEven is a function', () => {
  expect(typeof sumEven).toBe('function');
});
it('result is 12', () => {
  expect(result).toBe(12);
});
it('an empty array sums to 0', () => {
  expect(sumEven([])).toBe(0);
});`;

const answerExample = `function sumEven(numbers) {
  return numbers
    .filter((n) => n % 2 === 0)
    .reduce((sum, n) => sum + n, 0);
}

const result = sumEven([1, 2, 3, 4, 5, 6]);`;

export default new QuestionType({
  // Kept from before apps, so existing questions keep working. It doesn't start
  // with the app's ID, which only Examplary staff are allowed to publish.
  id: "examplary.programming.javascript",
  name: {
    en: "JavaScript",
    nl: "JavaScript",
  },
  description: {
    en: "Ask the student to write a JavaScript program to solve a problem.",
    nl: "Vraag de leerling om een JavaScript-programma te schrijven om een probleem op te lossen.",
  },
  icon: "./javascript/icon.svg",
  components: {
    assessment: "./javascript/component-assessment.tsx",
    print: "./javascript/component-print.tsx",
    results: "./javascript/component-results.tsx",
    "settings-area": "./javascript/component-settings-area.tsx",
  },
  isPreviewRefreshable: true,
  timeEstimateMinutes: 15,
  generation: {
    enabled: true,
    instructions: `
      The student writes plain JavaScript (ES2022) in a code editor, which runs in their browser as they type.
      The question's description explains the problem and names the functions or variables the student has to define, e.g. "Write a function sumEven(numbers) ... and store sumEven([1, 2, 3, 4, 5, 6]) in a variable called result".
      The "initial-value" setting is the code the editor starts with: a skeleton with those names and a "// Your code here" comment, never the solution.
      The "assertions" setting is JavaScript run right after the student's code, in the same scope, so it can use anything the student's code defines. Use Jest's expect() matchers (toBe, toEqual, toContain, toThrow, etc.), and group them into it('...', () => { ... }) blocks with short descriptive names, as those names are shown to the student as test results. Write 2 to 5 of them, including at least one edge case, and test behaviour (call the student's functions with other inputs) rather than only one hard-coded result.
      The student's code can't use import, require, the DOM, network requests or top-level await, and must not use a top-level return statement.
    `,
  },
  grading: {
    enabled: true,
    instructions: `
      The answer's value is the student's JavaScript code. Judge it against the problem in the question and the assertions in the "assertions" setting, which are the automated tests the code has to pass.
      The answer context's \`lines\` key holds the results of running those tests in the student's browser: one line per test, with \`success\` true when it passed, \`fail\` true when it failed, and its name or an error (like a syntax error) as \`message\`. Use these results as the main evidence of whether the code works, and give partial credit in proportion to the tests that pass, unless the rubric says otherwise.
      Don't trust the results blindly, as they were computed on the student's device: check that the code actually does what the tests claim, and give little credit to code that hard-codes the expected outputs instead of solving the problem. When there are no results, read the code and reason about whether it would pass the assertions.
      In your feedback, point out what's wrong in the code when a test fails, without writing out the full solution.
    `,
  },
  settings: [
    {
      id: "assertions",
      name: {
        en: "Assertions",
        nl: "Asserties",
      },
      type: "string",
      hidden: true,
      description:
        "Jest-style assertions (expect(), optionally grouped in it() blocks) run after the student's code, in the same scope, to check it.",
      default: "expect(result).toEqual([1, 2, 3]);",
    },
    {
      id: "initial-value",
      name: {
        en: "Initial value",
        nl: "Initiële waarde",
      },
      type: "string",
      hidden: true,
      description:
        "The code the student's editor starts with, e.g. a function signature to complete. Never the solution.",
      default: 'const result = "";',
    },
  ],
  translations: {
    assertions: {
      en: "Assertions",
      nl: "Asserties",
    },
    "assertions-description": {
      en: "The assertions to check the student's code against. Click for documentation.",
      nl: "De asserties om de code van de leerling tegen te controleren. Klik voor documentatie.",
    },
    "initial-value": {
      en: "Initial value",
      nl: "Initiële waarde",
    },
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Sum of even numbers",
          description:
            "Write a function sumEven(numbers) that returns the sum of all even numbers in an array. Store the result of sumEven([1, 2, 3, 4, 5, 6]) in a variable called result.",
          settings: {
            assertions: assertionsExample,
            "initial-value": `function sumEven(numbers) {
  // Your code here
}

const result = sumEven([1, 2, 3, 4, 5, 6]);`,
          },
        },
        answer: {
          value: answerExample,
          completed: true,
          context: {
            lines: [
              { success: true, fail: false, message: "sumEven is a function" },
              { success: true, fail: false, message: "result is 12" },
              { success: true, fail: false, message: "an empty array sums to 0" },
            ],
          },
        },
      },
      nl: {
        question: {
          title: "Som van even getallen",
          description:
            "Schrijf een functie sumEven(numbers) die de som van alle even getallen in een array teruggeeft. Sla het resultaat van sumEven([1, 2, 3, 4, 5, 6]) op in een variabele met de naam result.",
          settings: {
            assertions: `it('sumEven is een functie', () => {
  expect(typeof sumEven).toBe('function');
});
it('result is 12', () => {
  expect(result).toBe(12);
});
it('een lege array geeft 0', () => {
  expect(sumEven([])).toBe(0);
});`,
            "initial-value": `function sumEven(numbers) {
  // Jouw code hier
}

const result = sumEven([1, 2, 3, 4, 5, 6]);`,
          },
        },
        answer: {
          context: {
            lines: [
              { success: true, fail: false, message: "sumEven is een functie" },
              { success: true, fail: false, message: "result is 12" },
              { success: true, fail: false, message: "een lege array geeft 0" },
            ],
          },
        },
      },
    },
  },
  previewImage: "./javascript/preview.png",
});
