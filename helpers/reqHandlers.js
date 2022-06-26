

import DBConnection from "./dbConnection";


export const getStore = async (theUrl, demo=false) => {
  
    // const theURL = await req.query.storeUrl;
    
    var myHeaders = new Headers();
    demo ?
      myHeaders.append("cookie", "storefront_digest=5663649a3a937f78a0f8dbef102ac1057169627a0f375f6e4d84345f95fb8f7e")
    : '';
      // myHeaders.append("cookie", "storefront_digest=ae163fc6b944e490a394cab4d30b84290f1b5bd922a858225c54434dd2d6ec33");
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    let theSiteHTML =  await fetch(theUrl, requestOptions)
    .then((plainSiteHTML) => {
      console.log('plainSiteHTML.url:', plainSiteHTML.url);
      if(plainSiteHTML.url.match(/(\/password)$/)){
        return plainSiteHTML = false;
      }
      return plainSiteHTML
    })
    .catch(error => {console.log('error in server for store frame req:', error)});
  
    if(!theSiteHTML) return false;
    // console.log('the site html from server, before .text():', theSiteHTML);
    let finalUrl = theSiteHTML.url
  
    theSiteHTML = await theSiteHTML.text();
  
    // console.log('the site html from server:', theSiteHTML);
  
    // res.send(theSiteHTML);
    // return theSiteHTML;

    return {theUrl: finalUrl,theHtml:theSiteHTML};

  }

  // export const getDemoStore = async (theUrl, demo=false) => {
  
  //   // const theURL = await req.query.storeUrl;
    
  //   var myHeaders = new Headers();

  //   myHeaders.append("cookie", "storefront_digest=ae163fc6b944e490a394cab4d30b84290f1b5bd922a858225c54434dd2d6ec33");

  //   var requestOptions = {
  //     method: 'GET',
  //     headers: myHeaders,
  //     redirect: 'follow'
  //   };
  
  //   let theSiteHTML =  await fetch(theUrl, requestOptions)
  //   .then((plainSiteHTML) => {
  //     return plainSiteHTML
  //   })
  //   .catch(error => {console.log('error in server for store frame req:', error)});
  
  //   // console.log('the site html from server, before .text():', theSiteHTML);
  //   let finalUrl = theSiteHTML.url
  
  //   theSiteHTML = await theSiteHTML.text();
  
  //   // console.log('the site html from server:', theSiteHTML);
  
  //   // res.send(theSiteHTML);
  //   // return theSiteHTML;

  //   return {theUrl: finalUrl,theHtml:theSiteHTML};

  // }

  export const getDemoStore = async (theUrl) => {
  
    // const theURL = await req.query.storeUrl;
    
    var myHeaders = new Headers();
    myHeaders.append("cookie", "storefront_digest=5663649a3a937f78a0f8dbef102ac1057169627a0f375f6e4d84345f95fb8f7e");
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    let theSiteHTML =  await fetch(theUrl, requestOptions)
    .then((plainSiteHTML) => {return plainSiteHTML})
    .catch(error => {console.log('error in server for store frame req:', error)});
  
    // console.log('the site html from server, before .text():', theSiteHTML);
  
    theSiteHTML = await theSiteHTML.text();
  
    // console.log('the site html from server:', theSiteHTML);
  
    // res.send(theSiteHTML);
    return theSiteHTML;
  }  

export const editsFromDB = async () => {
  let StoreData = await DBConnection.GetShop();
  console.log('StoreData obj:', StoreData);

  if(StoreData.edits.length === 0) return { noData: true }

  let styleSheets = StoreData.edits;
  let inactiveEdits = StoreData.inactiveEdits;

  return({
      styleSheets: styleSheets, 
      inactiveEdits: inactiveEdits, 
      storeData: StoreData // will be passed to the page component as props
    });
}

// function to build css styles needed for shop and url
export const getAndParseEdits = async (shop,url) => {
  // get shop (edits) and define the string we're going to parse the styles into
  let StoreData = await DBConnection.GetShop(shop);
  let editsString = '';

  // function to get first style obj that has url as value
  const getFirstStyle = (url) => {
    let edit;
    for(i=0;i<StoreData.edits.length;i++){
      if(StoreData.edits[i].url===url) return edit = StoreData.edits[i];
      if(i++===StoreData.length) return edit = '';
      return
    }
    return edit;
  }

  // getting edits for each url (site-widw,multi-page,page-specific)
  if(!StoreData.inactiveEdits.includes('http')){
    editsString += getFirstStyle('http');
  }
  if(!StoreData.inactiveEdits.includes('/collections/') && url.includes('/collections/')){
    editsString += getFirstStyle('/collections/');
  }
  if(!StoreData.inactiveEdits.includes('/products/') && url.includes('/products/')){
    editsString += getFirstStyle('/products/');
  }
  if(!StoreData.inactiveEdits.includes(url)){
    editsString += getFirstStyle(url);
  }

  return editsString;
}


// JUST WROTE FUNCTION ABOVE, BUT NOW NEED TO REMOVE CANNONICAL URL LOGIC FROM PARSER.
// ALSO, NEED TO ADD TO FUCTION ABOVE SO IT PULLS FROM ALL OLD EDITS AND PARSES INTO NEWEST FORM
// BASICALLY WHAT THE CSS PARSER DOES MINUS THE CANNONICAL URL STUFF.
// EITHER RUN NEW PARSER AT EACH REQ, OR STORE LARGE STRING FROM THE RESULT OF RUNNING UPON 
// SUBMITTING THE EDIT?