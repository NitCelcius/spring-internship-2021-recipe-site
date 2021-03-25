import { NullableImg } from "../NullableImg";
import { Recipe } from "../Recipe";
import Link from "next/link";
import React from "react";

export default function MedMealNode(RecipeData: Recipe) {
  return (
    /* Somehow I want to remove these Link and use onclick & hover */
    <Link href={"/recipe/" + RecipeData.id} key={RecipeData.id}>
    <div className="MealWrapper">
      <h3 className="MealTitle">{RecipeData.title}</h3>
      <div className="HDivider MealContent">
        <div className="MealImgFix">{NullableImg(RecipeData.image_url, RecipeData.title)}</div>
        <p className="MealDesc">{RecipeData.description}</p>
      </div>
      </div>
    </Link>);
}