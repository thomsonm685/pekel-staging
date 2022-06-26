

import dragElement from "./dragEditor";
import Color from "color";





// the exported function that runs on the client side and handles the editor functionality 
function editorJS(firstLoad,lowerModal=false){


// The document of the store-copy's iFrame
let frameDoc = document.querySelector("#storeFrame").contentDocument;

// Declaring variables 
let everything = frameDoc.querySelector("html").querySelectorAll("*");
let selector = '';
let selectorArray = [];
let bubbles = []; // other elements below the top one, in event bubbling
let firstElement = true;
let thisBubble = 0;

let allStylesArray = [];
let undoRedoIndex = -1;

let dragNotClick = false;

let selectorString = '';
// let mainStyles = document.querySelector("#mainStyles");
let mainStyles = frameDoc.querySelector("#mainStyles");

// Stuff For Media Querys
let forMobile = () => document.querySelectorAll(".Polaris-Checkbox__Input")[1].checked;
// let storeFrame = document.querySelector("#storeFrame");
const mediaWidth = () => document.querySelector("#storeFrame").offsetWidth;
// const mediaHeight = () => document.querySelector("#storeFrame").offsetHeight; // Not Using 

console.log('elm', mainStyles);
//  get the modal
let modal = document.querySelector("#modalContent");
// get the button to close the modal
let closeButton = document.querySelector(".close");
let editorInputs = modal.querySelectorAll("*");
let units = ['px', 'rem', 'em', '%']



//////////////////////////////////////



function isModalOrChild(element){
    console.log('element:', element);
    console.log('element.id:', element.id);

    for( ; ! element.id=== "appMain"; element = element.parentElement){
        if(element.id === "modalContent"){
            return true
        } else if(element === null || element.id === "appMain"){
            return false
        }
    }
}

// credit: https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
function glow(element){
    let op = 0.1,changedDisplay=false;
    // if(element.style.display==="")element.style.display='inline-block',changedDisplay=true;
    if(window.getComputedStyle(element).display === "inline")element.style.display='inline-block',changedDisplay=true;
    element.classList.toggle('glow');
    var timer = setInterval(function () {
        if (op >= 1){
            element.classList.remove('glow');
            if(changedDisplay)element.style.display="";
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.05;
    }, 18);
}


closeButton.onclick = function() {
  modal.style.display = "none";
}

function showModal(element, event, lower=false){    
    let app = document.querySelector("#appMain");
    let appMiddle = (app.offsetWidth / 2) + (window.innerWidth - app.offsetWidth);
    console.log('app middle:', appMiddle);
    event.clientX > appMiddle ? element.style.transform = `translate(${app.offsetWidth*0.002}px, ${lower?'56vh':'0px'})`: element.style.transform = `translate(${app.offsetWidth*0.637}px, ${lower?'56vh':'0px'})`
    element.style.display = "block";
}






function updateInputs(currentElm){
    for(let i = 0; i < editorInputs.length; i++){

        let inputElm = editorInputs[i];

        if(inputElm.classList.contains("editorInput") !== true) continue;

        if(inputElm.type === 'range') inputElm.onmousedown = (e) => {
            e.stopPropagation();
            console.log('Stopping??')
        }

        let elementProperty = window.getComputedStyle(currentElm)[editorInputs[i].getAttribute("js_data")];

        if(editorInputs[i].getAttribute("js_data") !== null & editorInputs[i].id !== 'elementRawCSS'){ // map or filter this
        for(let i =0; i < units.length; i++){
            if(elementProperty.search(units[i]) !== -1){
                editorInputs[i].setAttribute("unit", units[i]);
                elementProperty = elementProperty.replace(units[i], '');
            }
        }
        if(elementProperty.includes('rgb' || 'hsl' || 'rgb')){
            try{
                elementProperty = (Color(elementProperty)).hex()
            }
            catch(e){
                elementProperty = elementProperty;
            }                        
        }
            editorInputs[i].value = elementProperty;
        }


        if(inputElm.type === "checkbox"){
            (['normal'].includes(elementProperty)) ? inputElm.checked = false : inputElm.checked = true;// can add more if I use more checkboxes

            inputElm.onchange = (event) => { // on input event we're building the css for the change and adding it to the mainStyles tag
                let wholeStyle = inputElm.checked ? inputElm.getAttribute('style_on') : inputElm.getAttribute('style_off');
                let styling = `${selector}{ ${wholeStyle} !important; }`;
                styling = styling.replace(/\.activeElm|\.draggableCursor|\.draggingCursor|\.glow/g, '');
                styling = forMobile() === false ? styling : `@media (max-width: ${mediaWidth()}px){${styling}}`;
                if(allStylesArray[allStylesArray.length -1] === styling) return;
                undoRedoIndex +=1;
                allStylesArray.splice(undoRedoIndex);
                allStylesArray.push(styling);
                mainStyles.innerHTML += styling;
            }
        }
        else if(inputElm.getAttribute('js_data') === "boxShadow"){
            inputElm.onchange = (event) => { // on input event we're building the css for the change and adding it to the mainStyles tag
                if (inputElm.value === "") return;
                console.log('currentElm:', currentElm);
                let curShadow = window.getComputedStyle(currentElm)['boxShadow'].replace('inset', '');
                console.log('curShadow:', curShadow);
                if(curShadow === "none") curShadow = "rgb(0, 0, 0) 0px 0px 0px 0px";
                let shadowColor = curShadow.match(/r(.*?)\)/)[0];
                let shadowArray = curShadow.replace(/r(.*?)\) /, '').split(" ");
                console.log('shadowArray:', shadowArray);
                shadowArray.unshift(shadowColor);
                console.log("SHADOW ARRAY1", shadowArray);

                let unit = inputElm.getAttribute('unit') !== null ? unit = inputElm.getAttribute('unit') : unit = '';
                shadowArray[parseInt(inputElm.getAttribute('style_index'))] = `${inputElm.value}${unit}`;
                console.log("SHADOW ARRAY2", shadowArray);

                let styleProp = inputElm.getAttribute('style_data');
                let styling = `${selector}{ ${styleProp}: ${shadowArray.join(' ')} !important; }`;
                console.log("SHADOW ARRAY Joined:", shadowArray.join(' '));

                styling = styling.replace(/\.activeElm|\.draggableCursor|\.draggingCursor|\.glow/g, '');
                styling = forMobile() === false ? styling : `@media (max-width: ${mediaWidth()}px){${styling}}`;
                if(allStylesArray[allStylesArray.length -1] === styling) return;
                undoRedoIndex +=1;
                allStylesArray.splice(undoRedoIndex);
                allStylesArray.push(styling);
                mainStyles.innerHTML += styling;
            }
        }
        else if (inputElm.tagName === "INPUT" || inputElm.tagName === "SELECT") // for all input elements
        {
            // is box-shadow = 10px 10px

            //array = [0px, 0px, 0px, 0px, black]
            // current shadow array = []

             
            // color x y blur spread 

            // All the same
            // inputElm.type = "number" ? inputElm.value = activeElm.style[activeElm] : 
            // inputElm.type = "text" ? inputElm.value = activeElm.style[activeElm] : 
            // inputElm.type = "select" ? inputElm.value = activeElm.style[activeElm] : 
            
            // CHANGE EVENT TO INPUT, WHEN WE HAVE CODE TO FIND AND REMOVE OLD SELECTOR/STYLE
            inputElm.onchange = (event) => { // on input event we're building the css for the change and adding it to the mainStyles tag
                if (inputElm.value === "") return;
                let styleProp = inputElm.getAttribute('style_data');
                let unit = inputElm.getAttribute('unit') !== null ? unit = inputElm.getAttribute('unit') : unit = '';
                let styling = `${selector}{ ${styleProp}: ${inputElm.value}${unit} !important; }`;
                styling = styling.replace(/\.activeElm|\.draggableCursor|\.draggingCursor|\.glow/g, '');
                styling = forMobile() === false ? styling : `@media (max-width: ${mediaWidth()}px){${styling}}`;
                if(allStylesArray[allStylesArray.length -1] === styling) return;
                undoRedoIndex +=1;
                allStylesArray.splice(undoRedoIndex);
                allStylesArray.push(styling);
                mainStyles.innerHTML += styling;
            }
        } 
        else if(inputElm.tagName === "TEXTAREA")
        {
            inputElm.onchange = () => { // on input event we're building the css for the change and adding it to the mainStyles tag
                let styling = `${selector}{${inputElm.value} }`;
                styling = styling.replace(/\.activeElm|\.draggableCursor|\.draggingCursor|\.glow/g, '');
                styling = forMobile() === false ? styling : `@media (max-width: ${mediaWidth()}px){${styling}}`;
                // allStylesArray.unshift(styling);
                // allStylesArray.splice(0, undoRedoIndex+1, styling); undoRedoIndex -= 1;
                if(allStylesArray[allStylesArray.length -1] === styling) return;
                undoRedoIndex +=1;
                allStylesArray.splice(undoRedoIndex);
                allStylesArray.push(styling);
                console.log("PUSH SECOND");
                console.log('allStylesArray:', allStylesArray);
                mainStyles.innerHTML += styling;
                // mainStyles.innerHTML += styling;
            }
        }
    }
}



//  function to get element tag, and then class or ID (building out the elements css selector string)
function getElmSelector(elm){

    // adding the tagname first of all
    selectorString = [];
    selectorString.push(elm.tagName.toLowerCase());
    
    // if element has an ID, that's all we need
    if(elm.id)
    {
        selectorString.push(`#${elm.id}`)
        return selectorString.join('');  // We can stop here, with just the ID
    } 

    // function to compare two class lists, and see if the second contains all of the first
    const containsClasses = (classes, containingClasses) => {
        console.log("classes:", classes);
        const matchingClasses = [...classes].filter(curClass => containingClasses.contains(curClass));
        if (matchingClasses.length !== classes.length) return false;
        else return true;
    }

    // function to see if element is same type as sibling, and sibling has all of elements classes
    const isSameSibling = (elm, sibling) => { 
        if (!elm.tagName === sibling.tagName) return false // check if is same type
        if (!containsClasses(elm.classList, sibling.classList)) return false // check if contains classses
        else return true;
    }

    // define position, some true/false checks, and get the first sibling
    let pos = 0;
    let afterElm = false;
    let needsNthOfType = false;
    var sibling = elm.parentNode.firstChild;

    // Loop through each sibling and add to pos if it's of same type
    while (sibling) 
    {
        console.log('sibling:', sibling);
        if (sibling.nodeType === 1 && sibling !== elm && isSameSibling(elm, sibling)) {
            if(!afterElm) pos += 1;
            needsNthOfType = true;
        }
        else if(sibling === elm){
            afterElm = true;
            pos += 1;            
        }
        sibling = sibling.nextSibling
        if(!sibling && !needsNthOfType) pos = null; // if we don't have any sameSiblings, we dont need nth-pos
    }

    // add element classes to selector
    for (let i=0; i < elm.classList.length; i++)
    {
        let theClass = elm.classList[i];
        theClass = `.${theClass}`;
        selectorString.push(theClass);
    }

    // if needed, add nth-child to selector
    if(pos) selectorString.push(`:nth-child(${pos})`);

    // returning the whole selector string, i.e 'tagName + ID or Classes + possibly nth-child'
    return selectorString.join(''); 
}

// getSelectorArray: Get's the elements parent nodes and corresponding selectors
function getSelectorArray(elm){
    selectorArray = [];
    // for ( ; elm && elm !== document; elm = elm.parentNode ) { // moves through every one of the elements parent nodes
    for (let i=0; elm && elm !== frameDoc && i < 10; elm = elm.parentNode, i++ ) { // moves through every one of the elements parent nodes
        selectorArray.push(getElmSelector(elm)); // builds out the selector for each parent node
        if (elm.id) break; // If we have an ID, we can stop
    }
    return selectorArray; // an array of each of the elements parent nodes and their corrosponding css selectors
}


let activeElm;
// adding an eventlistenr to every element in the "everything variable", and on click, creating the selector array and showing the editor modal
for(let i = 0; i < everything.length -1; i++){
    let currentElm = everything[i];

    currentElm.addEventListener('click', function(event){
            if(currentElm.parentElement.tagName === "HTML"){
                // if we're at the end of elements
                event.preventDefault();   
                dragNotClick = false;
                return firstElement = true;
            } 
            else if (isModalOrChild(event.currentTarget)){
                event.preventDefault();   
                return
            } 
            else if(dragNotClick){
                // If we're dragging, then leave
                event.preventDefault();   
                return
            } 
            else if(firstElement === false){
                // if we're at the elements below the top (one we want)
                event.preventDefault();   
                bubbles.push(currentElm);
                return;
            } 
            else{
                // if we're at the top element

                //MAYBEEE???
                // if(currentElm.classList.contains("editorInput") !== true) return

                // THE DRAG AND DROP IS BUGGY, FEEL FREE TO MOVE ONTO OTHER STUFF
                // adding activeElm id and unchecking the draggable checked, if it's a new element
                let newElm = currentElm.classList.contains('activeElm') ? false : true;
                console.log('New Elm',newElm);
                if(frameDoc.querySelector('.activeElm') !== null && newElm) frameDoc.querySelector('.activeElm').classList.remove('activeElm');
                if(frameDoc.querySelector('.draggingCursor') !== null && newElm) frameDoc.querySelector('.draggingCursor').classList.remove('draggingCursor');
                currentElm.classList.add('activeElm');
                if(newElm && document.querySelectorAll(".Polaris-Checkbox__Input")[0].checked === true) {
                    document.querySelectorAll(".Polaris-Choice")[0].click();
                }

                bubbles = [];
                bubbles.push(currentElm);
                thisBubble = 0;
                firstElement = false;
                activeElm = currentElm;
                // event.stopPropagation();
                event.preventDefault();   
                glow(currentElm);
                selector =  `${getSelectorArray(currentElm).reverse().join(' > ')}` // creating element selector and css syntax
                console.log('SELECTOR:', selector);
                updateInputs(currentElm);
                showModal(modal, event, lowerModal);
                // modal.style.display = "block"; // showing editor modal
            }
        // }
    })

    //  Function To Make Elements Draggable
    dragElement(currentElm);

    function dragElement(elmnt) {

    let frameDoc = () => document.querySelector('#storeFrame').contentDocument;


    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    elmnt.onmousedown = dragMouseDown;

    const pxToNum = (stringPx) => stringPx === '' ? 0 : parseInt(stringPx.replace('px', ''));

    function dragMouseDown(e) {

        // If it's not the active element, or it isn't set to drag and drop, return
        if((elmnt.classList.contains('activeElm') && elmnt.classList.contains('draggingCursor')) !== true) return;

        elmnt.style.setProperty('position', 'relative', 'important');

        console.log('ELM:', elmnt);

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        frameDoc().onmouseup = closeDragElement;
        elmnt.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        frameDoc().onmousemove = elementDrag;
        elmnt.onmousemove = elementDrag;
        // document.onmouseup = closeDragElement;
        // // call a function whenever the cursor moves:
        // document.onmousemove = elementDrag;
    }

    function elementDrag(e) {

        dragNotClick = true;

        e = e || window.event;
        e.preventDefault();
        console.log('elmnt', elmnt);
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        // pos3 = e.clientX;
        // pos4 = e.clientY;

        // console.log('positions:', `${elmnt.offsetTop - pos2} - ${elmnt.offsetLeft - pos1}`)
        console.log('positions:', `${(pxToNum(elmnt.style.bottom) + pos2) + "px"} - ${(pxToNum(elmnt.style.right) + pos1) + "px"}`)

        // // set the element's new position:
        // elmnt.style.position = 'relative';
        // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        // set the element's new position:
        elmnt.style.position = 'relative !important'; 
        elmnt.style.setProperty('bottom', (pxToNum(window.getComputedStyle(elmnt).bottom) + pos2) + "px", 'important');
        // elmnt.style.bottom = (pxToNum(elmnt.style.bottom) + pos2) + "px !important";
        elmnt.style.setProperty('right', (pxToNum(window.getComputedStyle(elmnt).right) + pos1) + "px", 'important');
        // elmnt.style.right = (pxToNum(elmnt.style.right) + pos1) + "px !important";

        

        pos3 = e.clientX;
        pos4 = e.clientY;

        //  WRONG!!!! UPDATE LIKE BEFORE (THE ACTUAL ELM) ON DRAG, AND ON MOUSE UP ADD TO MAIN STYLES
    }

    function closeDragElement(e) {

        e = e || window.event;
        //  YOU NEED TO FIX SOME BUGS, INCLUDING: CAN'T SELECT AND MOVE A SECOND ELM, AND UN-CHECKING THE BOX ON A NEW ELM CLICK

        let styleBottom = elmnt.style.bottom;
        let styleRight = elmnt.style.right;
        let styling = `${selector}{ position: relative !important;}${selector}{ bottom: ${styleBottom} !important;}${selector}{ right: ${styleRight} !important;}`;
        styling = styling.replace(/.activeElm|\.draggableCursor|\.draggingCursor|\.glow/g, '');
        styling = forMobile() === false ? styling : `@media (max-width: ${mediaWidth()}px){${styling}}`;
        // allStylesArray.unshift(styling);
        console.log('styling:', styling);
        // allStylesArray.splice(0, undoRedoIndex+1, styling); undoRedoIndex -= 1;
        undoRedoIndex +=1;
        allStylesArray.splice(undoRedoIndex);
        allStylesArray.push(styling);

        mainStyles.innerHTML += styling;

        elmnt.style.bottom = "";
        elmnt.style.right = "";

        // stop moving when mouse button is released:
        frameDoc().onmouseup = null;
        frameDoc().onmousemove = null;
        elmnt.onmouseup = null;
        elmnt.onmousemove = null;

    }
    }
}







function shiftElement(increment){   
    if (bubbles.length === 1){
        console.log('no length');
        return;
    } 
    thisBubble += (increment);
    let currentElm = bubbles[thisBubble];
    if (currentElm === undefined){
        console.log('undefined current elm');
        return;
    } 
    // if (currentElm === undefined){
    //     console.log('undefined current.elm')
    //     console.log(bubbles);
    //     // return increment > 0 ? shiftElement(increment+1) : shiftElement(increment-1);
    // }
    // try and catch, for if we're unable to get computed styles (i.e if we hit the window elm)
    // try{ 
    //     console.log('right before')
    //     window.getComputedStyle(currentElm); 
    //     console.log('GOT computed styles for:', currentElm);
    // }
    // catch(err){ 
    //     console.log('cant get computed styles for:', currentElm); 
    //     shiftElement(increment+1);
    // }
    console.log('fine one')
    console.log('currentELM', currentElm)
    updateInputs(currentElm);
    activeElm = currentElm;
    // event.stopPropagation();
    console.log('fine two')
    glow(currentElm);
    selector =  `${getSelectorArray(currentElm).reverse().join(' > ')}` // creating element selector and css syntax
}

document.querySelector("#downElementArrow").addEventListener('click', function(){
    console.log('index:', thisBubble);
    console.log('bubbles array:', bubbles);
    if(thisBubble + 1 === bubbles.length){
        return;
    }else{
        console.log('shifting');
        shiftElement(1);
    } 
})
document.querySelector("#upElementArrow").addEventListener('click', function(){
    console.log('index:', thisBubble);
    console.log('bubbles array:', bubbles);
    if(thisBubble === 0){
        return;
    } else{
        shiftElement(-1);
    }
})

// index = -1
// *adds styles
// ['first_style']
// index = 0;
// *undo styles
// style = styles[index], replace from main styles with ''
// index = -1
// 
// * on style add
// index +1
// allStylesArray.splice(index)
// allStyles.push(style)

document.querySelector("#undoElementArrow").addEventListener('click', function(){
    console.log('allStylesArray', allStylesArray);
    if(undoRedoIndex === -1) return console.log('end of allStyles Array')
    else{
        console.log('still going')
        let thisStyle = allStylesArray[undoRedoIndex];
        console.log('thisStyle', thisStyle);
        console.log('undoRedoIndex', undoRedoIndex)
        mainStyles.innerText = mainStyles.innerText.replace(thisStyle, '');
        undoRedoIndex -= 1;
    }
})

document.querySelector("#redoElementArrow").addEventListener('click', function(){
    console.log('allStylesArray', allStylesArray);
    if(undoRedoIndex === (allStylesArray.length -1)) return ('end of allStyles Array')
    else{
        undoRedoIndex += 1;
        console.log('still going')
        let thisStyle = allStylesArray[undoRedoIndex];
        console.log('thisStyle', thisStyle)
        console.log('undoRedoIndex', undoRedoIndex)
        mainStyles.innerText += thisStyle;
    }
})







}


// exporting the whole function
export default editorJS