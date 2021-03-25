import { FeedNavigator } from "./FeedNavigator";
import { FC, Component } from "react";
import React, { useEffect, useState } from 'react';
import { Recipe } from "./Recipe";
import { APIError } from "./APIError";
import MedMealNode from "./showcases/MedMealNode";
import { SearchData } from "./SearchData";
import Link from "next/link";
import { SearchBox } from "./SearchBox";
import { css } from "@emotion/css"

type Props = {
  page: number;
  keyword: string;
  result?: SearchData;
};

export const SearchDataDom: FC<Props> = (Props) => {
  const [APIFeed, setFeed] = useState<SearchData | APIError>();

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
      <h2 className="PageTitle"><span className="SearchWord">{Props.keyword}</span> の検索結果</h2>
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
          {(Props.result) ? SearchDisplay(Props.result) : <p>loading</p>}
        </section>
      }
      {
        (Props.result) && (Props.result.type === "SearchData") && (Props.result.recipes) ? FeedNavigator(Props.result.links) : ""
      }

    </article>
  )
}

function SearchDisplay(SearchObj: SearchData | APIError) {
  if (SearchObj) {
    switch (SearchObj.type) {
      case "SearchData": {
        if (SearchObj.recipes) {
          return SearchObj.recipes.map((targetRecipe) => {
            return MedMealNode(targetRecipe as Recipe);
          });
        } else {
          // Suggestion!?

          return (<div className="NotFoundDiv">
            <h2 className="HugeQuestion">&#x2753;</h2>
            <p className="Search_NotFound">該当するレシピが見つかりませんでした<br />キーワードを変えて再度お試しください</p>
            <p className={css`
              & {
                color: #666;
                font-style: italic;
                font-size: 0.9rem;
                text-align: center
              }
            `}>レシピには名前をつけてあげましょう</p>
            <p className="Search_Back"><Link href="/">新着レシピに戻る</Link></p>
          </div>);
        }
      }

      case "APIError": {
        return <p className="ErrorLabel">ERROR</p>;
      }

      default: {
        console.warn("API responded with an unknown type!?");
        console.warn(SearchObj);
        return <p>エラーが発生しました</p>
      }
    }
  } else {
    return <p className="Status">LOADING</p>;
  }
}



