


let MobileResize = {};


MobileResize.onDrag = (e) => {
    let bar = e.target;
    document.onmousemove = draggingBar;
    document.onmouseup = closeDrag;

    function draggingBar(e){

        e.preventDefault();

        // limit it to 50px X 50px
        if ((e.clientX < 50 || e.clientY < 50)) return;

        let storeFrame = document.querySelector("#storeHorzContainer");
        let barX = document.querySelector(".resizeBarX");
        let barY = document.querySelector(".resizeBarY");

        // turn a style like '50px' into 50
        const pxToNum = (stringPx) => parseInt(stringPx.replace('px', ''));

        // If we're dragging the X bar
        if(bar === barX || bar.parentElement === barX || bar.parentElement.parentElement === barX){


            // We're stopping at 50px
            if(storeFrame.style.offsetWidth < 50 ) return;

            let leftPos = barX.getBoundingClientRect().x;
            let storeFrameLeft = storeFrame.getBoundingClientRect().x;

            // Automatically adds margin to center store frame when they reduce size
            storeFrame.style.marginLeft = `${(storeFrame.parentElement.offsetWidth - storeFrame.offsetWidth)/2}px`;
            barY.style.marginLeft = `${(storeFrame.parentElement.offsetWidth - storeFrame.offsetWidth)/2}px`;

            // Actually resizing when client drags bar
            storeFrame.style.width = `${e.clientX - storeFrameLeft}px` 
            barY.style.width = `${document.querySelector("#storeFrameContainer").offsetWidth}px`;

            // Update frame size in text inputs
            document.querySelectorAll('.Polaris-TextField__Input.Polaris-TextField__Input--suffixed')[0].value = `${document.querySelector('#storeFrame').offsetWidth - 2}`;
        }

        if(bar === barY || bar.parentElement === barY || bar.parentElement.parentElement === barY){

            // We're stopping at 50px
            if(storeFrame.style.offsetHeight < 50 ) return;

            let topPos = barY.getBoundingClientRect().y;
            let barBottom = pxToNum(barX.style.bottom);
            let storeFrameTop = storeFrame.getBoundingClientRect().y;

            // Actually resizing when client drags bar
            barY.style.bottom = `${barBottom + (topPos - e.clientY)}px`;
            storeFrame.style.height = `${e.clientY - storeFrameTop}px`;

            // Update frame size in text inputs
            // document.querySelectorAll('.Polaris-TextField__Input.Polaris-TextField__Input--suffixed')[1].value = `${document.querySelector('#storeFrame').offsetHeight}`;
        }
    }
    function closeDrag(e){
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

// // Function to resize store frame when they drag bars
// MobileResize.onDrag = (e) => {

//     // NEXT, ADD THE LOGIC FOR CREATING AND SUBMITTING MEDIA QUERYS USING STOREFRAME SIZE

//     e.preventDefault();

//     // limit it to 50px X 50px
//     if ((e.clientX < 50 || e.clientY < 50)) return;

//     let storeFrame = document.querySelector("#storeHorzContainer");
//     let barX = document.querySelector(".resizeBarX");
//     let barY = document.querySelector(".resizeBarY");

//     // turn a style like '50px' into 50
//     const pxToNum = (stringPx) => parseInt(stringPx.replace('px', ''));

//     // If we're dragging the X bar
//     if(e.target === barX){

//         // We're stopping at 50px
//         if(storeFrame.style.offsetWidth < 50 ) return;

//         let leftPos = barX.getBoundingClientRect().x;
//         let storeFrameLeft = storeFrame.getBoundingClientRect().x;

//         // Automatically adds margin to center store frame when they reduce size
//         storeFrame.style.marginLeft = `${(storeFrame.parentElement.offsetWidth - storeFrame.offsetWidth)/2}px`;
//         barY.style.marginLeft = `${(storeFrame.parentElement.offsetWidth - storeFrame.offsetWidth)/2}px`;

//         // Actually resizing when client drags bar
//         storeFrame.style.width = `${e.clientX - storeFrameLeft}px` 
//         barY.style.width = `${document.querySelector("#storeFrameContainer").offsetWidth}px`;

//         // Update frame size in text inputs
//         document.querySelectorAll('.Polaris-TextField__Input.Polaris-TextField__Input--suffixed')[0].value = `${document.querySelector('#storeFrame').offsetWidth}`;
//     }

//     if(e.target === barY){

//         // We're stopping at 50px
//         if(storeFrame.style.offsetHeight < 50 ) return;

//         let topPos = barY.getBoundingClientRect().y;
//         let barBottom = pxToNum(barX.style.bottom);
//         let storeFrameTop = storeFrame.getBoundingClientRect().y;

//         // Actually resizing when client drags bar
//         barY.style.bottom = `${barBottom + (topPos - e.clientY)}px`;
//         storeFrame.style.height = `${e.clientY - storeFrameTop}px`;

//         // Update frame size in text inputs
//         document.querySelectorAll('.Polaris-TextField__Input.Polaris-TextField__Input--suffixed')[1].value = `${document.querySelector('#storeFrame').offsetHeight}`;
//     }
// }




// !!!!!!!!!!!!!!!!!





    // MobileResize.onDrag = (elmnt) => {

    // var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // elmnt.onmousedown = dragMouseDown;

    // const pxToNum = (stringPx) => stringPx === '' ? 0 : parseInt(stringPx.replace('px', ''));

    // function dragMouseDown(e) {

    //     e = e || window.event;
    //     e.preventDefault();
    //     // get the mouse cursor position at startup:
    //     pos3 = e.clientX;
    //     pos4 = e.clientY;

    //     document.onmouseup = closeDragElement;document
    //     document.onmousemove = elementDrag;

    //     // frameDoc().onmouseup = closeDragElement;
    //     // elmnt.onmouseup = closeDragElement;
    //     // // call a function whenever the cursor moves:
    //     // frameDoc().onmousemove = elementDrag;
    //     // elmnt.onmousemove = elementDrag;

    // }

    // function elementDrag(e) {

    //     e = e || window.event;
    //     e.preventDefault();

    //     // limit it to 50px X 50px
    //     if ((e.clientX < 50 || e.clientY < 50)) return;

    //     let storeFrame = document.querySelector("#storeHorzContainer");
    //     let barX = document.querySelector(".resizeBarX");
    //     let barY = document.querySelector(".resizeBarY");

    //     // turn a style like '50px' into 50
    //     const pxToNum = (stringPx) => parseInt(stringPx.replace('px', ''));

    //     // If we're dragging the X bar
    //     if(elmnt === barX){

    //         // We're stopping at 50px
    //         if(storeFrame.style.offsetWidth < 50 ) return;

    //         let leftPos = barX.getBoundingClientRect().x;
    //         let storeFrameLeft = storeFrame.getBoundingClientRect().x;

    //         // Automatically adds margin to center store frame when they reduce size
    //         storeFrame.style.marginLeft = `${(storeFrame.parentElement.offsetWidth - storeFrame.offsetWidth)/2}px`;
    //         barY.style.marginLeft = `${(storeFrame.parentElement.offsetWidth - storeFrame.offsetWidth)/2}px`;

    //         // Actually resizing when client drags bar
    //         storeFrame.style.width = `${e.clientX - storeFrameLeft}px` 
    //         barY.style.width = `${document.querySelector("#storeFrameContainer").offsetWidth}px`;

    //         // Update frame size in text inputs
    //         document.querySelectorAll('.Polaris-TextField__Input.Polaris-TextField__Input--suffixed')[0].value = `${document.querySelector('#storeFrame').offsetWidth}`;
    //     }

    //     if(elmnt === barY){

    //         // We're stopping at 50px
    //         if(storeFrame.style.offsetHeight < 50 ) return;

    //         let topPos = barY.getBoundingClientRect().y;
    //         let barBottom = pxToNum(barX.style.bottom);
    //         let storeFrameTop = storeFrame.getBoundingClientRect().y;

    //         // Actually resizing when client drags bar
    //         barY.style.bottom = `${barBottom + (topPos - e.clientY)}px`;
    //         storeFrame.style.height = `${e.clientY - storeFrameTop}px`;

    //         // Update frame size in text inputs
    //         document.querySelectorAll('.Polaris-TextField__Input.Polaris-TextField__Input--suffixed')[1].value = `${document.querySelector('#storeFrame').offsetHeight}`;
    //     }

        


        
    //     // // calculate the new cursor position:
    //     // pos1 = pos3 - e.clientX;
    //     // pos2 = pos4 - e.clientY;
    //     // // pos3 = e.clientX;
    //     // // pos4 = e.clientY;

    //     // elmnt.style.position = 'relative !important'; 
    //     // elmnt.style.setProperty('bottom', (pxToNum(elmnt.style.bottom) + pos2) + "px", 'important');
    //     // // elmnt.style.bottom = (pxToNum(elmnt.style.bottom) + pos2) + "px !important";
    //     // elmnt.style.setProperty('right', (pxToNum(elmnt.style.right) + pos1) + "px", 'important');
    //     // // elmnt.style.right = (pxToNum(elmnt.style.right) + pos1) + "px !important";

        

    //     // pos3 = e.clientX;
    //     // pos4 = e.clientY;

    // }

    // function closeDragElement(e) {

    //     e = e || window.event;
    //     //  YOU NEED TO FIX SOME BUGS, INCLUDING: CAN'T SELECT AND MOVE A SECOND ELM, AND UN-CHECKING THE BOX ON A NEW ELM CLICK

    //     // stop moving when mouse button is released:document
    //     document.onmouseup = null;
    //     document.onmousemove = null;
    //     // frameDoc().onmouseup = null;
    //     // frameDoc().onmousemove = null;
    //     // elmnt.onmouseup = null;
    //     // elmnt.onmousemove = null;

    // }
    // }

export default MobileResize;