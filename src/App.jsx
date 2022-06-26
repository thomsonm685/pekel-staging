import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import { Layout } from "./components/Layout";
import { useState, useEffect } from "react";

export default function App() {
  console.log('here 3');


  const [shopData, setShopData] = useState(null);
  const [reloadShop, triggerReloadShop] = useState(false);


  useEffect(() => {
    const shop = new URLSearchParams(window.location.search).get("shop");
    fetch(`/shop?shop=${shop}`).then(shopRes=>{
      shopRes = shopRes.json().then(data=>{
        console.log('SHOP:', data);
        setShopData(data);
      })
    });
  },[reloadShop]);

  return (
    <PolarisProvider i18n={translations}>
          <Layout shop={shopData} triggerReloadShop={triggerReloadShop} />
    </PolarisProvider>
  );
}

function MyProvider({ children }) {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
