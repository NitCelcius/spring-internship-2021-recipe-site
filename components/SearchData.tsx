import { PageLinks } from "./PageLinks";
import { Recipe } from "./Recipe";

/* Not to confuse */
export type SearchData = {
  type: "SearchData";
  recipes: Recipe[] | null;

  links: PageLinks;
}