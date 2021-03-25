import React, {useEffect, useState, FC} from 'react';
import { RecipeFeedData } from "../components/RecipeFeedData";
import { APIError } from "../components/APIError";
import { BrowserRouter, Route, Link, Switch, useLocation, Router } from "react-router-dom";
import { RecipeFeedDom } from '../components/RecipeFeedDom';
import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";

type Props = {
  Feed: RecipeFeedData;
}

function GetQueryParams(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

function GetQuery(ParamName: string): string | null {
  try {
    const Query = GetQueryParams();
    return Query.get(ParamName);
  } catch (e) {
    console.error(e);
    return null;
  }
}

//TODO: fix this any
export const getServerSideProps: GetServerSideProps = async (context) => {
  var CurrentPageRaw = (context.query.page);
  if (CurrentPageRaw instanceof Array) { CurrentPageRaw = CurrentPageRaw[0] } // override, why array?
  const CurrentPage = (CurrentPageRaw) ? (parseInt(CurrentPageRaw)) : 1;

  var OutFeed = await GetRecipeFeed(CurrentPage);
  return {
    props: {
      Feed: OutFeed
    }
  }
}

async function GetRecipeFeed(SelectPage: number): Promise<RecipeFeedData | APIError> {
  return new Promise((Resolve, Reject) => {
    // Not really nullable
    const API_URL: string = process.env.REACT_APP_API_URL ?? "";
    const API_TOKEN: string = process.env.REACT_APP_API_TOKEN ?? "";

    const ReqHeaders: HeadersInit = new Headers();
    ReqHeaders.set("x-api-key", API_TOKEN);
    ReqHeaders.set("Content-Type", "application/json");

    console.info(API_URL + "recipes?page=" + encodeURIComponent(SelectPage));

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
          console.error("server returned error")
          Reject(Re);
        } else {
          var Rf = jdt as RecipeFeedData;
          Rf.type = "RecipeFeedData"; // !??!?!??!
          Resolve(Rf);
        }
      }).catch((err) => {
        console.error("JSON err")
        Reject(err);
      });
    })
  })
}

const App = (props: Props) => {
  console.info(props);
  const router = useRouter();
  const [APIFeed, setFeed] = useState<RecipeFeedData | APIError>();
  const [page, SetPage] = useState<number>(1);

  var CurrentPageRaw = (router.query.page);
  if (CurrentPageRaw instanceof Array) { CurrentPageRaw = CurrentPageRaw[0] } // override, why array?
  const CurrentPage = (CurrentPageRaw) ? (parseInt(CurrentPageRaw)) : 1;

  return (
    <div>
    <header>
      <button>Menu?</button>
      <h1>CookyStash</h1>
    </header>

      <RecipeFeedDom page={1} Feed={props.Feed}></RecipeFeedDom>
    
    {/*
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
      */}

    <footer>
      <p>This app is in eager development.</p>
    </footer>
  </div>
  );
}

export default App;
