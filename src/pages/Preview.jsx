

export const getServerSideProps = async (ctx) => {
    const {shop,theUrl,styles} =  ctx.query
    console.log('querys from server side:', theUrl);
//   const body = await parseBody(context.req, '1mb');
//   console.log('body html from serverside props:', body);
  return {props: {}};
  //...
}

const Preview = () => {


    const loadStoreHTML = async (theURL) => {
    
        const sessionToken = await getSessionToken(app);
        // fetch(`/api/store?storeUrl=${theURL}`, { redirect: "error" })
        fetch(`/get_page?storeUrl=${theURL}&store=${shopName}`,{headers:{authorization:sessionToken}})
          .then(async (response) => {
            try
            {
              // making spinner go
              setStoreLoaded(false);
    
              // parse to text/plainHTML
              plainSiteHTML = await response.text()
              setTheHTMl(plainSiteHTML);
              // removing any html/iframe from where our new store HTML goes
              document.querySelector('#storeFrameContainer').innerHTML = '';
    
              // creating new iframe for our store HTML and adding it to the srcdoc attribute
              let iframe = document.createElement("iframe");
              iframe.srcdoc = plainSiteHTML;
              iframe.setAttribute('id', 'storeFrame');
    
              // Hooking Up Functionality To Actually Make And Store CSS Changes
              iframe.addEventListener('load', () => {
                try{
                  // removing the scroll bar
                  // document.querySelector("#storeFrame").contentDocument.querySelector("html").style.overflow = 'hidden';
    
                  // The demo <style> element that holds the css after publishing (needs to be in iframe to have an effect)
                  let demoStyles = document.createElement("style");
                  demoStyles.setAttribute('id', 'demoStyles');
                  document.querySelector("#storeFrame").contentDocument.querySelector("html").appendChild(demoStyles);
    
                  // The <style> element that holds the css (needs to be in iframe to have an effect)
                  let styleElement = document.createElement("style");
                  styleElement.setAttribute('id', 'mainStyles');
                  document.querySelector("#storeFrame").contentDocument.querySelector("html").appendChild(styleElement);
    
                  // Adding any styles to actual iframe
                  let othersStyles = document.createElement("style");
                  // othersStyles.innerText = `html:hover{ cursor: pointer !important} html::-webkit-scrollbar-track{border-radius: 2px;} html::-webkit-scrollbar{width: 5px;background-color: #F7F7F7;} html::-webkit-scrollbar-thumb{border-radius: 10px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);box-shadow: inset 0 0 6px rgba(0,0,0,.3);background-color: #BFBFBF;}.draggingCursor:hover{cursor: move !important;}`
                  othersStyles.innerText = `.draggingCursor:hover{cursor: move !important} html:hover{ cursor: pointer !important}  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);box-shadow: inset 0 0 6px rgba(0,0,0,.3);background-color: #BFBFBF;} `
                  document.querySelector("#storeFrame").contentDocument.querySelector("html").appendChild(othersStyles);
    
                  // The editor functionality
                  editorJS(firstLoad);
                }
                catch(err) // if the page blocks the request or iframe, let the user know
                {
                  console.log('Error Getting Store Frame:', err)
                  // setStoreLoaded(null);
                  // document.querySelector('#storeFrameContainer').innerHTML = '';
                }
              });
    
              // adding the iframe with the new stores HTML to the actual app
              document.querySelector("#storeFrameContainer").appendChild(iframe);         
              setFirstLoad(false);
              setStoreLoaded(true);
              setStoreURL(theURL);
            } 
            catch(err) // if the page blocks the request or iframe, let the user know
            {
              console.log('Error Getting Store Frame:', err)
              // setStoreLoaded(null);
              // document.querySelector('#storeFrameContainer').innerHTML = '';
            }
          })
          .catch((error) => {
            console.log('Error Getting Store Frame:', error)
            // setStoreLoaded(null);
            // document.querySelector('#storeFrameContainer').innerHTML = '';
          });
      }

    return(
        <h1>HII</h1>
    )
}

export default Preview;