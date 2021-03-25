import React, { useEffect, useState, FC } from 'react';
import { BrowserRouter, Route, Link, Switch, useLocation, Router } from "react-router-dom";
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from "next";
import { SearchData } from '../../components/SearchData';
import { SearchDataDom } from "../../components/SearchDataDom";
import { APIError } from '../../components/APIError';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';

type Props = {
  Result: SearchData
}

// It does return some stuff
export const getServerSideProps: GetServerSideProps = async (context) => {
  const CurrentPageRaw = (context.query.page instanceof Array) ? (context.query.page[0]) : context.query.page;
  const CurrentPage = (CurrentPageRaw) ? (parseInt(CurrentPageRaw)) : 1;
  const KeywordRaw = (context.query.q instanceof Array) ? (context.query.q[0]) : context.query.q;
  const Keyword = (KeywordRaw) ? KeywordRaw : "";

  return {
    props: {
      Result: await SearchRecipes(Keyword, CurrentPage)
    }
  };
}

async function SearchRecipes(Keyword: string, SelectPage: number): Promise<SearchData | APIError> {
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

    console.info((API_URL + "/search?keyword=" + encodeURIComponent(Keyword) + "&page=" + encodeURIComponent(SelectPage)));
    fetch(API_URL + "/search?keyword="+ encodeURIComponent(Keyword) +"&page=" + encodeURIComponent(SelectPage), {
      method: "GET",
      headers: ReqHeaders,
    }
    ).then((resp) => {
      resp.json().then((JsData) => {
        if (JsData.message) {
          // I meant 404
          if (resp.status === 404) {
            let Re = JsData as SearchData;
            Re.type = "SearchData";
            Re.recipes = null;
            Resolve(Re);
          } else {
            let Re = JsData as APIError;
            Re.type = "APIError"; // !??!?!??!
            console.error("server returned an error");
            Reject(Re);
          }
        } else {
          let Rf = JsData as SearchData;
          Rf.type = "SearchData"; // !??!?!??!
          Resolve(Rf);
        }
      }).catch((err) => {
        console.error("server returned non-JSON!?");
        Reject(err);
      });
    })
  })
}

const App: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const [APIFeed, setFeed] = useState<SearchData | APIError>();
  const [page, SetPage] = useState<number>(1);

  let CurrentPageRaw = (router.query.page);
  if (CurrentPageRaw instanceof Array) { CurrentPageRaw = CurrentPageRaw[0] } // override, why array?
  const CurrentPage = (CurrentPageRaw) ? (parseInt(CurrentPageRaw)) : 1;
  const KeywordRaw = (router.query.q instanceof Array) ? (router.query.q[0]) : router.query.q;
  const SearchWord = (KeywordRaw) ? KeywordRaw : "";

  return (
    <div>
      <Header />

      <SearchDataDom keyword={SearchWord} page={CurrentPage} result={props.Result}></SearchDataDom>
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

      <Footer />

    </div>
  );
}

export default App;