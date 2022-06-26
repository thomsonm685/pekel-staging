// import { response } from "express";


import { access } from "fs";
import DBConnection from "./dbConnection";

const ShopifyApi = {};


// Function to get edits from easy-edits.css.liquid file, in shop theme files
ShopifyApi.GetEdits = async () => {

    const accessToken = await DBConnection.GetToken();

    let themeId = await ShopifyApi.ThemeId() // getting current theme ID

    var myHeaders = new Headers();
    myHeaders.append("X-Shopify-Access-Token", accessToken);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let Edits = await fetch(`https://${process.env.NEXT_PUBLIC_SHOP}/admin/themes/${themeId}/assets.json?asset[key]=snippets/easy_edits.css.liquid`, requestOptions)
      .then(async (response) => {
        response = await response.json();
        return response.asset.value;
      })
      .catch(error => console.log('error fetching old styles:', error));

    return Edits
}

// Function to replace edits in easy-edits.css.liquid file, in shop theme files
ShopifyApi.ReplaceEdits = async (newEdits) => {

  console.log('new edits from shopify api:', newEdits);

  const accessToken = await DBConnection.GetToken();

  ShopifyApi.AddSnippet(accessToken); // adding easy-edits.css.liquid into theme.liquid

  let themeId = await ShopifyApi.ThemeId(accessToken) // getting current theme ID

  const edits = await fetch(`https://${process.env.NEXT_PUBLIC_SHOP}/admin/api/2021-01/themes/${themeId}/assets.json`, {
      method: "PUT",
      json: true,
      headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json"
        },
      body: JSON.stringify({   
        "asset": {
        "key": "snippets/easy_edits.css.liquid",
        "value": `${newEdits}`
        } 
      })
    })
    .then(async response => {
          console.log("Changes Have Been Published:", response);
          return response;
      })
      .catch( err => {
          return console.log("error in ShopifyApi.ReplacingEdits", err);
      }); 
    return edits;  
}

// Function to add snippet to theme.liquid file, for easy-edits.css.liquid
ShopifyApi.AddSnippet = async (accessToken) => {

  let themeId = await ShopifyApi.ThemeId(accessToken) // getting current theme ID

  // creating request to get theme.liquid file
  var myHeaders = new Headers();
  myHeaders.append("X-Shopify-Access-Token", accessToken);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  // getting theme.liquid file
  let themeFile = await fetch(`https://${process.env.NEXT_PUBLIC_SHOP}/admin/themes/${themeId}/assets.json?asset[key]=layout/theme.liquid`, requestOptions)
    .then(async (response) => {
      response = await response.json();
      return response.asset.value;
    })
    .catch(error => console.log('error fetching theme.liquid to add snippet:', error));
  //if snippet is already in place, stop
  if(themeFile.match("<style>{%- include 'easy_edits.css.liquid' -%}</style>") !== null) return console.log("Snippet already in theme.liquid!")
  // insert snippet and style tags just before closing body tag
  let newThemeFile = themeFile.replace(/(| )<\/body>(|)/, bodyTag => {
    return "<style>{%- include 'easy_edits.css.liquid' -%}</style>" + "\n" + bodyTag
  })
  // upload new theme.liquid file back to shop files
  await fetch(`https://${process.env.NEXT_PUBLIC_SHOP}/admin/api/2021-10/themes/${themeId}/assets.json`, {
      method: "PUT",
      json: true,
      headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json"
        },
      body: JSON.stringify({   
        "asset": {
        "key": "layout/theme.liquid",
        "value": newThemeFile
        } 
      })
    })
    .then(async response => {
          console.log("Easy Edits Snippet Has Been Added:", response);
      })
      .catch( err => {
          return console.log("Error Adding Easy-Edits Snippet To Theme.Liquid:", err);
      });
}

// Function to get Theme API GET response
ShopifyApi.ThemeId = async (accessToken=null) => {

  accessToken===null?accessToken = await DBConnection.GetToken():'';
  console.log('accessToken:', accessToken)
  // creating request to Theme API
  var myHeaders = new Headers();
  myHeaders.append("X-Shopify-Access-Token", accessToken);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  // getting theme API res
  console.log('THE NEW SHOP:', process.env.NEXT_PUBLIC_SHOP )
  let themeId = await fetch("https://"+ process.env.NEXT_PUBLIC_SHOP +"/admin/api/2021-10/themes.json", requestOptions)
    .then(async (response) => {
      response = await response.json();
      console.log('THE NEW RES:', response)
      // filtering for the main theme ID
      return response.themes.filter(theme => theme.role === 'main')[0].id; 
    })
    .catch(error => console.log('error getting themes from theme API:', error));

    console.log('theme ID:', themeId);

  return themeId
}


export default ShopifyApi