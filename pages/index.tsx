import React, { useState, } from 'react';
import { RecipeFeedData } from "../components/RecipeFeedData";
import { APIError } from "../components/APIError";
import { BrowserRouter, Route, Link, Switch, useLocation, Router } from "react-router-dom";
import { RecipeFeedDom } from '../components/RecipeFeedDom';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from "next";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { css } from "@emotion/css";

type Props = {
  Feed: RecipeFeedData;
}

// It does return some stuff
export const getServerSideProps: GetServerSideProps = async (context) => {
  const CurrentPageRaw = (context.query.page instanceof Array) ? (context.query.page[0]) : context.query.page;
  const CurrentPage = (CurrentPageRaw) ? (parseInt(CurrentPageRaw)) : 1;

  return {
    props: {
      Feed: await GetRecipeFeed(CurrentPage)
    }
  }

    ;
}

async function GetRecipeFeed(SelectPage: number): Promise<RecipeFeedData | APIError> {
  return new Promise((Resolve, Reject) => {
    // Not really nullable
    const API_URL: string = process.env.REACT_APP_API_URL ?? "";
    const API_TOKEN: string = process.env.REACT_APP_API_KEY ?? "";

    const ReqHeaders: HeadersInit = new Headers();
    ReqHeaders.set("x-api-key", API_TOKEN);
    ReqHeaders.set("Content-Type", "application/json");

    if (!API_URL) {
      console.error("API URL is not set!?");
      return false;
    }

    if (!API_TOKEN) {
      console.error("API key is not set!?");
    }

    console.info(API_URL+"/recipes?page="+encodeURIComponent(SelectPage));
    fetch(API_URL + "/recipes?page=" + encodeURIComponent(SelectPage), {
      method: "GET",
      headers: ReqHeaders,
    }

    ).then((resp) => {
      resp.json().then((JsData) => {
        if (JsData.message) {
          let Re = JsData as APIError;
          Re.type = "APIError"; // !??!?!??!
          console.error("server returned an error");
          Reject(Re);
        }

        else {
          let Rf = JsData as RecipeFeedData;
          Rf.type = "RecipeFeedData"; // !??!?!??!
          Resolve(Rf);
        }
      }

      ).catch((err) => {
        console.error("server returned non-JSON!?");
        Reject(err);
      }

      );
    }

    )
  }

  )
}

const App: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const [APIFeed,
    setFeed] = useState<RecipeFeedData | APIError>();
  const [page,
    SetPage] = useState<number>(1);

  let CurrentPageRaw = (router.query.page);

  if (CurrentPageRaw instanceof Array) {
    CurrentPageRaw = CurrentPageRaw[0]
  }

  // override, why array?
  const CurrentPage = (CurrentPageRaw) ? (parseInt(CurrentPageRaw)) : 1;

  return (

    /* CSS snippets not working :pien: */
    <div className={
      css` .MealTitle {
        font-size: 1.7rem;
        margin: 0 0 .5rem 0;
      }

      .MealWrapper {
        padding: 1rem;
        background-color: #fff;
        border: 1px #ddd solid;
        border-radius: 8px;
        margin-bottom: 2rem;
        box-sizing: border-box;
        cursor: pointer;
        transition: .2s linear 0s;
        transition-property: background, border
      }

      .MealWrapper:hover {
        border: 1px #666 solid;
        background-color: #ddd;
      }

      .MealImg {
        width: 100%;
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
        flex: 4;
        width: 57%;
        margin: 0 .3rem 0 0;
        min-height: 5rem;
      }

      .MealDesc {
        font-size: 1.1rem;
        color: #444;
        flex: 3;
        margin: 0 0 0 .3rem;
        text-indent: 1rem;
        word-break: break-all; /* If not      really readable let me know */
      }

      `
    }

    > <Header /> <RecipeFeedDom page={
      CurrentPage
    }

      Feed={
        props.Feed
      }

    ></RecipeFeedDom> {
        /*
        <Router>
          <Route exact path="/" render={() =>
            (APIFeed) ? <RecipeFeedDom Feed={APIFeed} /> : <p>LOADING</p>
          }>
            <Link to="/d">to D</Link>
          </Route>
          <Route path="*">
            <p>AAA</p>
          </Route>
        </Router>
        */
      }

      <Footer /> </div>);
}

export default App;
