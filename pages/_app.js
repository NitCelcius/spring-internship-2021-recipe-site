import './App.css';

export default function DefaultStyles({ Component, pageProps} ) {
  return <Component {
    ...pageProps
  }
  />
};