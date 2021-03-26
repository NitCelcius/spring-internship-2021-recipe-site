import { PageLinks } from "./PageLinks";
import { useRouter } from "next/router";
import { css } from "@emotion/css"
import { useEffect, useState } from "react";


export function FeedNavigator(LinkObj: PageLinks) {
  console.info(LinkObj);
  const router = useRouter();

  function APISwitchHandler(Page: number) {
    console.info("!");
    if (Page < 1) { return; }

    router.push({
      pathname: router.pathname,
      query: { ...router.query ,page: Page }
    });
  }

  //const [PrevFlag, SetPrevState] = useState<string>();
  //const [NextFlag, SetNextState] = useState<string>();
  const [PrevFlag, SetPrevState] = useState<boolean>();
  const [NextFlag, SetNextState] = useState<boolean>();

  const CurrentPageRaw = (router.query.page instanceof Array) ? router.query.page[0] : router.query.page;
  const CurrentPage = (CurrentPageRaw) ? (parseInt(CurrentPageRaw)) : 1;

  useEffect(() => {
    console.info("SET");
    SetPrevState((LinkObj.prev) ? false : true);
    SetNextState((LinkObj.next) ? false : true);
    //SetPrevState((LinkObj.prev) ? "" : "disabled");
    //SetNextState((LinkObj.next) ? "" : "disabled");
  }, [LinkObj]);

  let Back2Init = <button onClick={() => APISwitchHandler(1)} className="Nav_Init">最初へ戻る</button>

  /* looks "disabled" attribute has wrong type than that of normal <button> */
  let PrevLink = <button disabled={PrevFlag} onClick={() => APISwitchHandler(CurrentPage - 1)} className="Nav_Prev">前のページへ</button>
  let NextLink = <button disabled={NextFlag} onClick={() => APISwitchHandler(CurrentPage + 1)} className="Nav_Next">次のページへ</button>

  return (<nav className={css`
    & {
      text-align: center;
      margin: 1rem 0;
    }

    button {
      appearance: none;
      border: 2px #ddd solid;
      border-radius: 3px;
      background: none;
      margin: 0 1rem;
      padding: 1rem;
      cursor: pointer;
    }

    button:disabled { /* IT DISAPPEARS! */
      display: none;
      cursor: not-allowed;
    }

    .Nav_Init {
      margin-right: 1rem;
      transition: 0.2s linear;
      transition-property: border, color, background;
      border: 2px #cacf89 solid;
      background-color: #fff;
      color: #000;
    }

    .Nav_Init:hover {
      border: 2px #363d1e solid;
      background-color: #cacf89;
      color: #fff;
    }

    .Nav_Prev {
      transition: 0.2s linear;
      transition-property: border, color, background;
      border: 2px #89cfcf solid;
      background-color: #fff;
      color: #000;
    }

    .Nav_Prev:hover {
      border: 2px #356767 solid;
      background-color: #89cfcf;
      color: #fff;
    }

    .Nav_Next {
      transition: 0.2s linear;
      transition-property: border, color, background;
      border: 2px #89cf95 solid;
      background-color: #fff;
      color: #000;
    }

    .Nav_Next:hover {
      border: 2px #2a4b2f solid;
      background-color: #89cf95;
      color: #fff;
    }

  `}><div className="FeedLinks">{Back2Init}{PrevLink}{NextLink}</div></nav>);
}
