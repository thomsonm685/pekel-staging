



import {Card, Tabs, Stack, TextContainer, Heading} from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { getSessionToken } from "@shopify/app-bridge-utils";
// import { useRouter } from 'next/router';

const Nav = ({currentPage, setLoading,app,shop, openTutorial, host}) => {

    // const router = useRouter()

    // const changePage = async (e, href) => {
    //     e.preventDefault();
    //     const sessionToken = await getSessionToken(app);
    //     router.push(`${href}?shop=${shop}&sessionToken=${sessionToken}&host=${host}`)
    // }


    // useEffect( () => {
    //     document.querySelectorAll(".linkDiv").forEach( linkDiv => {
    //         linkDiv.addEventListener("click", async (e) => {
    //             console.log('setting loading!');
    //         setLoading(true);
    //         }, {once: true})
    //     });
    // })

    return(
        <div className="mainNav">
            <Stack alignment="trailing">
                {/* <p data_url={currentPage === 0 ? "#" : "/"} > */}
                    <a onClick={(e)=>changePage(e,(currentPage === 0 ? "#" : "/"))}className="linkDiv">
                        <span style={{"display": "block", "width":"100%"}}>
                            <TextContainer>
                                <h2 className={currentPage === 0 ? "Polaris-Heading activePageLink" : "Polaris-Heading pageLink"}>Edit Store</h2>
                            </TextContainer>
                        </span>
                    </a>
                {/* </p> */}
                {/* <p data_url={currentPage === 1 ? "#" : "/manage"}> */}
                    <a onClick={(e)=>changePage(e,(currentPage === 1 ? "#" : "/manage"))}className="linkDiv">
                        <span style={{"display": "block", "width":"100%"}}>
                            <TextContainer>
                                <h2 className={currentPage === 1 ? "Polaris-Heading activePageLink" : "Polaris-Heading pageLink"}>Manage Edits</h2>
                            </TextContainer>
                        </span>
                    </a>
                {/* </p> */}
                {/* <p data_url={currentPage === 2 ? "#" : "/faq"}> */}
                    <a onClick={(e)=>changePage(e,(currentPage === 2 ? "#" : "/faq"))}className="linkDiv">
                        <span style={{"display": "block", "width":"100%"}}>
                            <TextContainer>
                                <h2 className={currentPage === 2 ? "Polaris-Heading activePageLink" : "Polaris-Heading pageLink"}>FAQ</h2>
                            </TextContainer>
                        </span>
                    </a>
                {/* </p> */}
                    <a onClick={(e)=>changePage(e,(currentPage === 3 ? "#" : "/settings"))}className="linkDiv">
                        <span style={{"display": "block", "width":"100%"}}>
                            <TextContainer>
                                <h2 className={currentPage === 0 ? "Polaris-Heading activePageLink" : "Polaris-Heading pageLink"}>Settings</h2>
                            </TextContainer>
                        </span>
                    </a>
            </Stack>

            {currentPage === 0?
            <TextContainer>
                <h2 onClick={openTutorial} id="tutorialBtn" className="myColorLink Polaris-Button Polaris-Button--plain Polaris-Button__Text" style={{marginRight:'15vw'}}>Tutorial</h2>
            </TextContainer>
            :''}
        </div>
    )


}



// import Link from 'next/link'
// import {Card, Tabs, Stack, TextContainer, Heading} from '@shopify/polaris';
// import { useState, useCallback, useEffect } from 'react';
// import link from 'next/link';
// import { getSessionToken } from "@shopify/app-bridge-utils";
// import { useRouter } from 'next/router'

// const Nav = ({currentPage, setLoading,app}) => {
    

//     useEffect( () => {
//         document.querySelectorAll(".linkDiv").forEach(linkDiv => {
//             linkDiv.addEventListener("click", async (e) => {
//                 // const theLinkElm = e.currentTarget;
//                 // console.log('theLinkElm:',theLinkElm);
//                 // const sessionToken = await getSessionToken(app);
//                 // console.log(sessionToken);
//                 // theLinkElm.setAttribute('href', `${theLinkElm.getAttribute('href')}?sessionToken=${sessionToken}`) 
//                 setLoading(true);
//             }, {once: true})
//         });
//     })

//     return(
//         <div className="mainNav">
//             <Stack>
//                 <Link href={currentPage === 0 ? "#" : "/"} >
//                     <div className="linkDiv" style={{marginLeft:"1rem"}}>
//                         <span style={{"display": "block", "width":"100%"}}>
//                             <TextContainer>
//                                 <h2 className={currentPage === 0 ? "Polaris-Heading activePageLink" : "Polaris-Heading pageLink"}>Edit Store</h2>
//                             </TextContainer>
//                         </span>
//                     </div>
//                 </Link>
//                 <Link href={currentPage === 1 ? "#" : "/manage"}>
//                     <div className="linkDiv">
//                         <span style={{"display": "block", "width":"100%"}}>
//                             <TextContainer>
//                                 <h2 className={currentPage === 1 ? "Polaris-Heading activePageLink" : "Polaris-Heading pageLink"}>Manage Edits</h2>
//                             </TextContainer>
//                         </span>
//                     </div>
//                 </Link>
//                 <Link href={currentPage === 2 ? "#" : "/faq"}>
//                     <div className="linkDiv">
//                         <span style={{"display": "block", "width":"100%"}}>
//                             <TextContainer>
//                                 <h2 className={currentPage === 2 ? "Polaris-Heading activePageLink" : "Polaris-Heading pageLink"}>FAQ</h2>
//                             </TextContainer>
//                         </span>
//                     </div>
//                 </Link>
//             </Stack>
//         </div>
//     )


// }


export default Nav