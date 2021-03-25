import { PageLinks } from "./PageLinks";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

export function FeedNavigator(LinkObj: PageLinks) {
  const router = useRouter();

  function APISwitchHandler(Page: number) {
    if (Page < 1) { return; }

    router.push({
      pathname: "/",
      query: { page: Page }
    });
  }
  //const [PrevFlag, SetPrevState] = useState<boolean>();
  //const [NextFlag, SetNextState] = useState<boolean>();

  var CurrentPageRaw = (router.query.page);
  if (CurrentPageRaw instanceof Array) { CurrentPageRaw = CurrentPageRaw[0] } // override, why array?
  const CurrentPage = (CurrentPageRaw) ? (parseInt(CurrentPageRaw)) : 1;

  //SetPrevState((LinkObj.prev) ? true : false);
  //SetNextState((LinkObj.next) ? true : false);

  var PrevLink = <button disabled={false} onClick={() => APISwitchHandler(CurrentPage - 1)}>前のページへ</button>
  var NextLink = <button disabled={false} onClick={() => APISwitchHandler(CurrentPage + 1)}>次のページへ</button>

  return (<div className="FeedLinks">{PrevLink}{NextLink}</div>);
}
