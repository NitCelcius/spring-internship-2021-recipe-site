import { PageLinks } from "./PageLinks";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

export function FeedNavigator(LinkObj: PageLinks) {
  const router = useRouter();

  function APISwitchHandler(Page: number) {
    if (Page < 1) { return; }

    router.push({
      pathname: router.pathname,
      query: { page: Page , ...router.query }
    });
  }
  //const [PrevFlag, SetPrevState] = useState<boolean>();
  //const [NextFlag, SetNextState] = useState<boolean>();

  const CurrentPageRaw = (router.query.page instanceof Array) ? router.query.page[0] : router.query.page;
  const CurrentPage = (CurrentPageRaw) ? (parseInt(CurrentPageRaw)) : 1;

  //SetPrevState((LinkObj.prev) ? true : false);
  //SetNextState((LinkObj.next) ? true : false);

  const PrevLink = <button disabled={false} onClick={() => APISwitchHandler(CurrentPage - 1)}>前のページへ</button>
  const NextLink = <button disabled={false} onClick={() => APISwitchHandler(CurrentPage + 1)}>次のページへ</button>

  return (<div className="FeedLinks">{PrevLink}{NextLink}</div>);
}
