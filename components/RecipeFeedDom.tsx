import { RecipeFeedData } from "./RecipeFeedData";
import { FeedNavigator } from "./FeedNavigator";
import { FC, Component } from "react";
import React, { useEffect, useState } from 'react';
import { Recipe } from "./Recipe";
import { NullableImg } from "./NullableImg";

const API_URL: string = process.env.REACT_APP_API_URL ?? "";
// This token is gonna be gone
const API_TOKEN: string = process.env.REACT_APP_API_TOKEN ?? "";

type Props = {
  page: number
  Feed: RecipeFeedData
};

export const RecipeFeedDom: FC<Props> = (Props) => {
  const [APIFeed, setFeed] = useState<RecipeFeedData | APIError>();
  console.info(Props);

  {/*
    useEffect(() => {
      (async () => {
        console.warn(Props.page);
        const FetchFeed = await GetRecipeFeed(Props.page, API_URL, API_TOKEN);
        if (FetchFeed.type === 'APIError') {
          console.error("API ERROR !!!");
          console.error(FetchFeed.message);
        } else {
          setFeed(FetchFeed);
        }
      })();
    }, [Props.page])
  */
  }

  return (
  <article>
    <h2 className="PageTitle">レシピ一覧</h2>
    <hr></hr>
    <form id="SearchSect" name="Search" action="/search" method="GET">
      <input id="SearchBox" type="text" placeholder="レシピを検索" name="q"></input>
      <button id="SearchSubmit">GO</button>
      </form>
      {/*
    {(!APIFeed) ? <p className="StatusLabel">LOADING</p> : ""}
    <section id="Feed">
      {(APIFeed) ? FeedDisplay(APIFeed) : <p className="StatusLabel"> LOADING</p>}
    </section>

      {((APIFeed) && APIFeed.type === "RecipeFeedData") ? FeedNavigator(APIFeed.links) : ""}
      */}
      {
        <section id="Feed">
          {(Props.Feed) ? FeedDisplay(Props.Feed): <p>loading</p>}
        </section>
      }
      {
        (Props.Feed) && (Props.Feed.type === "RecipeFeedData") ? FeedNavigator(Props.Feed.links) : ""
      }

    </article>
  )
}

import { APIError } from "./APIError";

export function FeedDisplay(FeedObj: RecipeFeedData | APIError) {
  if (FeedObj) {
    switch (FeedObj.type) {
      case "RecipeFeedData": {
        var Fd = FeedObj.recipes.map((targetRecipe) => {
          var r = targetRecipe as Recipe;
          return (
            <div className="MealWrapper" key={r.id}>
              <h3 className="MealTitle">{r.title}</h3>
              <div className="HDivider MealContent">
                <div className="MealImgFix">{NullableImg(r.image_url, r.title)}</div>
                <p className="MealDesc">{r.description}</p>
              </div>
            </div>);
        });
        return Fd;
      }

      case "APIError": {
        return <h2>ERROR</h2>;
      }

      default: {
        console.warn("API responded with an unknown type!?");
        console.warn(FeedObj);
        return <h2>ERROR</h2>
      }
    }
  } else {
    return <p className="Status">LOADING</p>;
  }
}



