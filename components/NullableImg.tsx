// N U L L A B L E (what?)
// Specify URI and alt. If src is not specified, returns fake div.
export function NullableImg(src: string | null, alt: string) {
  if (src) {
    return <img className="MealImg" src={src} alt={alt}></img>
  } else {
    return <div className="MealImg"><p>NO IMAGE</p></div>
  }
}