import './App.css';

export default function DefaultStyles({ Component, PageProps }) {
  return <Component {
    ...PageProps
  }
  />
};