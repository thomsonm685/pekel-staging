




import { Button } from '@shopify/polaris';
import CSSParser from './cssParser';



// function PublishForm (props) {

const AddStyles = async () => {


    let theStyles = document.querySelector("#storeFrame").contentDocument.querySelector("#mainStyles").innerText;

    document.querySelector("#storeFrame").contentDocument.querySelector("#demoStyles").innerText += theStyles;
    document.querySelector("#storeFrame").contentDocument.querySelector("#mainStyles").innerText = "";

    // getting url for styles, style name, and style application
    let styleApplication;

    styleApplication = 'pageSpecific'

    let styleURL = "https://easy-edits-demo.myshopify.com/"

    let stylesData = {
        styleApplication: styleApplication,
        styleURL: styleURL,
        theStyles: theStyles
    }

    // let oldStyles = window.sessionStorage.getItem('easyEdits')

    let oldStyles = null;

    console.log("Old Styles!:", oldStyles);

    const {finalStyles} = CSSParser(oldStyles, stylesData.theStyles, stylesData.styleURL, stylesData.styleApplication);

    console.log('finalStyles:',finalStyles)

    // window.sessionStorage.setItem('easyEdits', finalStyles);

    top.postMessage(finalStyles,'https://easy-edits-demo.myshopify.com/pages/editor');


    // let storeData = await DBConnection.GetShop();

    // // if the edits are inactive, only add them to the database and not the actual store css file
    // if(storeData === null || storeData.inactiveEdits.includes(stylesData.styleURL) === false){

    // await ShopifyApi.ReplaceEdits(finalStyles)
    //     .then(async response => {
    //     console.log("Changes Have Been Published!", response);
    //     DBConnection.AddToDB(/*themeId, themeName,*/ stylesData.styleName, databaseStyles, stylesData.styleApplication, stylesData.styleURL);
    //     })
    //     .catch( err => {
    //     return console.log(err);
    //     // res.json(err);
    //     });
    // } 
    // else
    // {
    // DBConnection.AddToDB(/*themeId, themeName,*/ stylesData.styleName, databaseStyles, stylesData.styleApplication, stylesData.styleURL);
    // }

        
}


export default AddStyles





