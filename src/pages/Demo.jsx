




// Imports 
import React, { useEffect, useState, useRef, useCallback } from 'react';
// import '@shopify/polaris/dist/styles.css';
import {Link,TextContainer, TextField, List, Button, Modal, Card, Page, Spinner, Subheading, Select, Checkbox, Stack, RadioButton, Heading, Icon} from '@shopify/polaris';
import { DiamondAlertMajor, MobileCancelMajor } from '@shopify/polaris-icons';
import {BsArrowDown } from 'react-icons/bs';
import fetch from "node-fetch";
import editorJS from '../../helpers/editor'
import AddDemoStyles from '../../helpers/addDemoStyles'
import MobileResize from '../../helpers/mobileResize'
import EditorModal from '../components/EditorModal'
import Nav from '../components/Nav'
import SkelePage from '../components/Skele'
import { getSessionToken } from "@shopify/app-bridge-utils";



// Demo PAGE COMPONENT
// On load, we get the clients home page HTML and render it
const Demo = () => {
  
  // REACT useState() FUNCTIONS
  const [authedToken, setAuthedToken] = useState(false);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState('New Style');
  const [isLoading, setLoading] = useState(false);
  const [modalLoading, modalIsLoading] = useState(false);
  const [published, justPublished] = useState(false);
  const [publishResult, setPublishedRes] = useState("");
  const [storeLoaded, setStoreLoaded] = useState(true);
  const [textFieldValue, setTextFieldValue] = useState('');
  const [xPxValue, setXPxValue] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [selected, setSelected] = useState('');
  const [selectedTwo, setSelectedTwo] = useState('Custom');
  const [styleApplication, setStyleApplication] = useState('pageSpecific');
  const [storeURL, setStoreURL] = useState('');
  const [theHTML, setTheHTMl] = useState(null);
  const [sessionEdits, setSessionEdits] = useState('');
  

  // HANDLER FUNCTIONS 
  const buttonRef = useRef(null);
  // onClick Functions For Modal
  const handleOpen = useCallback(() => setActive(true), []);
  const handleClose = useCallback(() => {
    setActive(false);
    justPublished(false);
  }, []);
  // On Change Function For Text Input
  const handleTextFieldChange = useCallback((value) => setTextFieldValue(value),[],);
  const handleChange = useCallback((newValue) => setValue(newValue), []);
  // Functions to handle the frame size
  const handleXPxChange = (value) => {
    setXPxValue(value);
    value = parseInt(value);
    // Changing the actual frame size, which is what we use when we turn it into media queries 
    // The whole container with the X bar
    document.querySelector('#storeHorzContainer').style.width = `${value + 44}px`
    //Changing Y bar width
    document.querySelector(".resizeBarY").style.width = `${value}px`;
    // adding the centering margin
    document.querySelector('#storeHorzContainer').style.marginLeft = `${(document.querySelector('#storeHorzContainer').parentElement.offsetWidth - document.querySelector('#storeHorzContainer').offsetWidth)/2}px`;
    document.querySelector(".resizeBarY").style.marginLeft = `${(document.querySelector('#storeHorzContainer').parentElement.offsetWidth - document.querySelector('#storeHorzContainer').offsetWidth)/2}px`;
  }
  const handleYPxChange = (value) => {
    // setYPxValue(value);
    value = parseInt(value);
    // Changing the actual frame size, which is what we use when we turn it into media queries 
    document.querySelector('#storeFrame').style.height = `${value}px`;
    // The whole container with the X bar
    document.querySelector('#storeHorzContainer').style.height = `${value}px`
    // Moving Y bar up
    let bottomDif = `${document.querySelector('#storeFrame').offsetHeight - value}px`;
    let curBottom = parseInt(document.querySelector(".resizeBarY").style.bottom.replace('px', ''));
    document.querySelector(".resizeBarY").style.bottom = `${curBottom + bottomDif}px`

  }
  // radio buttons for style application
  const styleApplicationChange = useCallback(
    (_checked, newValue) => setStyleApplication(newValue),
    [],
  );
  // On Change Function For Checkbox
  const editForMobile = (newChecked) => {
    // Put store Frame back to full width
    document.querySelector('#storeHorzContainer').style.height = 'calc(100vh)';
    document.querySelector('#storeHorzContainer').style.width = '100%';
    document.querySelector('#storeHorzContainer').style.marginLeft = '0px';
    document.querySelector('#storeFrame').style.width = '100%';
    document.querySelector('#storeFrame').style.height = '100%';

    // Set PX text fields to width of store frame, and set select to "Custom"
    setXPxValue(document.querySelector('#storeFrame').offsetWidth);
    // setYPxValue(document.querySelector('#storeFrame').offsetHeight);
    // document.querySelectorAll('.Polaris-TextField__Input.Polaris-TextField__Input--suffixed')[0].value = document.querySelector('#storeHorzContainer').offsetWidth;
    // document.querySelectorAll('.Polaris-TextField__Input.Polaris-TextField__Input--suffixed')[1].value = document.querySelector('#storeHorzContainer').offsetHeight;
    setSelectedTwo('Custom');

  }
  // On Change Function For Select
  const handleSelectChange = (value) => {
    setSelected(value);
    loadStoreHTML(value);
  }
  const handleSelectChangeTwo = (value) => {
    setSelectedTwo(value);
    switch(value){
      case 'iPhone X':
        handleXPxChange('375');
        handleYPxChange('812');
        break;
      case 'iPad':
        handleXPxChange('768');
        handleYPxChange('1024');
        break;
      case 'iPad Pro':
        handleXPxChange('1024');
        handleYPxChange('1366');
        break;
      case 'Surface Duo':
        handleXPxChange('540');
        handleYPxChange('720');
        break;
      case 'Galaxy Fold':
        handleXPxChange('280');
        handleYPxChange('653');
        break;
      case 'Moto G4':
        handleXPxChange('360');
        handleYPxChange('640');
        break;
      case 'Galaxy S5':
        handleXPxChange('360');
        handleYPxChange('640');
        break;
      case 'Pixel 2':
        handleXPxChange('411');
        handleYPxChange('731');
        break;
      case 'Pixel 2 XL':
        handleXPxChange('411');
        handleYPxChange('823');
        break;
      case 'iPhone 5/SE':
        handleXPxChange('320');
        handleYPxChange('568');
        break;
      case 'iPhone 6/7/8':
        handleXPxChange('375');
        handleYPxChange('667');
        break;
      case 'iPhone 6/7/8 Plus':
        handleXPxChange('414');
        handleYPxChange('736');
        break;
    }
  }

  // FUNCTION TO GET AND RENDER STORE HTML
  // get store HTML, add it to page, then hook up listeners for styles (editorJS)
  const loadStoreHTML = async () => {
    
    setLoading(false);

    fetch(`/get_page_demo?storeUrl=${"https://easy-edits-demo.myshopify.com/"}`)
      .then(async (response) => {
        try
        {
          // making spinner go
          setStoreLoaded(false);

          // parse to text/plainHTML
          let plainSiteHTML = await response.text()
          setTheHTMl(plainSiteHTML);

          // removing any html/iframe from where our new store HTML goes
          document.querySelector('#storeFrameContainer').innerHTML = '';

          // creating new iframe for our store HTML and adding it to the srcdoc attribute
          let iframe = document.createElement("iframe");
          iframe.srcdoc = plainSiteHTML;
          iframe.setAttribute('id', 'storeFrame');

          // Hooking Up Functionality To Actually Make And Store CSS Changes
          iframe.addEventListener('load', () => {
            try{
              // removing the scroll bar
              // document.querySelector("#storeFrame").contentDocument.querySelector("html").style.overflow = 'hidden';

              // The demo <style> element that holds the css after publishing (needs to be in iframe to have an effect)
              let demoStyles = document.createElement("style");
              demoStyles.setAttribute('id', 'demoStyles');
              demoStyles.innerText = sessionEdits;
              document.querySelector("#storeFrame").contentDocument.querySelector("html").appendChild(demoStyles);

              // The <style> element that holds the css (needs to be in iframe to have an effect)
              let styleElement = document.createElement("style");
              styleElement.setAttribute('id', 'mainStyles');
              document.querySelector("#storeFrame").contentDocument.querySelector("html").appendChild(styleElement);

              // Adding any styles to actual iframe
              let othersStyles = document.createElement("style");
              // othersStyles.innerText = `html:hover{ cursor: pointer !important} html::-webkit-scrollbar-track{border-radius: 2px;} html::-webkit-scrollbar{width: 5px;background-color: #F7F7F7;} html::-webkit-scrollbar-thumb{border-radius: 10px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);box-shadow: inset 0 0 6px rgba(0,0,0,.3);background-color: #BFBFBF;}.draggingCursor:hover{cursor: move !important;}`
              othersStyles.innerText = `.draggingCursor:hover{cursor: move !important} html:hover{ cursor: pointer !important}  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);box-shadow: inset 0 0 6px rgba(0,0,0,.3);background-color: #BFBFBF;}@keyframes glow{0%{transform:scale(1)}50%{transform:scale(2)}100%{transform:scale(1)}} @-webkit-keyframes glow{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(1)}} .glow{transform:scale(1);animation-name:glow;animation-duration:1s}`
              document.querySelector("#storeFrame").contentDocument.querySelector("html").appendChild(othersStyles);

              document.querySelector("#storeFrame").style.height = '100%';
              document.querySelector("#storeFrame").contentDocument.querySelector('html').style.overflowY = 'scroll'
              editorJS(firstLoad,true);
            }
            catch(err) // if the page blocks the request or iframe, let the user know
            {
              console.log('Error Getting Store Frame:', err)
              // setStoreLoaded(null);
              // document.querySelector('#storeFrameContainer').innerHTML = '';
            }
          });

          // adding the iframe with the new stores HTML to the actual app
          document.querySelector("#storeFrameContainer").appendChild(iframe);         
          setFirstLoad(false);
          setStoreLoaded(true);
        } 
        catch(err) // if the page blocks the request or iframe, let the user know
        {
          console.log('Error Getting Store Frame:', err)
          // setStoreLoaded(null);
          // document.querySelector('#storeFrameContainer').innerHTML = '';
        }
      })
      .catch((error) => {
        console.log('Error Getting Store Frame:', error)
        // setStoreLoaded(null);
        // document.querySelector('#storeFrameContainer').innerHTML = '';
      });
  }

  useEffect(() => {
    if(document.querySelector("#storeFrame")){
        document.querySelector("#storeFrame").contentDocument.querySelector("#demoStyles").innerText = sessionEdits;
        return;
    }

    window.addEventListener("message", (event) => {
        if(event.origin === "https://easy-edits-demo.myshopify.com"){
            setSessionEdits(event.data);
        }
    }, false);    
    loadStoreHTML();
    document.querySelector('html').style.overflow = 'hidden';
        if(document.querySelector("#storeFrame")){
        document.querySelector("#storeFrame").contentDocument.querySelector("#demoStyles").innerText = sessionEdits;
    }
  },[sessionEdits]);



  // let pagesCopy = pages.map()
  // Options For Select
  const options = [
    {label: `Home`, value: `https://easy-edits-demo.myshopify.com/`}
  ];
  const optionsTwo = [
    {label: 'Custom', value: 'Custom'},
    {label: 'iPhone X', value: 'iPhone X'},
    {label: 'iPad', value: 'iPad'},
    {label: 'iPad Pro', value: 'iPad Pro'},
    {label: 'Surface Duo', value: 'Surface Duo'},
    {label: 'Galaxy Fold', value: 'Galaxy Fold'},
    {label: 'Moto G4', value: 'Moto G4'},
    {label: 'Galaxy S5', value: 'Galaxy S5'},
    {label: 'Pixel 2', value: 'Pixel 2'},
    {label: 'Pixel 2 XL', value: 'Pixel 2 XL'},
    {label: 'iPhone 5/SE', value: 'iPhone 5/SE'},
    {label: 'iPhone 6/7/8', value: 'iPhone 6/7/8'},
    {label: 'iPhone 6/7/8 Plus', value: 'iPhone 6/7/8 Plus'}
  ];

  // On Click To Get Page URL
  const urlSearch = async () => {
    // get store page in iframe
    loadStoreHTML(textFieldValue); 
  }

  // onClick Function For Publish Button In Modal
  const publish = async () => {
    modalIsLoading(true);

    // If They Haven't Changed Anything, Don't Do Anything
    if (document.querySelector("#storeFrame").contentDocument.querySelector("#mainStyles").innerText === ""){ 
      setPublishedRes("No Styles To Publish, Go Change Some Stuff!")
      modalIsLoading(false);
      justPublished(true);
      return
    }
    
    // Adding Styles To Shopify Store And DB
    await AddDemoStyles()
      .then(() => {
        setPublishedRes("Styles Have Been Published 🎉, See Them In The Demo Page!")
        modalIsLoading(false);
        justPublished(true);
      })
      .catch((err => {
        console.log(err);
        setPublishedRes("Sorry,There Was An Error! ❌ Try Again And Contact Us If The Problem Persists.")
        modalIsLoading(false);
        justPublished(true);
      })) 
  }

  const preview = (e) => {
    const styles = () => document.querySelector("#storeFrame").contentDocument.querySelector("#mainStyles").innerText;
    const demoStyles = () => document.querySelector("#storeFrame").contentDocument.querySelector("#demoStyles").innerText;

    const win = window.open();
    
    const stylesElm = win.document.createElement('STYLE');

    stylesElm.innerText = styles() + demoStyles();
    win.document.write(theHTML);
    win.document.close();
    win.document.head.appendChild(stylesElm);
    win.document.addEventListener('DOMContentLoaded', () => win.document.body.innerHTML += `<div style="z-index: 1000000;background: #6471C7;width: 100vw;height: 5vh;max-height: 25px;position: fixed;bottom: 0;box-shadow: 50px 50px 50px 30px grey;"> <p style="color: white;letter-spacing: 2px;width: max-content;margin: 0 auto;">Edits Preview </p></div>`);    
  }

    
    
    return (
      <div id="demoContainer">
        {/* Modals */}
        <EditorModal/>
        <Modal
          activator={buttonRef}
          open={active}
          onClose={handleClose}
          title="Ready To Publish?"
          primaryAction={{
            content: 'Publish',
            onAction: publish,
          }}
          // loading={modalLoading}
        >
          <Modal.Section>
            { published ?
              <h1>{publishResult}</h1> :
              <>
              <Stack vertical>
                <RadioButton disabled
                  label="Apply Edits To This Page Only?"
                  helpText="They'll be added only to this one page, and overide any site-wide/multi-page styles."
                  checked={styleApplication === 'pageSpecific'}
                  id="pageSpecific"
                  name="styleApplication"
                  onChange={styleApplicationChange}
                />
                { storeURL.match(/\/products\/|\/collections\//g) ? 
                  <RadioButton disabled
                  label={"Apply Edits To All " + storeURL.match(/\/products\/|\/collections\//)[0] + " Pages?"} 
                  helpText={"They'll be added to all "+storeURL.match(/\/products\/|\/collections\//)[0]+" pages, and overide any site wide styles."}
                  id="multiPage"
                  name="styleApplication"
                  checked={styleApplication === 'multiPage'}
                  onChange={styleApplicationChange}
                  /> : ''
                }
                <div style={{marginBottom:'10px'}}>
                  <RadioButton disabled
                    label="Apply Edits Site Wide?"
                    helpText="They'll be added to any elements that match, such as the header on each page."
                    id="siteWide"
                    name="styleApplication"
                    checked={styleApplication === 'siteWide'}
                    onChange={styleApplicationChange}
                  />
                  <h3 className='Polaris-Choice__Descriptions'><strong>NOTE</strong>: Some elements may not match across pages, in which case the edit can be applied using 'Apply Edits To This Page Only?' option.</h3>
                </div>
              </Stack>
              <TextField disabled
                // ref={node}
                label="Style Name:"
                // onFocus={handleFocus}
                value={value}
                onChange={handleChange}
              /> 
              </>
            }
            {modalLoading?
              <div style={{width:'min-content',margin:'2rem auto'}}>
                <Spinner></Spinner>
              </div> 
            :''}
          </Modal.Section>
        </Modal>
        <div style={{display:'none'}}>            
            <Checkbox
            />
        </div>
        { isLoading ?  
            <div style={{margin:"18% auto", width: "min-content"}}>
              < Spinner/>
            </div> :  
        <>        
        <div id="appMain" style={{background:"#f4f6f8"}}>
        <div style={{width:"100%"}}>
        <Page>
          <Card sectioned subdued>
            <div className="headerContainer">
            {/* <TextContainer color="black">
              <p>A copy of your website is waiting below. Here's how to edit:</p>
              <List type="number">
                <List.Item>Click anywhere on your website to select an element to edit it.</List.Item>
                <List.Item>Edit it however you'd like using the pop-up.</List.Item>
                <List.Item>Repeat for every element you want to edit, then hit publish!</List.Item>
              </List>
            </TextContainer>  */}


            <label className="Polaris-Label__Text">Select Page To Edit:</label>
            <Select disabled
              label="Current Page:"
              labelInline
              options={options}
              onChange={handleSelectChange}
              value={selected}
            />

            {/* <Subheading>Recent Pages:</Subheading>
            <Select
              label="Most Recent:"
              labelInline
              options={recentOptions}
              onChange={handleRecentSelectChange}
              value={recentlySelected}
            /> */}

            {/* <Subheading>Or Paste The URL:</Subheading>  */}
            <TextField disabled
              label="Or Paste The URL:"
              onChange={handleTextFieldChange}
              value={textFieldValue}
              labelAction={{content: 'Get your page', onClick: urlSearch}}
              // labelAction={loadStoreHTML(textFieldValue)}
              placeholder="https://myshopify.com/"
            />

            <Checkbox disabled
              label="Edit For Mobile"
              onChange={editForMobile}
            />


              <div className="publishButton" ref={buttonRef}>
                <Button primary={true} size="large" onClick={handleOpen}>Publish Edits</Button>
              </div>
              <Link disabled> Preview Edits -></Link>
              {/* <div >
                <FaqItem title="Need Help?" paragraph="
                Here's How To Edit: 
                Select the page you'd like to edit, or paste the URL if it's not avalible in the dropdown.
                You're page will be loaded in the editor, then click on any element to edit it with the modal that pops up. 
                You can use the 'Select Element' arrows to get the element above/below it. To reposition elements, 
                check the 'Enable Drop And Drop', then drag them anywhere. Edit most anything with the various options 
                on the pop-up. To edit on mobile, check the 'Edit For Mobile' box on the card above your page editor,
                then resize to the screen size you want to edit for. Check the FAQ page for more detail!
                " />
              </div> */}
            </div>
          </Card>
        </Page>
            {/* <div className="publishButton" style={{width:'max-content',margin:'auto'}} ref={buttonRef}>
                <Button primary={true} size="large" onClick={handleOpen}>Publish Edits</Button>
            </div> */}
        </div>

        <div style={{margin:'auto', width:'min-content'}}>
          <BsArrowDown size={100}/>
        </div>
        
        <div style={{height:"100%"}}>
          <div id="storeContainer">
          { firstLoad ? 
              <div style={{margin:'auto',width:'max-content'}}>
                <div className="storeSign">
                  <div style={{width:'min-content', margin:'7rem auto'}}>
                    <Spinner/>
                  </div>
                {/* <img src={yourStoreHere} alt="Your Store Goes Here!" width="800" height="800" /> */}
                </div>
              </div> 
          :''}

            {/* { storeLoaded ? <div id="storeHTML"></div> :  */}
            { storeLoaded === false ?  
            <div style={{margin:"10% auto", width: "min-content"}}>
              < Spinner/>
            </div> : ""}
            <div id="storeHorzContainer" style={{display:"flex", width:"100%", height:"100vh", overflow:"hidden"}}>
              <div id="storeFrameContainer">
              {storeLoaded === null ? 
                <div style={{width:"50%", margin:"18% auto"}}>
                  <TextContainer>
                    <Stack>
                      <Heading>Oops, Error Getting Your Store!</Heading>
                      <Icon source={DiamondAlertMajor} color="base" />
                    </Stack>
                    <p>
                      Refresh the page and try again. If that doesn't work, your store most likely blocked our 
                      request or disallowed iFrames, and you can contact your themes developer. 
                      If all fails, contact us at: perceptionapps@gmail.com.
                    </p>
                  </TextContainer>
                </div>
                : ''}
                {/* { editMobileChecked ?<div style={{width:"10px", background:"#c7c7c7"}}></div>:''} */}
              </div>
            </div>


            {/* <style id="demoStyles"></style> */}
            {/* <style id="mainStyles"></style> */}
          </div>
        </div>
      </div>

      <div className="smallScreenNotice" style={{width:"50%", margin:"18% auto"}}>
        <TextContainer>
          {/* <Stack> */}
            <Heading>
              <span style={{textAlign:"center"}}>Looks like you're on a smaller screen than we support for site editing! (You can still manage
              your site edits, using this device.)</span>
            </Heading>
            <div style={{width:"90%", margin:"2% auto"}}>
              <Icon source={DiamondAlertMajor} color="base" />
            </div>
          {/* </Stack> */}
        </TextContainer>
      </div>
      </>
      }
    </div>
    )
  }






export default Demo; 
