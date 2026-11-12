import { defineApp } from "@examplary/apps";

import JavaScript from "./javascript/definition";

const app = defineApp({
  id: "examplary.apps.programming-questions",
  name: {
    en: "Programming questions",
    nl: "Programmeervragen",
  },
  description: {
    en: "Question types where students write code that is checked against automated tests.",
    nl: "Vraagtypen waarin leerlingen code schrijven die wordt gecontroleerd met automatische tests.",
  },
  readme: "./README.md",
  icon: "./icon.svg",
  public: true,
});

app.addCapability(JavaScript);

export default app;
