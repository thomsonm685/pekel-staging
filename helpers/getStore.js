




const GetStore = (url) => {
    // const assetAPI = await fetch("https://" + process.env.NEXT_PUBLIC_SHOP+ "/admin/api/2021-01/themes/119273160889/assets.json", {
  //   method: "PUT",
  //   json: true,
  //   headers: {
  //       "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,//ctx.state.shopify,
  //       "Content-Type": "application/json"
  //     },
  //   body: JSON.stringify({   
  //     "asset": {
  //     "key": "snippets/easy_edits.css.liquid",
  //     "value": "ATTEMPT NUMBER 4546512134132"
  //     } 
  //   })
  // })

  // .then(response => {
  //     return response.text();
  //     // res.json(parsedBody);
  // })
  // .catch( err => {
  //     return err;
  //     // res.json(err);



  // THIS WORKS FOR NOW, BUT WE NEED THE POST REQUEST BELOW TO GET THE 'storefront_digest' COOKIE AND PASS IT TO THIS GET REQ
  // var formdata = new FormData();
  // formdata.append("password", "1");
  
  // var requestOptions = {
  //   method: 'POST',
  //   body: formdata,
  //   redirect: 'follow'
  // };
  
  // await fetch("https://michael-t-dev.myshopify/password", requestOptions)
  //   .then((response) => {console.log(response.body)})
  //   .catch(error => console.log('error', error));

 
  var myHeaders = new Headers();
  myHeaders.append("cookie", "storefront_digest=ae163fc6b944e490a394cab4d30b84290f1b5bd922a858225c54434dd2d6ec33");
  
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'error'
  };

  return plainSiteHTML = await fetch(url, requestOptions)
  .then((plainSiteHTML) => {return plainSiteHTML.text()})
  .catch(error => {console.log('error', error)});

}