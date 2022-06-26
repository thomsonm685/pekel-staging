



// import '@shopify/polaris/dist/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import { Card, Stack, Button, Collapsible, TextContainer, Heading, Scrollable, TextField, Modal } from '@shopify/polaris';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Accordian from './accordian';
import { BiBorderRadius } from 'react-icons/bi';
import EditorLine from './editorLine'
// import { useRouter } from 'next/router';
import RevertStyles from '../../helpers/revertStyles'
import { getSessionToken } from '@shopify/app-bridge-utils';




const StylesManager = ({reload, newReload, styleSheetsArray, inactiveEdits, storeData, app}) => {

    // const router = useRouter();
    // const refreshData = () => {
    //     router.replace(router.asPath);
    // }

    // MAKE DYNAMIC !!!!
    // const themeID = "119273160889"
    // const shopName = "michael-t-dev.myshopify.com"

    const [value, setValue] = useState('New Style');
    const [loading, isLoading] = useState(false);
    const [published, justPublished] = useState(false);
    const [publishResult, setPublishedRes] = useState("");  
    const [styleId, setStyleId] = useState(""); 
    const [editUrl, setEditUrl] = useState(""); 
    const [editOnOrOff, setEditOnOrOff] = useState("On");
    const [revertModalOpen, setRevertModalOpen] = useState(false); 
    const [toggleEditsModalOpen, setToggleEditsModalOpen] = useState(false);
 
    // const [styleApplication, setStyleApplication] = useState("");  
    // const [styleUrl, setStyleUrl] = useState("");  
    const node = useRef(null);  
    const buttonRef = useRef(null); 

    // const handleOpen = useCallback(() => setRevertModalOpen(true), []);
    const handleOpen = (e) => {
        setRevertModalOpen(true);

        let elm = e.target;
        const getStyleId = () => {
            if (elm.hasAttribute("style_id")){
                setStyleId(elm.getAttribute("style_id"));
                // setStyleApplication(elm.getAttribute("style_application"));
                // setStyleUrl(elm.getAttribute("style_url"));
            } 
            else {
                elm = elm.parentElement;
                getStyleId();
            }
        }
        getStyleId();
        

        // setStyleId(e.target.parentElement.getAttribute("style_id"));
        console.log("Style ID:", styleId);
    }

    const handleClose = useCallback(() => {
      setRevertModalOpen(false);
      justPublished(false);
    }, []); 
    
    const handleChange = useCallback((newValue) => setValue(newValue), []); 

    // const handleOpen = useCallback(() => setRevertModalOpen(true), []);
    const openToggleEditsModal = (e) => { 
        setToggleEditsModalOpen(true);
        let theUrl;

        let elm = e.target;
        const getEditUrl = () => {
            console.log("elm", elm);
            if (elm.hasAttribute("edit_url")){
                setEditUrl(elm.getAttribute("edit_url"));
                theUrl = elm.getAttribute("edit_url");
                console.log("editUrl", theUrl);
                console.log("inactiveEdits", inactiveEdits);
                if(inactiveEdits.includes(theUrl)) setEditOnOrOff("Off")
                else setEditOnOrOff("On")
                return
            } 
            else {
                elm = elm.parentElement;
                getEditUrl();
            }
        }

        getEditUrl();

        console.log(storeData.edits.filter((edit) => edit.url === editUrl))

        console.log("editUrl", theUrl);

        setStyleId(storeData.edits.filter((edit) => edit.url === theUrl)[0]._id);
        let theId = storeData.edits.filter((edit) => edit.url === theUrl)[0]._id;

        // setStyleId(e.target.parentElement.getAttribute("style_id"));
        console.log("Style ID2:", theId);
    }
    const closeToggleEditsModal = useCallback(() => {
    setToggleEditsModalOpen(false);
    justPublished(false);
    }, []); 

    const overwrite = async (toggling) => {
        isLoading(true);
        // togglingEdits = 'on' or 'off', if we're toggling, or null if not
        let styleName = toggling === null ? await document.querySelector(".Polaris-TextField__Input").value : null;
        console.log("Style ID:", styleId)

        const sessionToken = await getSessionToken(app);

        await RevertStyles(styleName, styleId/*, styleApplication, styleUrl*/, toggling, sessionToken)
        .then(() => {
          setPublishedRes("Styles Have Been Changed Back! 🎉")
          isLoading(false);
          justPublished(true);
          console.log('about to reload!')
          newReload(!reload); /// HEREEEEE! MAKE COMPONENET RELOAD DATA
        })
        .catch((err => {
          setPublishedRes("Sorry,There Was An Error! ❌ Try Again, And Contact Us If The Problem Persists.");
          isLoading(false);
          justPublished(true);
          console.log("ERROR:", err)
        })) 
        // refreshData();
    }
// YOU"RE HERE, MAKING THE TURN OFF EDITS BUTTON WORK !!!

    return(
        <>
        <Stack vertical={true}>
            {styleSheetsArray.map((themeStyles, firstIndex) => (
//[[[{url: products, app: 'specific'}, {url: products, app: 'specific'}] [{url: collections, app: 'specific'}, {url: collections, app: 'specific'}]], [[[{url: products, app: 'multi'}, {url: products, app: 'multi'}] [{url: collections, app: 'multi'}, {url: collections, app: 'multi'}]], ...]

                <div key={`${firstIndex}`} style={{display:"flex", width: "100%", justifyContent: "space-between"}} className="lineBottom stylesTypeSection">
                    <div className="styleTypeHeading">
                    {themeStyles[0][0].application === 'pageSpecific' ? 
                        <div>
                            <Heading>Single Page Edits</Heading>
                            <p style={{color:"#6d7175"}}>Edits you applied to a single page.</p> 
                            
                        </div> :
                    themeStyles[0][0].application === 'multiPage' ?
                        <div className="styleTypeHeading">
                            <Heading>Multi-Page Edits</Heading>
                            <p style={{color:"#6d7175"}}>Edits you applied to multipe pages, such as product pages, collection pages, etc..</p> 
                        </div> :
                    themeStyles[0][0].application === 'siteWide' ? 
                        <div className="styleTypeHeading">
                            <Heading>Whole Site Edits</Heading>
                            <p style={{color:"#6d7175"}}>Edits you applied to your entire site.</p> 
                        </div> :''
                    }

                        {/*
                        <Heading>{themeStyles[0].themeName}</Heading>
                        <p style={{color:"#6d7175"}}>(Current Theme Or Not Goes Here)</p>
                         {firstIndex === 0 ? <p style={{color:"#6d7175"}}>(Current Theme)</p> : ''} */}

                    </div>

                    <div>
                        <Scrollable className="Polaris-Scrollable Polaris-Scrollable--vertical Polaris-Scrollable--hasBottomShadow Polaris-Scrollable--verticalHasScrolling" style={{ maxHeight:"77vh", padding:'1px'}} shadow>
                            <Stack vertical={true} className="lineBottom">
                                {themeStyles.map((urlSortedArray, secondIndex) => ( // mapping over each array of obj: [{asd}, {asd}], [{asdas}, {asdasd}]
                                <div key={`${secondIndex}`} edit_url={urlSortedArray[0].url} >
                                    <Card title={urlSortedArray[0].url === 'http' ? 'Site Wide Edits' : urlSortedArray[0].url} subdued={ inactiveEdits.includes(urlSortedArray[0].url) ? true : false} style={{borderRadius:"8px"}} actions={[{content: (inactiveEdits.includes(urlSortedArray[0].url) ? "Turn On Edits" : "Turn Off Edits"), onAction: openToggleEditsModal}]} sectioned >
                                        <Scrollable style={{ maxHeight: firstIndex === 0 ? "350px" : "240px" }} shadow>
                                            {urlSortedArray.map((thisStyle, thirdIndex) => (
                                            <div key={`${thirdIndex}`} className={thirdIndex === 0 ? "curStyle" : "otherStyles" }>
                                                <div style={{display:"inline-block", width: "max-content"}}>
                                                    <Heading>{thisStyle.name}</Heading> 
                                                    {/* {thirdIndex === 0 ? <p style={{color:"#6d7175"}}>(Current Edits)</p> : ""} */}
                                                    <h4>{thisStyle.date}</h4> 
                                                </div>

                                                {thirdIndex === 0 ?
                                                <div style_id={thisStyle._id} /*style_application={thisStyle.application} style_url={thisStyle.url}*/> 
                                                {thirdIndex === 0 ? <p style={{color:"#6d7175"}}>(Current Edits)</p> : ""}
                                                    {/* <Button external url={`https://${process.env.NEXT_PUBLIC_SHOP}/admin/themes/${themeID}?key=snippets/easy_edits.css.liquid`}>
                                                        <p style={{fontWeight:600}}>Turn Off Edits</p> 
                                                    </Button> */}
                                                </div>: 
                                                <div ref={buttonRef} style_id={thisStyle._id} style={{marginLeft:"3px"}}> 
                                                    <Button onClick={handleOpen}>
                                                        <p style={{fontWeight:600}}>Use These Edits</p>
                                                    </Button>
                                                </div>}

                                            </div>
                                            ))} 
                                        </Scrollable>
                                    </Card>
                                </div>
                                ))} 
                            </Stack>
                        </Scrollable>
                    </div>

                    



                    {/* <div style={{width: "65%"}}>
                        <Card title="Theme Styles" style={{borderRadius:"8px"}} sectioned >
                            <Scrollable style={{ maxHeight: firstIndex === 0 ? "350px" : "240px" }} shadow>
                                {themeStyles.map((thisStyle, secondIndex) => (
                                <div key={`${secondIndex}`} className={secondIndex === 0 ? "curStyle" : "otherStyles" }>
                                    <div style={{display:"inline-block", width: "max-content"}}>
                                        <Heading>{thisStyle.name}</Heading> 
                                        {secondIndex === 0 ? <p style={{color:"#6d7175"}}>(Current Theme Styles)</p> : ""}
                                        <h4>{thisStyle.date}</h4> 
                                    </div>

                                    {secondIndex === 0 ?
                                    <div ref={buttonRef} style_id={thisStyle._id}> 
                                        <Button external url={`https://${process.env.NEXT_PUBLIC_SHOP}/admin/themes/${themeID}?key=snippets/easy_edits.css.liquid`}>
                                            <p style={{fontWeight:600}}>Edit Code</p> 
                                        </Button>
                                    </div>: 
                                    <div ref={buttonRef} style_id={thisStyle._id}> 
                                        <Button onClick={handleOpen}>
                                            <p style={{fontWeight:600}}>Use These Styles</p>
                                        </Button>
                                    </div>}

                                </div>
                                ))} 
                            </Scrollable>
                        </Card>
                    </div> */}
                </div>
            ))}
        </Stack>

        <Modal
          activator={buttonRef}
          open={revertModalOpen}
          onClose={handleClose}
          title="Overwrite ALL Current Styles And Revert To These Styles?"
          primaryAction={{
            content: 'Overwrite',
                onAction: () => overwrite(null)
          }}
          loading={loading}
        >
          <Modal.Section>
            { published ?
              // (published ? <h1>Success!</h1> : <h1>Error!</h1>) :
              <h1>{publishResult}</h1> :
              <>
              <TextContainer>
              </TextContainer>
              <TextField
                // ref={node}
                label="Style Name:"
                // onFocus={handleFocus}
                value={value}
                onChange={handleChange}
              /> 
              </>
            }
            
          </Modal.Section>
        </Modal>
        <span id="cur_style_id" style={{display:"none"}}></span>


        <Modal
          open={toggleEditsModalOpen}
          onClose={closeToggleEditsModal}
          title={"Turn Edits " + (editOnOrOff === "Off" ? "On" : "Off") + "?"}
          primaryAction={ editOnOrOff === "On" ? {
                content: "Turn Edits Off",
                onAction: () => overwrite("off"),
            } : 
            {
                // PASS IN STYLES TO RUN SAME AS OTHER MODAL
                content: "Turn Edits On",
                onAction: () => overwrite("on"),
            }
          }
          loading={loading}
        >
          <Modal.Section>
            { published ?
              // (published ? <h1>Success!</h1> : <h1>Error!</h1>) :
              <h1>{publishResult}</h1> :
              <>
              <TextContainer>
                {editOnOrOff === "On" ?
                    <p>
                    {editUrl === "http" ? "All Site-Wide Edits, (Not Page-Specific, Or Multi-Page)," : 
                    editUrl[1] === "/" ? "All Mutli-Page Edits, (Not Page-Specific), For " + editUrl :
                    "All Page-Specific Edits, (Not Multi-Page), For " + editUrl} Will Be Turned Off For Now. You can always turn them back on here!
                    </p> :
                    <p>
                    {editUrl === "http" ? "All Site-Wide Edits" : 
                    editUrl[1] === "/" ? "All Mutli-Page Edits For" + editUrl :
                    "All Page-Specific Edits, (Not Multi-Page), For" + editUrl} Will Be Turned Back On. The Edits Will Be Instantly Applied To Your Site Again!
                    </p>
                }
              </TextContainer>
              </>
            }
            
          </Modal.Section>
        </Modal>
        </>
    )
}



{/* <>
{styleSheetsArray.map((themeStyles) => (
    <div>
        <h1>{ themeStyles[0].themeName }</h1>

        <div>
            {themeStyles.map((thisStyle, index) => (
            <div>
                <h3>{thisStyle.name} {index === 0 ? "Live Styles" : ""}</h3> 
                <h4>{thisStyle.date}</h4> 
                <button>{index === 0 ? "Edit Code" : "Use These Styles"}</button>
            </div>
            ))} 
        </div>
    </div>
))}
</> */}



// {stylesArray.map((style) => (
//     <Accordian title={`${style.name}, created at: ${style.date}`} button={"Manage Styles"} key={style.id}>
//         <h3>The CSS:</h3>
//         <p>"{style.style}"</p>
//     </Accordian>
// ))}

export default StylesManager