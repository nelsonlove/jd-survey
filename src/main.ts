import { Plugin } from "obsidian";
export default class JdSurveyPlugin extends Plugin {
  async onload(): Promise<void> {
    console.log("jd-survey loaded");
  }
}
