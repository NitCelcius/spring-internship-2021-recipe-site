import React, { useEffect, useState, } from 'react';
import { RecipeFeedData } from "../components/RecipeFeedData";
import { APIError } from "../components/APIError";
import { RecipeFeedDom } from '../components/RecipeFeedDom';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from "next";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { css } from "@emotion/css";

type Props = {
  API_URL: string;
  API_TOKEN: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      API_URL: process.env.REACT_APP_API_URL ?? "",
      API_TOKEN: process.env.REACT_APP_API_KEY ?? ""
    }
  };
}

const New: NextPage<Props> = (props) => {

  useEffect(() => {
    CreateForm();
  },[])

  const [prevSrc, setPrevSrc] = useState<any | null>("data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" );

  function previewImage(e: any) {
    var fileReader = new FileReader();
    fileReader.onload = (function () {
      setPrevSrc(fileReader.result);
    });
    console.info(e);
    fileReader.readAsDataURL(e.target.files[0]);
  }

  return (
    <React.Fragment>
      <Header />
      <div className={css`
      & {
        box-sizing: border-box;
        padding: 0 min(0.5rem, 2vw);
      }

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

      form {
        flex-direction: column;
        text-align: center;
      }

      form input {
        border-bottom: 2px #aaa dashed;
        margin-bottom: 1rem;
      }

      .Description {

      }

      .Meal_Title {
        appearance: none;
        border: none;
        text-align: center;
        font-size: 1.4rem;
        font-weight: lighter;
        border-bottom: 2px #bbb dashed;
      }
        

      // I can't stop using flex.
      #Ingredients {
        display: flex;
        flex-direction: column;
      }

      #Ingredients>div {
        display: flex;
        box-sizing: border-box;
        width: 100%;
        padding: 0 min(5%, 2rem);
        margin-bottom: 1rem;
      }

      .Ingr {
        flex-direction: row !important;
      }

      /* Can this have V-align: botton? */
      .Ingr_Name {
        font-size: 1.1rem;
        width: 100%;
        font-family: inherit;
        appearance: none;
        border: none;
        border-bottom: 2px #aad dashed;
        padding: .5rem;
        margin-right: 1rem;
      }

      .Ingr_Amount {
        font-size: 1.1rem;
        font-family: inherit;
        min-width: 5rem;
        text-align: right;
        margin-left: auto;
        appearance: none;
        border: none;
        border-bottom: 2px #ada dashed;
        padding: .5rem;
      }

      .Ingr_Del,
      .Steps_Del {
        appearance: none;
        border: none;
        background-color: #fdd;
        color: red;
        padding: 0 1rem;
        margin-right: 1rem;
      }

      #Ingr_Template {
        display: none !important;
      }

      .Description {
        width: calc(100% - 2rem);
        box-sizing: border-box;
        padding: 1rem;
        margin: 1rem 0;
        appearance: none;
        border: 1px #aaa dashed;
        resize: none;
        font-family: inherit;
      }

      .Meal_Steps {
        list-style-type: none;
        padding: 0 .5rem;
        width: calc(100% - 2rem);
        box-sizing: border-box;
        padding: 1rem;
        margin: 0rem 0;
        appearance: none;
        border: 1px #666 dashed;
        resize: none;
        font-family: inherit;
      }

      .Steps_Label {
        display: inline-block;
        font-size: 1.2rem;
        font-weight: bolder;
        color: #aaa;
        width: 2.4rem;
        padding-right: 0.5rem;
        text-align: right;
        margin: 0.5rem 0;
      }

      .Steps_Wrapper {
        display: flex;
        flex-direction: row;
        padding: 0 min(5%, 2rem);
        margin-bottom: 1rem;
      }

      #Steps_Template {
        display: none;
      }

      .MealImg>p {
        text-align: center;
      }

      .Adder {
        appearance: none;
        padding: 0.8rem 2rem;
        border-radius: .5rem;
        transition: 0.2s linear;
        transition-property: border, background, color;
        background-color: #fff;
        border: 2px #bbb solid;
        color: #000;
      }

      .Adder:hover {
        background-color: #52a160;
        border: 2px #2a4b2f solid;
        color: #fff;
      }

      .SubmitRecipe {
        appearance: none;
        padding: 0.8rem 2rem;
        margin: 1rem 0;
        width: min(30%, 10rem);
        border-radius: .5rem;
        transition: 0.2s linear;
        transition-property: border, background, color;
        background-color: #e7ab28;
        border: 2px #8a671c solid;
        color: #fff;
        font-weight: bolder;
      }

      .SubmitRecipe:hover {
        background-color: #c99526;
        border: 2px #eeb02b solid;
        color: #fff;
        font-weight: bolder;
      }

      .SubmitRecipe:active {
        background-color: #a0771f;
        border: 2px #b48622 solid;
        color: #000;
        font-weight: bolder;
      }

      `}>
        <h1 className={css`
          & {
            color: #379c37;
            border-bottom: 1px #888 solid;
            text-align: left;
          }
        `}>新規作成</h1>
        <form id="RecipeForm" name="Recipe">
          <input type="text" id="RecipeTitle" name="title" className="Meal_Title" placeholder="名前をつけてください" />
          <br />
          <textarea id="RecipeDesc" className="Description" name="description" placeholder="どんな料理ですか？"></textarea>
          <br />
          <h2>画像(動きません)</h2>
          <p>png か jpeg でアップロードしてください</p>
          
          <img className="MealImg" src={prevSrc}alt="アップロードする画像"></img>

          <input type="file" accept="image/jpeg, image/png" name="image" onChange={previewImage}/>
          <br />
          <h2>材料</h2>
          <section id="Ingredients">
            <div id="Ingr_Template" className="Ingr">
              <button type="button" className="Ingr_Del" onClick={DeleteIt}>×</button>
              <input type="text" className="Ingr_Name" placeholder="材料の食材"></input>
              <input type="text" className="Ingr_Amount" placeholder="量"></input>
              <br />
            </div>
          </section>
          <button className="Adder" type="button" onClick={AddIngredient}>追加</button>
          <br />
          <h2>作り方</h2>
          <section id="Steps">
            <div id="Steps_Template" className="Steps_Wrapper">
              <button type="button" className="Steps_Del" onClick={DeleteStep}>×</button>
              <label className="Steps_Label">1</label>
              <textarea className="Meal_Steps" placeholder="手順"></textarea>
              <br />
            </div>
          </section>
          <button className="Adder" type="button" onClick={AddStep}>追加</button>
          <br />
          <button className="SubmitRecipe" type="button" onClick={() => {
            var yn: boolean = confirm("投稿してもよろしいですか？");
            if (yn) { SubmitRecipe(props) };
          }}>投稿する</button>
        </form>

        </div>
      <Footer />
    </React.Fragment>
  
  );
}

function CreateForm() {
}

function SubmitRecipe(props: Props) {
    // LITERALLY POST
  const RecipeForm = document.getElementById("RecipeForm");
  // document.Recipe did not work

    let PostSteps;
    // Why html stuff does not have foreach anyway
    var Targets = document.getElementById("Steps")?.getElementsByClassName("Steps_Wrapper");
    let Steps: string[] = [];
    if (Targets) {
      for (var i = 0; i < Targets.length; i++) {
        if (Targets[i].id === "Steps_Template") {
          continue;
        }
        Steps.push((Targets[i].getElementsByClassName("Meal_Steps")[0] as HTMLInputElement).value);
      }
    }

    type Ingredient = {
      name: string;
      quantity: string;
    }

    let PostIngredients;
    var Targets = document.getElementById("Ingredients")?.getElementsByClassName("Ingr_User");
    let Ingredients: Ingredient[] = [];
    if (Targets) {
      for (var i = 0; i < Targets.length; i++) {
        if (Targets[i].id === "Ingr_Template") {
          continue;
        }
        Ingredients.push({
          name: (Targets[i].getElementsByClassName("Ingr_Name")[0] as HTMLInputElement).value,
          quantity: (Targets[i].getElementsByClassName("Ingr_Amount")[0] as HTMLInputElement).value
        } as Ingredient);
      }
    }

  let PostData;

  if (RecipeForm) {
    let title = document.getElementById("RecipeTitle");
    if (!title) { return; }
    let desc = document.getElementById("RecipeDesc");
    if (!desc) { return; }
    PostData = JSON.stringify({
      title: (title as HTMLInputElement).value,
      description: (desc as HTMLInputElement).value,
      steps: Steps,
      ingredients: Ingredients,
      image_url: null
    })
  } else {
    PostData = null;
    return;
  }

  // I don't really wanna do this
  const ReqHeaders: HeadersInit = new Headers();
  ReqHeaders.set("x-api-key", props.API_TOKEN);
  ReqHeaders.set("Content-Type", "application/json");

  //console.info(props.API_URL + "/recipes");
  let URL = props.API_URL + "/recipes";

  fetch(URL, {
    method: "POST",
    headers: ReqHeaders,
    body: PostData
  }).then((raw) => {
    raw.json().then((json) => {
      if (json) {
        if (!json.message) {
          alert("投稿しました。");
          console.info("success");
        } else {
          alert("投稿できませんでした。");
          console.error("Err:");
          console.error(json);
        }
      }
    })
  })
}

function AddIngredient() {
  const Temp = document.getElementById("Ingr_Template");
  let Copy: any;
  if (Temp) {
    Copy = Temp.cloneNode(true);
    Copy.id = "";
    Copy.classList.add("Ingr");
    Copy.classList.add("Ingr_User");
    Copy.style.display = "flex";
    if (Temp.parentElement) {
      Copy.getElementsByClassName("Ingr_Del")[0]. addEventListener("click", DeleteIt);
      Temp.parentElement.appendChild(Copy);
    }
  }
}

function AddStep() {
  const Temp = document.getElementById("Steps_Template");
  let Copy: any;
  if (Temp) {
    Copy = Temp.cloneNode(true);
    Copy.id = "";
    Copy.classList.add("Step");
    Copy.classList.add("Step_User");
    Copy.style.display = "flex";
    if (Temp.parentElement) {
      Copy.getElementsByClassName("Steps_Del")[0].addEventListener("click", DeleteIt);
      Temp.parentElement.appendChild(Copy);
    }

    ReloadStepNumbers();
  }
}

function ReloadStepNumbers() {
  const Steps = document.getElementById("Steps")?.getElementsByClassName("Steps_Wrapper");

  if (Steps) {
    let count = 1;
    for (var i = 0; i < Steps.length; i++) {
      if (Steps[i].id === "Steps_Template") {
        continue;
      } else {
        /* innerText exists */
        (Steps[i].getElementsByClassName("Steps_Label")[0] as HTMLElement).innerText = count.toString();
        count++;
      }
    }
  }
}


// eww, any
function DeleteIt(e: any) {
  console.info(e);
  if (e.target) {
    if (e.target.parentElement.id !== "Ingr_Template") {
      e.target.parentElement.remove();
    } else {
      // what!?
    }
  }
}

// eww, any
function DeleteStep(e: any) {
  console.info(e);
  if (e.target) {
    if (e.target.parentElement.id !== "Steps_Template") {
      e.target.parentElement.remove();
      ReloadStepNumbers();
    } else {
      // what!?
    }
  }
}


export default New;
