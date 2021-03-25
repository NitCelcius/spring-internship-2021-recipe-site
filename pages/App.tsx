import React, {useEffect, useState, FC} from 'react';
import { RecipeFeedData } from "../components/RecipeFeedData";
import { APIError } from "../components/APIError";
import { BrowserRouter, Route, Link, Switch, useLocation, Router } from "react-router-dom";
import { RecipeFeedDom } from '../components/RecipeFeedDom';
import { useRouter } from 'next/router';

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

const App: FC = (props) => {
  const router = useRouter();
  const [APIFeed, setFeed] = useState<RecipeFeedData | APIError>();
  var CurrentPageRaw = (router.query.page);
  if (CurrentPageRaw instanceof Array) { CurrentPageRaw = CurrentPageRaw[0] } // override, why array?
  const CurrentPage = (CurrentPageRaw) ? (parseInt(CurrentPageRaw)) : 1;

  return (
    <div>
    <header>
      <button>Menu?</button>
      <h1>CookyStash</h1>
    </header>

    <RecipeFeedDom page={CurrentPage} />
    
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
