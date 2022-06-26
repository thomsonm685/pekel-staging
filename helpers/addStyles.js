




import { Button } from '@shopify/polaris';
import CSSParser from './cssParser';



// function PublishForm (props) {

    const AddStyles = async (token, storeUrl) => {


        // let theStyles = document.querySelector("#mainStyles").innerText;
        let theStyles = document.querySelector("#storeFrame").contentDocument.querySelector("#mainStyles").innerText;


        // parsing and sliming down the css styles before sending them
        // function slimStyles(styles)
        // {
        //     // get style and selector, e.g: [style, selector, style, selector, ...]
        //     // styles = styles.replace(/{|}/g, match => `${match}>#<` );           
        //     // let theStylesArray = styles.split('>#<'); 
        //     // console.log('theStylesArray:', theStylesArray);

        //     // go through array by the selectors, and if theres a selector ahead of it, delete it and it's styles
        //     // for(let i=0; i < theStylesArray.length; i+=2)
        //     // {
        //     //     console.log('theStyle:', theStylesArray[i]);
        //     //     theStylesArray.slice(i+1).includes(theStylesArray[i]) ? theStylesArray.splice(i,2) : '' ;
        //     // }

        //     // !_!_!_!__!_!_

        //     // let skip = false;

        //     // theStylesArray = theStylesArray.reduce((styleArray, style, i) => {
        //     //     console.log('theStyle:', style);
        //     //     // if is odd (a style, not selector), return
        //     //     if(i % 2 === 1 && skip !== true)
        //     //     {
        //     //         console.log('automatically adding style')
        //     //         styleArray.push(style);
        //     //         return styleArray;
        //     //     }  
        //     //     // if the style is not included later, return it 
        //     //     else if(theStylesArray.slice(i+1).includes(style) !== true && skip !== true)
        //     //     {
        //     //         console.log('adding selector')
        //     //         styleArray.push(style);
        //     //         return styleArray;
        //     //     }
        //     //     console.log('skipping')
        //     //     skip = !skip;
        //     //     return styleArray;
        //     // }, []);

        //     // __!!!!_!_!__!_!_!__!_!
        //     // styles.replace('}', '}>#<' );       // DOES THAT ONLY REPLACE FIRST???    
        //     // let newStylesArray = newStyles.split('>#<'); 

        //     // theStylesArray = theStylesArray.reduce((styleArray, style, i) => {
        //     //     theStylesArray.slice(i+1).forEach(newStyle => {
        //     //         style = CSSParser(style, newStyle);
        //     //     });
        //     //     styleArray.push(style);
        //     //     return styleArray;
        //     // }, []);
          
        //     // console.log('theStylesArray:', theStylesArray);
        //     // return theStylesArray.join('')
        //     // let theStylesArray = '}' + styles; // Making sure we dont split off the first style 
        //     let theStylesArray = styles.replace(/}/g, '}>#<' ).split('>#<').filter(style => style.match(/{/g) !== null); // seperate into array of styles, and delete empty ones
        //     // let theStylesArray = styles.replace(/}/g, '}>#<' ).split('>#<').filter(style => style !== ""); // splitting into styles     
        
        //     theStylesArray.forEach(style => { // for each style, parse with the rest of the styles to the right
        //         // console.log('style:', style);
        //         // console.log('theStyles:', styles);
        //         styles = styles.replace(style, '');
        //         // styles = CSSParser(style, styles);
        //         styles.includes('{') ? styles = CSSParser(style, styles) : styles = style;
        //         // console.log('parsed styles:', styles);
        //     });

        //     return styles;

        // }
            // // get style and selector, e.g: [style, selector, style, selector, ...]
            // styles.replace('/{|}/g', match => `${match}>#<` );           
            // let theStylesArray = styles.split('>#<'); 
            // // go through array by the selectors, and if theres a selector ahead of it, delete it and it's styles
            // for(let i=0; i < theStylesArray.length; i+2)
            // {
            //     let style= theStylesArray[i];

            //     let matches = 0;
            //     for(let i = 0; i < theStylesArray.length; ++i){
            //         if(theStylesArray[i] == style) count++;
            //     } 
            //     count > 1 ? theStylesArray.splice(i,2) : '' ;
            // }
            // return theStylesArray.join('')
        // theStyles = slimStyles(theStyles);

        // adding styles to the demo style element, so they persist without a reload
        document.querySelector("#storeFrame").contentDocument.querySelector("#demoStyles").innerText += theStyles;
        document.querySelector("#storeFrame").contentDocument.querySelector("#mainStyles").innerText = "";

        // getting url for styles, style name, and style application
        let styleApplication;
        if(document.querySelectorAll(".Polaris-RadioButton__Input").length === 2){
            if(document.querySelectorAll(".Polaris-RadioButton__Input")[0].checked === true){
                styleApplication = 'pageSpecific'
            }
            else if(document.querySelectorAll(".Polaris-RadioButton__Input")[1].checked === true){
                styleApplication = 'siteWide'
            }
        } 
        else{
            if(document.querySelectorAll(".Polaris-RadioButton__Input")[0].checked === true){
                styleApplication = 'pageSpecific'
            }
            else if(document.querySelectorAll(".Polaris-RadioButton__Input")[1].checked === true){
                styleApplication = 'multiPage'
            }
            else if(document.querySelectorAll(".Polaris-RadioButton__Input")[2].checked === true){
                styleApplication = 'siteWide'
            }
        }

        // let selectURL = document.querySelectorAll(".Polaris-Select__Input")[0].value; // PROBLEM???
        // let pasteURL = document.querySelectorAll(".Polaris-TextField__Input")[0].value;
        // let styleURL = pasteURL === "" ? selectURL : pasteURL;
        let styleURL = storeUrl.match('http')?storeUrl:'https://'+storeUrl;

        console.log("styleURL", styleURL)
        if(styleApplication === 'siteWide') styleURL = 'http';
        else if(styleApplication === 'multiPage') styleURL = styleURL.match(/\/products\/|\/collections\//g)[0];

        let styleName = document.querySelectorAll(".Polaris-TextField__Input")[1].value;

        await fetch(`/?shop=${process.env.NEXT_PUBLIC_SHOP}` , {
        method: "POST",
        body: JSON.stringify({
            styleApplication: styleApplication,
            styleURL: styleURL,
            theStyles: theStyles,
            styleName: styleName
        }),
        headers:{
            authorization: token
        }
        // body: JSON.stringify({   
        //   "asset": {
        //   "key": "snippets/easy_edits.css.liquid",
        //   "value": `${theStyles}`
        //   } 
        // })
        })
        .then(async response => {
            return await response.text();
            // res.json(parsedBody);
        })
        .catch( err => {
            return console.log(err);
            // res.json(err);
        });
        
        // props.close();
        }

//     return(
//           <Button onClick={addStyles}>Publish</Button>
//     )
// }



// export default PublishForm
export default AddStyles





