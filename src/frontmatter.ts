import type { Frontmatter } from "./types";
import type { SurveyKeys } from "./config";
import type { SurveyObject } from "./types";

export function applySurveyToFrontmatter(fm: Frontmatter, survey: SurveyObject, keys: SurveyKeys): void {
  fm[keys.object] = {
    at: survey.at, items: survey.items, depth: survey.depth, by: survey.by, stubs: survey.stubs,
  };
  for (const k of keys.legacyFlat) delete fm[k];
  if (keys.legacyBare) delete fm[keys.legacyBare];
  delete fm["has-filesystem"];
}

export function migrateFrontmatter(fm: Frontmatter, keys: SurveyKeys): boolean {
  let changed = false;
  if (Object.prototype.hasOwnProperty.call(fm, "has-filesystem")) {
    if (fm["has-filesystem"] === false) { fm[keys.target] = "none"; changed = true; }
    delete fm["has-filesystem"];
    changed = true;
  }
  return changed;
}
