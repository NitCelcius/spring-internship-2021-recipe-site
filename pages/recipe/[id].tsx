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
      .MealImg {
        box-sizing: border-box;
        width: 100%;
        padding: .2rem;
        border: 2px #eee0 solid;
        border-radius: min(3%, 1rem);
        /* IT LOOKS ROUND!!! (again) */
        box-shadow: 0 0 .2rem .2rem #e0e0e0;
      }

      .Recipe {
        margin: 2rem min(.5rem, 2%);
      }

      h1.Meal_Title {
        text-align: center;
      }

      h1.Meal_Title>span {
        font-weight: lighter;
        border-bottom: 2px #aaa dashed;
      }

      .Recipe>p {
        text-align: center;
      }

      .Label {
        margin-right: 1rem;
        color: #888;
      }

      h2 {
        color: #379c37;
        border-bottom: 1px #888 dashed;
      }

      .Meal_Ingredients {
        list-style: none;
        line-height: 2.3;
        padding: 0 2rem;
      }

      .Meal_Ingredients>li {
        display: flex;
        margin: 0;
        flex-direction: row;
        border-bottom: 1px #ddd solid;
      }

      .Ingr_Name {
        font-size: 1.0rem;
      }

      .Ingr_Amount {
        min-width: 5rem;
        text-align: right;
        margin-left: auto;

      }

      .Ingr_Emp {
        font-size: 1.3rem;
      }

      .Meal_Steps {
        list-style-type: none;
        padding: 0 1rem;
      }

      .Meal_Steps>li {
        min-height: 2rem;
        margin: .5rem 0;
        text-indent: 1rem;
      }

      .Meal_Steps tr {
      }

      .Meal_Steps th {
        display: inline-block;
        font-size: 1.2rem;
        font-weight: bolder;
        color: #aaa;
        width: 2.4rem;
        padding-right: 0.5rem;
        text-align: right;
        margin: 0.5rem 0;
      }

      .Meal_Steps td {
        padding-left: 0.5rem;
        border-left: 1px #ddd solid;
        word-break: keep-all;
      }

`}>
      <Header />

      <section className="Recipe">
      
      {NullableImg(Recipe.image_url, Recipe.title)}

      <h1 className="Meal_Title"><span>{Recipe.title}</span></h1>
      <p className="Meal_Desc">{Recipe.description}</p>

      <p className="Meal_Author"><span className="Label">投稿した人</span>{ Recipe.author.user_name }</p>
      <p className="Meal_PublishedAt"><span className="Label">投稿した日</span>{RelDateStr(new Date(Recipe.published_at))} <span className="Label">({SqlizeDate(new Date(Recipe.published_at))})</span></p>
      <p className="Meal_id"><span className="Label">レシピID</span>{Recipe.id}</p>

      <h2>🥗材料</h2>
      <ul className="Meal_Ingredients">
        {
          Recipe.ingredients.map((Ingr) => {
            return (<li>
              <span className="Ingr_Name">{Ingr.name}</span>
              <span className="Ingr_Amount">{Ingr_Format(Ingr.quantity)}</span>
            </li>)
          })
        }
      </ul>

      <h2>🍳作り方</h2>
      <table className="Meal_Steps">
        {
          Recipe.steps.map((step, index) => {
            return (<tr key={"step_"+index}>
              <th>{index + 1}</th>
              <td>{step}</td>
            </tr>)
          })
        }
        </table>
        
      </section>
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

// Copy-and-paste from SchedulePost
function RelDateStr(dt: Date) {
  var Prefix = "";
  var PastTodayD = Math.floor(new Date().getTime() / (1000 * 60));
  var PastTargetD = Math.floor(dt.getTime() / (1000 * 60));
  var MinDiff = PastTodayD - PastTargetD;

  // A bit cute phrase
  if (MinDiff >-1 && MinDiff < 1) {
    return "ついさっき";
  }
  if (MinDiff < 60) {
    return MinDiff.toString()+"分前"
  }
  if (MinDiff < 1440) {
    return Math.floor(MinDiff/60).toString()+"時間前"
  }
  if (MinDiff < 263520) { //183 days I guess...
    return Math.floor(MinDiff / 1440).toString() + "日前"
  }
  if (MinDiff < 525888) { //365.20 days
    return "半年くらい前"
  }
  if (MinDiff < 0) {
    return "すごく昔"
  }

  return Math.floor(MinDiff / 525888)+" 年前";
}

function SqlizeDate(TargetDate: Date) {
  // What the heck, convert!
  return "" + TargetDate.getFullYear() + "/" + (TargetDate.getMonth() + 1)+"/"+(TargetDate.getDate());
}

//((((大|小)さじ|)[0-9]*([枚束個本株玉袋粒節把房つ塊原頭斤缶杯足]|かけ|パック|切れ|))|少々|適宜|適量)

function Ingr_Format(Quantity: string) {
  const NumReg = new RegExp("([0-9]|\.)*");
  return Array.from(Quantity).map((chr) => {
    if (NumReg.test(chr)) {
      return <span className="Ingr_Emp">{chr}</span>
    } else {
      return chr;
    }
  })
}

export default App;