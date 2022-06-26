




// Imports 
import React, { useEffect, useState, useRef, useCallback } from 'react';
// import Image from 'next/image';
// import '@shopify/polaris/dist/styles.css';
import {Link,TextContainer, TextField, List, Button, Modal, Card, Page, Spinner, Subheading, Select, Checkbox, Stack, RadioButton, Heading, Icon} from '@shopify/polaris';
import { DiamondAlertMajor, MobileCancelMajor } from '@shopify/polaris-icons';
import {BsArrowDown } from 'react-icons/bs';
import fetch from "node-fetch";
import editorJS from '../../helpers/editor'
import AddStyles from '../../helpers/addStyles'
import MobileResize from '../../helpers/mobileResize'
import EditorModal from '../components/EditorModal'
import Nav from '../components/Nav'
import FaqItem from '../components/FaqItem';
import DBConnection from '../../helpers/dbConnection';
import SkelePage from '../components/Skele'
import { getSessionToken } from "@shopify/app-bridge-utils";
import {useQuery,gql} from "@apollo/client";


// Giving a few vars from server-side
export async function getServerSideProps() { 
  return {props: {shopName: process.env.NEXT_PUBLIC_SHOP/*, shopInfo: shopInfo*/}}
}




// Home PAGE COMPONENT
// On load, we get the clients home page HTML and render it
const Home = ({plainSiteHTML, shopName, app,host}) => {
  
  // REACT useState() FUNCTIONS
  const [pages, setPages] = useState(null);
  const [authedToken, setAuthedToken] = useState(false);
  const [active, setActive] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
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
  const [editMobileChecked, setEditMobileChecked] = useState(false);
  const [styleApplication, setStyleApplication] = useState('pageSpecific');
  const [storeURL, setStoreURL] = useState('');
  const [theHTML, setTheHTMl] = useState(null);
  const [storePass, updateStorePass] = useState(null);
  

  // HANDLER FUNCTIONS 
  const buttonRef = useRef(null);
  // onClick Functions For Two Modals
  const handleOpen = useCallback(() => setActive(true), []);
  const handleClose = useCallback(() => {
    setActive(false);
    justPublished(false);
  }, []);
  const openTutorial = useCallback(() => {
    setActiveTutorial(true);
  }, []);
  const closeTutorial = useCallback(() => {
    setActiveTutorial(false);
  }, []);
  const openPasswordModal = useCallback(() => {
    setOpenPassword(true);
  }, []);
  const closePassword = useCallback(() => {
    setOpenPassword(false);
  }, []);
  const savePassword = async () => {
    // await DBConnection.UpdatePassword(storePass);
    // await savePasswordCookie(storePass);
    return
  }
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

    setEditMobileChecked(newChecked);
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
  const loadStoreHTML = async (theURL) => {
    
    setLoading(false);

    const sessionToken = await getSessionToken(app);

    fetch(`/get_page?storeUrl=${theURL}&store=${shopName}`,{headers:{authorization:sessionToken}})
      .then(async (response) => {
        try
        {
          // making spinner go
          setStoreLoaded(false);

          // parse to text/plainHTML
          let parsedRes = await response.text();
          parsedRes = JSON.parse(parsedRes);
          setStoreURL(parsedRes.url);
          plainSiteHTML = await parsedRes.html;
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

              // The editor functionality
              editorJS(firstLoad);
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

          if(response.status === 403){
            return openPasswordModal();
         }
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
    // on skeleton page load, req to validate session token
    const authenticateToken = async () => {
      // getting session token with app
      await getSessionToken(app) 
        .then(async token=> { 
          // validate it through server
          await fetch(`/auth_token?shop=${shopName}`, {method:"POST",headers:{'authorization':token}})
            .then(async data=>{
              // if validated, move on from skeleton page and load data
              if(data && data.status === 200) {
                let parsedData = await data.json();
                console.log(parsedData);
                setPages(parsedData.pages.map(page => {
                  return {label:`${page.title}    (https://${shopName}/pages/${page.title.replace(/[^a-zA-Z0-9_ ]/g, '').replace(/ /g, '-').toLowerCase()})`,value:`https://${shopName}/pages/${page.title.replace(/[^a-zA-Z0-9_ ]/g, '').replace(/ /g, '-').toLowerCase()}`}
                }));
                setAuthedToken(true);
                loadStoreHTML(`https://${shopName}`);
              }
            })
            .catch(err => console.log('error auth session token:', err))
        })
        .catch(err=>console.log('Error getting token', err));
    }
    authenticateToken();
  },[]);

  if(!authedToken) return(<><SkelePage></SkelePage></>)


  // let pagesCopy = pages.map()
  // Options For Select
  const options = [
    {label: `Home    (https://${shopName})`, value: `https://${shopName}/`},
    {label: `All-Products    (https://${shopName}/collections/all)`, value: `https://${shopName}/collections/all`},
    ...pages.map(page=>page)
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
    let parsedTextField = textFieldValue.match('http')?textFieldValue:'https://'+textFieldValue;
    loadStoreHTML(parsedTextField); 
    // add the url to local storage if it's not there

    // FUNCTION TO GET RECENT URLS
    // console.log(window.localStorage.pages); 
    // let recentUrls;
    // if (window.localStorage.pages !== undefined){
    //   recentUrls = await JSON.parse(window.localStorage.pages);
    //   recentUrls.unshift(textFieldValue);
    // } else {
    //   recentUrls = [textFieldValue];
    // }
    // recentUrls = await JSON.stringify(recentUrls);
    // window.localStorage.setItem("pages", recentUrls);

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
    const sessionToken = await getSessionToken(app);
    await AddStyles(sessionToken, storeURL)
      .then(() => {
        setPublishedRes("Styles Have Been Published! 🎉")
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

    stylesElm.innerText = demoStyles() + styles();
    win.document.write(theHTML);
    win.document.close();
    win.document.addEventListener('DOMContentLoaded', () => {
      win.document.body.innerHTML += `<div style="z-index: 1000000;background: #6471C7;width: 100vw;height: 5vh;max-height: 25px;position: fixed;bottom: 0;box-shadow: 50px 50px 50px 30px grey;"> <p style="color: white;letter-spacing: 2px;width: max-content;margin: 0 auto;">Edits Preview </p></div>`;
      win.document.querySelector('body').appendChild(stylesElm);
    })    
  }



    // const [modalIsOpen,setIsOpen] = React.useState(false);
    // function openModal() {
    //   setIsOpen(true);
    // }
   
    // function afterOpenModal() {
    //   // references are now sync'd and can be accessed.
    // }
   
    // function closeModal(){
    //   setIsOpen(false);
    // }

    // try{
    //   if (window !== "undefined"){
    //     editorJS(); // ../../helpers/editor.js the editor function
    //     if( document.readyState !== 'loading' ) {
    //     } 
    //   }
    // }
    // catch{}
    



    // On Page Load We Get Store Home HTML
    // Initial state

    // useEffect(() => {

    //   var scrollPos = 0;

    //   // window.onscroll = (e) => {
    //   //   // let storePos = document.querySelector("#storeContainer").offsetTop;
    //   //   if(document.querySelector('#storeContainer') === null) return;
    //   //   if(window.pageYOffset > 180 ){
    //   //     // if (window.pageYOffset > 250 && (document.body.getBoundingClientRect()).top < scrollPos){
    //   //     if (window.pageYOffset > 250 && ( scrollPos - (document.body.getBoundingClientRect().top)) > 30){
    //   //       window.scrollTo(5000,document.body.scrollHeight);
    //   //       // window.scrollTo(5000, storePos);
    //   //       // alert('SCrolled!')
    //   //       document.querySelector('#storeContainer').style.width = window.innerWidth
    //   //       // document.querySelector("#AppFrameMain").style.paddingLeft = '0';
    //   //       // document.querySelector("#AppFrameNav").style.display = 'none';
    //   //     }
    //   //     document.querySelector('#storeContainer').classList.add('show');
    //   //   }
    //   //   else{
    //   //     document.querySelector('#storeContainer').classList.remove('show');
    //   //   }
    //   //   scrollPos = (document.body.getBoundingClientRect()).top
    //   // };

    //   console.log("storeName before loadStore", shopName);
    //   // Loading Home Page Up Initially 
    //   firstLoad ? loadStoreHTML(`https://${shopName}`) : '';

    //   console.log('Store URL:',storeURL);

    //   // // Other Option I Tried:
    //   // using a range so script tags will run (wont run using innerHTML, and easier than parsing and creating a script element in the DOM for reach)
    //   // let range = document.createRange();
    //   // range.setStart(document.querySelector("#storeHTML"), 0)
    //   // document.querySelector("#storeHTML").appendChild(
    //   //   range.createContextualFragment(`${props.plainSiteHTML}`)
    //   // )

    //   // loadStoreHTML('https://michael-t-dev.myshopify.com/');

    //   // // GETTING ALL SITE PAGES
    //   // var myHeaders = new Headers();
    //   // myHeaders.append("X-Shopify-Access-Token", process.env.SHOPIFY_ACCESS_TOKEN);
  
    //   // var requestOptions = {
    //   //   method: 'GET',
    //   //   headers: myHeaders
    //   // };
  
    //   // await fetch("https://michael-t-dev.myshopify.com/admin/api/2021-04/pages.json?published_status=published", requestOptions)
    //   //   .then(async (response) => {
    //   //     response = await response.json();
    //   //     console.log(response);
    //   //     let pagesArray = response.pages.map(page => {
    //   //       let title = page.title;
    //   //       title.replace(/[^a-zA-Z0-9_ ]/g, '').replace(/ /g, '-').toLowerCase(); // Turning Title Into URL
    //   //       return title
    //   //     });

    //   //     let pageSelectsString = '';

    //   //     response.pages.forEach(page => {
    //   //       let pageURL = page.title.replace(/[^a-zA-Z0-9_ ]/g, '').replace(/ /g, '-').toLowerCase(); // Turning Title Into URL
    //   //       pageSelectsString += `<option value="${pageURL}">${page.title}</option>`;
    //   //     });

    //   //     document.querySelector("#PolarisSelect1").innerHTML += pageSelectsString;

    //   //     console.log(pageSelectsString);
    //   //     return pageSelectsString;
    //   //   })
    //   //   .catch(error => console.log('error', error));

    //   // FUNCTION TO GET RECENT URLS
    //   // let options = window.localStorage.getItem("pages");
    //   // if(options && firstLoad){
    //   //   const setOptions = async () => {
    //   //     options = await JSON.parse(options);
    //   //     options = options.reduce((optionsArray, option) => {
    //   //       optionsArray.push({label: option, value: option});
    //   //       return optionsArray;
    //   //     }, []);
    //   //     setRecentOptions(options);
    //   //   }
    //   //   setOptions();
    //   //   alert('going')
    //   // }
    // });

    
    
    return (
      <>
        <Nav currentPage={0} setLoading={setLoading} app={app} shop={shopName} openTutorial={openTutorial} />
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
                <RadioButton
                  label="Apply Edits To This Page Only?"
                  helpText="They'll be added only to this one page, and overide any site-wide/multi-page styles."
                  checked={styleApplication === 'pageSpecific'}
                  id="pageSpecific"
                  name="styleApplication"
                  onChange={styleApplicationChange}
                />
                { storeURL.match(/\/products\/|\/collections\//g) ? 
                  <RadioButton
                  label={"Apply Edits To All " + storeURL.match(/\/products\/|\/collections\//)[0] + " Pages?"} 
                  helpText={"They'll be added to all "+storeURL.match(/\/products\/|\/collections\//)[0]+" pages, and overide any site wide styles."}
                  id="multiPage"
                  name="styleApplication"
                  checked={styleApplication === 'multiPage'}
                  onChange={styleApplicationChange}
                  /> : ''
                }
                <div style={{marginBottom:'10px'}}>
                  <RadioButton
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
              <TextField
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

        <Modal
          open={activeTutorial}
          onClose={closeTutorial}
          title="Editing Tutorial"
          large={true}
        >
          <Modal.Section>
          <div style={{position: "relative",paddingBottom: "50%", height: "0"}}><iframe type="text/html" allow="fullscreen;" src="https://www.youtube.com/embed/-ApZJsAEz2k?autoplay=1&modestbranding=1&rel=0&controls=1&fs=1" frameborder="0" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" style={{position:"absolute",top:"0",left:"0",width:"100%",height: "100%"}}></iframe></div>
            {/* <video src={video1} width="600" height="300" controls="controls" autoplay="true" /> */}
          </Modal.Section>
        </Modal>

        <Modal
          open={openPassword}
          onClose={closePassword}
          title="Enter Your Store Password To Load Store"
        >
          <Modal.Section>
            <Stack vertical>
              <TextField 
              onChange={updateStorePass}
              value={storePass}
              placeholder='your store password'
              />
              <Button primary onClick={savePassword}>Save Password</Button>
            </Stack>
          </Modal.Section>
        </Modal>

        { isLoading ?  
            <div style={{margin:"18% auto", width: "min-content"}}>
              < Spinner/>
            </div> :  
        <>        
        <div id="appMain">
        <div style={{width:"100%", background:"#f4f6f8"}}>
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
            <Select
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
            <TextField
              label="Or Paste The URL:"
              onChange={handleTextFieldChange}
              value={textFieldValue}
              labelAction={{content: 'Get your page', onClick: urlSearch}}
              // labelAction={loadStoreHTML(textFieldValue)}
              placeholder="https://myshopify.com/"
            />

            <Checkbox
              label="Edit For Mobile"
              checked={editMobileChecked}
              onChange={editForMobile}
            />
            { editMobileChecked? 
            <div>
              <Subheading>Apply Edits On:</Subheading> 
              {/* <div style={{display:'flex'}}> */}
              <Stack>
                <Select
                  // label="Current Page:"
                  // labelInline
                  options={optionsTwo}
                  onChange={handleSelectChangeTwo}
                  value={selectedTwo}
                  /> 
                  <TextField
                    type="number"
                    suffix="px"
                    disabled={selectedTwo==='Custom'?false:true}
                    onChange={handleXPxChange}
                    value={xPxValue}
                    placeholder={xPxValue}
                  />
                  {/* <div style={{marginTop:".5rem"}}>
                    <Heading>X</Heading>
                  </div>
                  <TextField
                    type="number"
                    suffix="px"
                    disabled={selectedTwo==='Custom'?false:true}
                    onChange={handleYPxChange}
                    value={yPxValue}
                    placeholder={yPxValue}
                  /> */}
              </Stack>
              {/* </div>              */}
              <Subheading>Wide Screens And Smaller.</Subheading> 
            </div>
            : ''
            }


              <div className="publishButton" ref={buttonRef}>
                <Button primary={true} size="large" onClick={handleOpen}>Publish Edits</Button>
              </div>
              <Link onClick={(e)=>preview(e)}> Preview Edits -></Link>
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
        </div>

        <div style={{margin:'auto', width:'min-content'}}>
          <BsArrowDown size={100}/>
        </div>
        
        <div style={{height:"100vh"}}>
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
                      If all fails, contact us at: support@easy-edits.com.
                    </p>
                  </TextContainer>
                </div>
                : ''}
                {/* { editMobileChecked ?<div style={{width:"10px", background:"#c7c7c7"}}></div>:''} */}
              </div>
              { editMobileChecked ?
              <div className="resizeBarX" onMouseDown={MobileResize.onDrag} >
                <div className='xBarCircleContainer'>
                  <div className="xBarCircle"></div>
                  <div className="xBarCircle"></div>
                  <div className="xBarCircle"></div>
                </div>
              </div>
              :''}
            </div>

            { editMobileChecked ?
            <div className="resizeBarY" onMouseDown={MobileResize.onDrag} >
                <div className='yBarCircleContainer'>
                  <div className="yBarCircle"></div>
                  <div className="yBarCircle"></div>
                  <div className="yBarCircle"></div>
                </div>
            </div>
            :''}


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
    </>
    )
  }






export default Home; 





























