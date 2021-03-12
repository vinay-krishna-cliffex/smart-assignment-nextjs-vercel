import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Provider } from "react-redux";
import "react-alice-carousel/lib/alice-carousel.css";
import "react-multi-email/style.css";
import store from "../store/Store";
import "leaflet/dist/leaflet.css";
import "react-image-lightbox/style.css";
import "../scss/style.default.scss";
import "../style/custom.css";

const App = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
};
export default App;
