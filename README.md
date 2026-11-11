# 👩‍💻 Programming questions

An [Examplary](https://examplary.ai) app with question types where students write code, which is
checked against automated tests while they type.

![Preview](https://raw.githubusercontent.com/examplary-ai/programming-questions-pack/main/javascript/preview.png)

## Question types

- **JavaScript**: the student writes JavaScript in a code editor. Teachers write assertions with
  [Jest's `expect`](https://jestjs.io/docs/expect), optionally grouped in `it()` blocks, and can set
  the code the editor starts with. The student sees which tests pass as they type, and the test
  results are used when the answer is graded with AI.

## Enabling the app

A workspace admin adds the app under **Settings → Apps**
([app.examplary.ai/account/apps](https://app.examplary.ai/account/apps)). Its question types then
show up for everyone in the workspace when adding a question to a test.

## Development

This repository is a stand-alone Examplary app: [`app.ts`](app.ts) defines the app, and each
question type has a folder with its `definition.ts` and components. See the
[developer documentation](https://examplary.ai/developers/apps) for how apps work.

```sh
yarn install
yarn dev        # runs a private copy of the app in your workspace, updated on save
yarn test       # runs the tests
yarn validate   # checks and bundles the app, without uploading anything
yarn exp package  # writes what would be uploaded, and the manifest (app.json), to .bundled/
```

`yarn dev` asks you to sign in the first time (or uses `EXAMPLARY_API_KEY`), and removes the copy
again when you stop it with Ctrl+C.

### Publishing

Pushing to `main` publishes the app to staging and then production
([`.github/workflows/build.yml`](.github/workflows/build.yml)), with the `EXAMPLARY_API_KEY`
repository secret. To publish by hand:

```sh
EXAMPLARY_API_KEY=... yarn publish --host https://api-staging.examplary.ai
EXAMPLARY_API_KEY=... yarn publish
```

Publishing again without changes adds no new version. As the app is public, new versions are
reviewed by Examplary before workspaces get them.

The JavaScript question type keeps its ID from before apps (`examplary.programming.javascript`),
so existing questions keep working. Question type IDs normally have to start with the app's ID,
so only an API key of an Examplary staff account can publish it.

### How student code runs

The student's code and the assertions run in the student's browser, in the page itself (with
`new AsyncFunction(...)`, see [`javascript/evaluate.ts`](javascript/evaluate.ts)), using
[jest-lite](https://github.com/kentcdodds/jest-lite). The test results are saved with the answer
as `context.lines`.
