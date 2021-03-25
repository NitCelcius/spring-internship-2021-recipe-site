import { PageLinks } from "./PageLinks";
import { Recipe } from "./Recipe";

export type RecipeFeedData = {
  type: "RecipeFeedData";
  recipes: Recipe[];

  links: PageLinks;
}

