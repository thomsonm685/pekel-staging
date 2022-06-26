


import DBConnection from '../helpers/dbConnection';
import ShopifyApi from './shopifyApi';



import CSSParser from './cssParser'

let PublishToTheme = {};

PublishToTheme.New = async function (theReq, shop) {
  theReq = await JSON.parse(theReq);

    var myHeaders = new Headers();
    myHeaders.append("X-Shopify-Access-Token", process.env.SHOPIFY_ACCESS_TOKEN);
    // myHeaders.append("cookie", "storefront_digest=ae163fc6b944e490a394cab4d30b84290f1b5bd922a858225c54434dd2d6ec33");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    const accessToken = await DBConnection.GetToken();
    ShopifyApi.AddSnippet(accessToken); // adding easy-edits.css.liquid into theme.liquid

    let oldStyles = await ShopifyApi.GetEdits();

    console.log("Old Styles!:", oldStyles);

    // getting actualy style string
    // oldStyles = oldStyles === undefined ? null : oldStyles;
    if(oldStyles === undefined) oldStyles=null;

    const {finalStyles, databaseStyles} = CSSParser(oldStyles, theReq.theStyles, theReq.styleURL, theReq.styleApplication);



    console.log('finalStyles in publishToTheme:',finalStyles)

    let storeData = await DBConnection.GetShop();

    // if the edits are inactive, only add them to the database and not the actual store css file
    if(storeData === null || storeData.inactiveEdits.includes(theReq.styleURL) === false){

      await ShopifyApi.ReplaceEdits(finalStyles)
        .then(async response => {
          console.log("Changes Have Been Published!", response);
          DBConnection.AddToDB(/*themeId, themeName,*/ theReq.styleName, databaseStyles, theReq.styleApplication, theReq.styleURL);
        })
        .catch( err => {
          return console.log(err);
          // res.json(err);
        });
    } 
    else
    {
      DBConnection.AddToDB(/*themeId, themeName,*/ theReq.styleName, databaseStyles, theReq.styleApplication, theReq.styleURL);
    }
}


// what .Modify handles:
// * reverting to old edits
//    - if the edit url is inactive, it adds as new style to DB, but not to easy-edits file
//    - else if the edit url is active, we replace all url specific code in easy-edits file, and add as new style to DB
// * deactivating all edits under that url
//    - removes all url specific code in easy-edits file, then adds the inactive url to DB
// * activating all edits under that url
//    - adds last edit back into code, in right position, then removes inactive url from DB

PublishToTheme.Modify = async (theReq,shop) => { 

  theReq = await JSON.parse(theReq);

  let oldEdits = await ShopifyApi.GetEdits(); // getting the easy-edits file
  let newEdits;

  console.log('oldEdits', oldEdits);

  let togglingTo = theReq.togglingEdits; // toggling, "on", "off", or not at all (null)

  let storeData = await DBConnection.GetShop(); // getting total store data from the DB

  let theEdit = storeData.edits.filter((edit) => edit._id === theReq.styleID)[0]; // getting the the edit we're toggling or reverting to, by ID

  let inactiveUrls = storeData.inactiveEdits; // get the inactive edit urls array

  console.log('inactive edits', inactiveUrls);

  let liquidUrL = theEdit.style.match(/({%-)(.*?)(-%})/)[0];  // getting liquid & url from new edit, 
  let liquidUrlReg = new RegExp (`(${liquidUrL})(.*?)(-%})`); // then the regex to match the old edit

  if(togglingTo === null) // for reverting styles:
  {
    newEdits = oldEdits.replace(liquidUrlReg, theEdit.style) // the new edits we'll add to the easy-edits file
    DBConnection.AddToDB(theReq.styleName, newEdits, theEdit.application, theEdit.url); // adding style to DB; 
    if(inactiveUrls.includes(theEdit.url) === false) await ShopifyApi.ReplaceEdits(newEdits); // if edits are inactive, only add to DB
    return console.log('edits have been reverted!')                                                
  }
  else if(togglingTo === "off")  // for turning edits off:
  { 
    newEdits = oldEdits.replace(liquidUrlReg, "") 
    await ShopifyApi.ReplaceEdits(newEdits);  // Adding new edits
    DBConnection.UpdateInactiveUrls(theEdit.url, togglingTo, inactiveUrls)  // Adding new inactive url
  }
  else if (togglingTo === "on")   // for turning edits back on: 
  { 
    // getting the last edit to add 
    let lastEdit = storeData.edits.filter((edit) => edit.url === theEdit.url);
    lastEdit = lastEdit[lastEdit.length - 1];
    // sorting edits so we can put our new edit in the right place
    let sortedUrlArray = [];
    // newEdits = oldEdits + theEdit.style;
    newEdits = oldEdits + lastEdit;
    for(let i=0; i<3; i++){
        sortedUrlArray.push(
            newEdits.match(/({%-)(.*?)(endif -%})/g).reduce((newArray, currentStyle) => {
                if(i===0){
                  if(currentStyle.match(/"(.*?)"/)[0] === "\"http\"") newArray.push(currentStyle); // if it's site wide
                }
                if(i===1){
                  if(currentStyle.match(/"(.*?)"/)[0][1] === "/") newArray.push(currentStyle); // if it's multi page
                }
                if(i===2){
                  if(currentStyle.match(/"(.*?)"/)[0].includes('.')) newArray.push(currentStyle); // if it's page specific
                }
                return newArray;
            }, []).join('')
        )
    }
    newEdits = sortedUrlArray.join('');
    await ShopifyApi.ReplaceEdits(newEdits);  // Adding the new edits
    DBConnection.UpdateInactiveUrls(theEdit.url, togglingTo, inactiveUrls)  // Removing old inactive url
  }
}  
 

  export default PublishToTheme


