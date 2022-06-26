


import DBConnection from '../../helpers/dbConnection';
import StylesManager from '../components/StylesManager';
import { Page, Heading, Spinner} from '@shopify/polaris';
// import Image from 'next/image';
import Nav from '../components/Nav'
import { useEffect, useState } from 'react';
import SkelePage from '../components/Skele';
import { getSessionToken } from '@shopify/app-bridge-utils';


// export async function getServerSideProps() {
    
//     let StoreData = await DBConnection.GetShop();

//     if(StoreData.edits.length === 0) return { props: {noData: true }}

//     let styleSheets = StoreData.edits;
//     let inactiveEdits = StoreData.inactiveEdits;

//     return {
//       props: {styleSheets: JSON.stringify(styleSheets), inactiveEdits: JSON.stringify(inactiveEdits), storeData: JSON.stringify(StoreData)}, // will be passed to the page component as props
//     }
// }
export async function getServerSideProps() {
    return {props: {shopName: process.env.NEXT_PUBLIC_SHOP/*, shopInfo: shopInfo*/}}
}


const Manage = ( {app,shopName} ) => {


    const [loading, setLoading] = useState(false);
    const [reload, newReload] = useState(false);
    const [theEdits,setTheEdits] = useState(null)
    
    useEffect(()=>{
        const getEdits = async () => {

            const token = await getSessionToken(app); 
            let edits = await fetch(`/edits?shop=${shopName}`,{headers:{'authorization':token}});
            setTheEdits(await edits.json());

            // let StoreData = await DBConnection.GetShop();

            // if(StoreData.edits.length === 0) return { noData: true }
        
            // let styleSheets = StoreData.edits;
            // let inactiveEdits = StoreData.inactiveEdits;

            // console.log('edits obj:', edits);
            // setTheEdits({
            //     styleSheets: styleSheets, 
            //     inactiveEdits: inactiveEdits, 
            //     storeData: StoreData // will be passed to the page component as props
            //   });

            return;
        }
        getEdits();
    },[reload]);

    if(!theEdits) return (<SkelePage></SkelePage>)
    // If there's no edits yet...
    if(theEdits.noData) return(
        <>
        <Nav currentPage={1} setLoading={setLoading} app={app} shop={shopName}/>
        { loading ?
            <div style={{margin:"18% auto", width: "min-content"}}>
                < Spinner/>
            </div>
            :
            <Page>
                <div style={{margin:'10% auto',width:'max-content'}}>
                    {/* <div>
                        <Image src="/yourEditsHere.svg" alt="Your Edits Goes Here!" width="300" height="300" />
                    </div> */}
                    <Heading>(No Edits To Show... Make Some Changes!)</Heading>
                </div>
            </Page>
            }
        </>
    )

    // let newData = DBConnection.GetShop() // YOU WERE HERE!!! EITHER CREATE AN ENDPOINT OR FIGURE OUT HOW TO RELOAD
    //     .then(data => {
    //         return data
    //     })
    //     .catch( err => {
    //         console.log('er', err)
    //     })
    // console.log('newdata:', newData);


    // The style-data from the DB
    console.log("storeData:", theEdits.storeData);
    let {storeData,styleSheets,inactiveEdits} = theEdits;
    // let storeData = JSON.parse(props.storeData);
    // let styleSheetsArray = JSON.parse(props.styleSheets);
    // let inactiveEdits = JSON.parse(props.inactiveEdits);

    // Seprating into arrays with the same aplication
    styleSheets = styleSheets.reverse().reduce((acc, style) => {

            if(acc.length === 0){
                acc.push([style])
                return acc;
            }

            for(let i = 0; i < acc.length; i++){

                // if(acc[i][0].themeID === style.themeID){
                if(acc[i][0].application === style.application){
                    acc[i].push(style);
                    break
                }
                else if(i+1 >= acc.length){
                    acc.push([style]);
                }
            }
            return acc;
            //[[{shopName: 'asdasd', application: 'multiPage}, {shopName: 'asdasd', application: 'multiPage}], [{shopName: 'dsa', application: 'pageSpecific'}]]
    }, [])

    console.log('styleSheets', styleSheets);
    // Seprating into arrays with the same url
    styleSheets = styleSheets.map((appSortedArray) => {
    // [{url: 'asdasd', application: 'multiPage}, {url: 'asdasd', application: 'multiPage}]
        let urlSortedArray = appSortedArray.reduce((acc, style) => {
        // {url: 'asdasd', application: 'multiPage}

            if(acc.length === 0){
                acc.push([style])
                return acc;
            }
            //acc = [{url: 'asdasd', application: 'multiPage}, {url: 'asdasd', application: 'multiPage}]
            for(let i = 0; i < acc.length; i++){
                
                console.log('ACC', acc)
                // if(acc[i][0].themeID === style.themeID){
                if(acc[i][0].url === style.url){
                    acc[i].push(style);
                    break
                }
                else if(i+1 >= acc.length){
                    acc.push([style]);
                }
            }
            return acc;
            //[[{shopName: 'asdasd', application: 'multiPage}, {shopName: 'asdasd', application: 'multiPage}], [{shopName: 'dsa', application: 'pageSpecific'}]]
        }, [])
        console.log('urlSortedArray', urlSortedArray)
        return urlSortedArray
    })

    console.log('sorted hopefully:', styleSheets);

    

    //[ 'by application'[ 'by url' [{}, {}, {}], [{}, {},{}], 'by application'[[{}, {}, {}]], ] ]


    return(
        <>
            <Nav currentPage={1} setLoading={setLoading} app={app} shop={shopName}/>
            { loading ?
            <div style={{margin:"25% auto", width: "min-content"}}>
                < Spinner/>
            </div>
            : 
            <div className="managePageContainer">
                <Page>
                    <StylesManager reload={reload} newReload={newReload} styleSheetsArray={styleSheets} inactiveEdits={inactiveEdits} storeData={storeData} app={app}/>
                </Page>    
            </div>
            }
        </>
    )
}





export default Manage



// DID ALL OF THIS!
// data shows what page, pages, or whole site they edited 
// remove edit styles button, or just have one, and switch it for pause styles

// add data for application, i.e: 'application: site, page, multi_page'
// style url = 'www.shopname', or 'www.pagespecific.com' or '/products/'
// data = everything in the canicol url liquid tag
// when we revert, we find that canicol url & styles in it, and replace it with the data

// what about conflicting styles in diffrent tags? (arrange canicols by, 'site wide', 'multipage', then 'page specific'?) 

    // Whole Site Edits (Edits you applied to your entire site)
    // if canicol contains 'www.shopname'
    // just render everything with the 'application: site'
    
    // Multi-Page Edits (Edits you applied to multipe pages, such as product pages, collection pages, etc..)
    // if canicol contains '/products/'
    // turn into arrays with same url, then render those arrays on indivudal cards

    // Page Edits (Edits you applied to a single page)
    // if canicol contains 'www.pagespecific.com'// data = everything in that canicol url liquid tag
    // turn into arrays with same url, then render those arrays on indivudal cards

// On adding styles (data = in bewteen conical url)
// Apply edits site wide? (They'll be added to any elements that match, such as the header on each page)
    // just submit with contains 'http'
// and if url contains, 'collections', 'product', etc., we'll give them option to apply to like pages:
// Apply edits to all ___ pages? (They'll be added to all ___ pages, and overide any site wide styles)
    // just submit with '/theURLpiece/'
// Apply edits to this page? (They'll be added only to this one page, and overide any site/multi-page styles)
    // just submit url like I have been

// When we actually click publish, we'll do the same thing with updating the store css, but then only add the 
// canicol url specific styles to mongo as the style data, and not the whole thing.

// make reverting logic
    // when we revert, we find that canicol url & styles in it, and replace it with the data



// LAST THING!    
// make css parser or something organize styles 'sitewide', 'multi page', 'page specific' 






