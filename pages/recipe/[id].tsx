import React, { useEffect, useState, FC } from 'react';
import { BrowserRouter, Route, Link, Switch, useLocation, Router } from "react-router-dom";
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from "next";
import { Recipe } from '../../components/Recipe';
import { APIError } from '../../components/APIError';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { NullableImg } from '../../components/NullableImg';
import { css } from "@emotion/css";

type Props = {
  RecipeData: Recipe;
}

// It does return some stuff
export const getServerSideProps: GetServerSideProps = async (context) => {
  const TargetidRaw = (context.query.id instanceof Array) ? (context.query.id[0]) : context.query.id;
  const Targetid = (TargetidRaw) ? (parseInt(TargetidRaw)) : 1;

  return {
    props: {
      RecipeData: await GetRecipe(Targetid)
    }
  };
}

async function GetRecipe(Recipeid: number): Promise<Recipe | APIError> {
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

    fetch(API_URL + "/recipes/" + encodeURIComponent(Recipeid), {
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
        } else {
          let Rf = JsData as Recipe;
          Rf.type = "Recipe"; // !??!?!??!
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
  const [APIFeed, setFeed] = useState<Recipe | APIError>();
  const [page, SetPage] = useState<number>(1);
  const Recipe = props.RecipeData;

  return (
    <div className={css`
      
    `}>
      <Header />

      {NullableImg(Recipe.image_url, Recipe.title)}

      <h1>{Recipe.title}</h1>
      <p className="Meal_Desc">{Recipe.description}</p>

      <p className="Meal_Author">{ Recipe.author.user_name }</p>
      <p className="Meal_PublishedAt">{Recipe.published_at}</p>
      <p className="Meal_id">{Recipe.id}</p>

      <ul className="Meal_Ingredients">
        {
          Recipe.ingredients.map((Ingr) => {
            return <li><span className="Ingr_Name">{Ingr.name}</span><span className="Ingr_Amount">{Ingr.quantity}</span></li>
          })
        }
      </ul>

      <ol className="Meal_Steps">
        {
          Recipe.steps.map((step) => {
            return <li>{step}</li>
          })
        }
      </ol>
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