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
  page: number;
}

export const RecipeFeedDom: FC<Props> = (Props) => {
  const [APIFeed, setFeed] = useState<RecipeFeedData | APIError>();

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
          {(APIFeed) ? FeedDisplay(APIFeed): <p>loading</p>}
        </section>
      }
      {
        (APIFeed) && (APIFeed.type === "RecipeFeedData") ? FeedNavigator(APIFeed.links) : ""
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

import { GetServerSideProps } from "next";

//TODO: fix this any
export async function getServerSideProps(context :any) {
  // Not really nullable
  const API_URL: string = process.env.REACT_APP_API_URL ?? "";
  // This token is gonna be gone
  const API_TOKEN: string = process.env.REACT_APP_API_TOKEN ?? "";

  const page = context.query.page;

  var OutFeed = await GetRecipeFeed(page, API_URL, API_TOKEN);
  return {
    props: {
      Feed: OutFeed
    }
  }
}

async function GetRecipeFeed(SelectPage: number, API_URL: string, API_TOKEN: string): Promise<RecipeFeedData | APIError> {
  return new Promise((Resolve, Reject) => {
    const ReqHeaders: HeadersInit = new Headers();
    ReqHeaders.set("x-api-key", API_TOKEN);
    ReqHeaders.set("Content-Type", "application/json");

    console.info(API_URL + "?page=" + encodeURIComponent(SelectPage));

    if (!API_URL) {
      console.error("API URL is not set!?");
      return false;
    }

    fetch(API_URL + "?page=" + encodeURIComponent(SelectPage), {
      method: "GET",
      headers: ReqHeaders,
    }
    ).then((resp) => {
      resp.json().then((jdt) => {
        if (jdt.message) {
          var Re = jdt as APIError;
          Re.type = "APIError"; // !??!?!??!
          Reject(Re);
        } else {
          var Rf = jdt as RecipeFeedData;
          Rf.type = "RecipeFeedData"; // !??!?!??!
          Resolve(Rf);
        }
      }).catch((err) => {
        Reject(err);
      });
    })
  })
}