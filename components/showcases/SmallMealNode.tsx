import { NullableImg } from "../NullableImg";
import { Recipe } from "../Recipe";
import Link from "next/link";
import React from "react";
import {css} from "@emotion/css"

export default function SmallMealNode(RecipeData: Recipe) {
  return (
    /* Somehow I want to remove these Link and use onclick & hover */
    <Link href={"/recipe/" + RecipeData.id} key={RecipeData.id}>
      <div className={css`
      .MealImg {
  border: 2px #eee0 solid;
  border-radius: min(3%, 1rem);
  /* IT LOOKS ROUND!!! */
  box-shadow: 0 0 .2rem .2rem #e0e0e0;
  display: flex;
}

img.MealImg {
  image-rendering: crisp-edges;
  object-fit: contain;
}

div.MealImg>p {
  margin: auto;
  text-align: center;
}

.MealImgFix {
  display: flex;
  width: 100%;
  margin: 0 .3rem 0 0;
}

.MealDesc {
  font-size: 0.8rem;
  color: #444;
  flex: 3;
  margin: .5rem .3rem 0 .3rem;
  text-indent: 1rem;
  word-break: break-all;
}

.MealTitle {
  font-size: 1rem;
  margin: 0 0 .5rem 0;
}

& {
  margin: .5rem;
  padding: 1rem;
  background-color: #fff;
  border: 1px #ddd solid;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-sizing: border-box;
  cursor: pointer;
  transition: .2s linear 0s;
  transition-property: background, border
}

&:hover {
  border: 1px #666 solid;
  background-color: #ddd;
}`}>
      <h3 className="MealTitle">{RecipeData.title}</h3>
      <div className="MealContent">
        <div className="MealImgFix">{NullableImg(RecipeData.image_url, RecipeData.title)}</div>
          <p className="MealDesc">{RecipeData.description.substring(0,40)+(RecipeData.description.length>40 ? "…" : "")}</p>
      </div>
      </div>
    </Link>);
}