import {
    Page,
    Stack
  } from "@shopify/polaris";
  
  import  Demo  from "../pages/Demo";
  import  Home  from "../pages/Home";
  import  Faq  from "../pages/Faq";
  import  Manage  from "../pages/Manage";
  import  Preview  from "../pages/Preview";
  import  Privacy  from "../pages/Privacy";

  import { useState } from "react";


  
  
  export function Layout({shop, triggerReloadShop}) {


    console.log('shop:', shop);

    const [currentPage, switchPage] = useState('home');

    return (
      <Page fullWidth>
            <Stack>
              <Stack.Item>
                {/* <SideNav switchPage={switchPage} /> */}
              </Stack.Item>
              <Stack vertical>
                {currentPage==="home"?
                <Home shop={shop} triggerReloadShop={triggerReloadShop} />
                :currentPage==="faq"?
                <Faq shop={shop} triggerReloadShop={triggerReloadShop} />
                :currentPage==="manage"?
                <Manage shop={shop} triggerReloadShop={triggerReloadShop} />
                :''
                }
              </Stack>
            </Stack>
      </Page>
    );
  }
  