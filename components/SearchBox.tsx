import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export function SearchBox() {
  const router = useRouter();
  const [Q, UpdateQ] = useState("");

  const SearchChecker = (e: FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: "/search",
      query: { page: 1, q: Q }
    });
  }

  return (<form id="SearchSect" name="Search" action="/search" method="GET" onSubmit={SearchChecker}>
    <input id="SearchBox" type="search" placeholder="レシピを検索" name="q" onChange={(evt) => UpdateQ(evt.target.value)}></input>
    <button type="submit" id="SearchSubmit">GO</button>
  </form>);
}