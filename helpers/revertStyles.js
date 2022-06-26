




import DBConnection from '../helpers/dbConnection';

import { Button } from '@shopify/polaris';




const RevertStyles = async (styleName, style_id, togglingEdits, token/*, style_application, style_url*/) => {


    // let styleName = document.querySelector(".Polaris-TextField__Input").value;

    // let style_id = e.target.paret


    // let theStyle = await DBConnection.GetByID(style_id);

    // console.log("The Style:", theStyle);
    // theStyle = JSON.stringify(theStyle);

    await fetch("/revert" , {
        method: "POST",
        body: JSON.stringify({
            // reverting: true,
            styleID: style_id,
            // theStyles: theStyle.style,
            styleName: styleName,
            togglingEdits: togglingEdits
            // styleApplication: style_application,
            // styleUrl: style_url
        }),
        headers:{
            authorization: token
        }
        })
        .then(response => {
            // return console.log("Error in revertStyles.js", response.text());
            // res.json(parsedBody);
            return response;
        })
        .catch( err => {
            return console.log("Error in revertStyles.js", err);
            // res.json(err);
        });
}




// export default PublishForm
export default RevertStyles