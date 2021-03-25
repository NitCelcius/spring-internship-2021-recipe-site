import { RecipeFeedData } from "./RecipeFeedData";
import { FeedNavigator } from "./FeedNavigator";
import { FC, Component } from "react";
import React, { useEffect, useState } from 'react';
import { Recipe } from "./Recipe";
import { APIError } from "./APIError";
import MedMealNode from "./showcases/MedMealNode";
import { SearchBox } from "./SearchBox";

type Props = {
  page: number
  Feed: RecipeFeedData
};

export const RecipeFeedDom: FC<Props> = (Props) => {
  const [APIFeed, setFeed] = useState<RecipeFeedData | APIError>();

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
      <SearchBox />

      {/*
    {(!APIFeed) ? <p className="StatusLabel">LOADING</p> : ""}
    <section id="Feed">
      {(APIFeed) ? FeedDisplay(APIFeed) : <p className="StatusLabel"> LOADING</p>}
    </section>

      {((APIFeed) && APIFeed.type === "RecipeFeedData") ? FeedNavigator(APIFeed.links) : ""}
      */}
      {
        <section id="Feed">
          {(Props.Feed) ? FeedDisplay(Props.Feed) : <p>loading</p>}
        </section>
      }
      {
        (Props.Feed) && (Props.Feed.type === "RecipeFeedData") ? FeedNavigator(Props.Feed.links) : ""
      }

    </article>
  )
}

function FeedDisplay(FeedObj: RecipeFeedData | APIError) {
  if (FeedObj) {
    switch (FeedObj.type) {
      case "RecipeFeedData": {
        return FeedObj.recipes.map((targetRecipe) => {
          return MedMealNode(targetRecipe as Recipe);
        });
      }

      case "APIError": {
        return <p className="ErrorLabel">ERROR</p>;
      }

      default: {
        console.warn("API responded with an unknown type!?");
        console.warn(FeedObj);
        return <p className="ErrorLabel">ERROR</p>
      }
    }
  } else {
    return <p className="Status">LOADING</p>;
  }
}



