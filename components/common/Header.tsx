import Link from "next/link";
import { css } from "@emotion/css";

export const Header = () => {
  return (
    <header className={css`
      & {
        position: sticky;
        top: 0;
        box-shadow: -.2rem 0rem .2rem 0rem #ddd,
          .2rem 0rem .2rem .0rem #ddd,
          .0rem .2rem .2rem .0rem #ccc;
        border-left: 1px #eee solid;
        border-right: 1px #eee solid;
        display: flex;
        padding: 0;
        background-color: #FFF0D0;
        align-items: center;
      }

      & h1 {
        font-weight: lighter;
        width: 100%;
        margin: 0;
        padding: .5rem 0;
        font-size: 1.2rem;
        letter-spacing: .3rem;
        text-align: center;
        cursor: pointer;
      }

      &>span {
        margin: auto;
      }

      * {
        word-break: keep-all;
      }

    `}>
      <Link href="/"><h1>CookyStash</h1></Link>
      <Link href="/favs">お気に入り</Link>
    </header>
  )
}
