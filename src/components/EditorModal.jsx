

// general imports
import {useEffect, useState} from 'react';
// polaris components
import {Form, FormLayout, Checkbox} from '@shopify/polaris';
//my components
import EditorColorPicker from './EditorColorPicker';
import Accordian from './accordian';
import EditorLine from './EditorLine';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import ArrowInput from './arrowInput';
import ModalNumberInput from './modalNumberInput'
// the css
import styles from '../css/app.module.css' ;
// Icons
import { CgCloseR } from 'react-icons/cg';
import { BiDownArrow, BiUpArrow } from 'react-icons/bi';
import { FaRedoAlt, FaUndoAlt } from 'react-icons/fa';




function EditorModal(){

  const [dragAndDropCheck, setDragAndDropCheck] = useState(false);

  const handleDragAndDrop = (newChecked) => {


    if(newChecked === true){
      document.querySelector("#storeFrame").contentDocument.querySelector(".activeElm").classList.add('draggingCursor');
    } else{
      if(document.querySelector("#storeFrame").contentDocument.querySelector(".draggingCursor") !== null)document.querySelector("#storeFrame").contentDocument.querySelector(".activeElm").classList.remove('draggingCursor');
    }
    // makeDraggable()
    // Make move on drag start|\.draggingCursor
    // Add relative styles on mouse up, or drag end, etc (it's fine if they drag and drop a ton, we'll parse the styles)

    setDragAndDropCheck(newChecked);
  }

  // draggingCursor

  function stopStuff(e){
    // e.stopPropagation(); 
  }

  useEffect(() => {

    let frameDoc = () => document.querySelector("#storeFrame").contentDocument;

    function dragElement(elmnt) {

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    elmnt.onmousedown = dragMouseDown;

    const pxToNum = (stringPx) => stringPx === '' ? 0 : parseInt(stringPx.replace('px', ''));

    function dragMouseDown(e) {


      // e.stopPropagation();

      // If it's not the active element, or it isn't set to drag and drop, return
      e = e || window.event;
      // e.preventDefault();
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
        console.log('elmnt.style.transform:', elmnt.style.transform);

        e = e || window.event;

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;

        let transX = elmnt.style.transform !== '' ? parseInt(elmnt.style.transform.match(/([0-9.]*?)(?=px)/g)[0]) : 0;
        let transY = elmnt.style.transform !== '' ? parseInt(elmnt.style.transform.match(/([0-9.]*?)(?=px)/g)[2]) : 0;

        console.log('transX', transX);
        console.log('transY', transY);
        console.log('pos1', pos1);
        console.log('pos2', pos2);
        console.log('X', pos1 + transX);
        console.log('Y', transY + pos2);

      // Not letting user drag modal out of view
      if(elmnt.getBoundingClientRect().right >  window.innerWidth){
        elmnt.style.transform = `translate(${transX - 20}px, ${transY}px)`;
        return
      }
      if(elmnt.getBoundingClientRect().bottom > window.innerHeight ){
        elmnt.style.transform = `translate(${transX}px, ${transY - 20}px)`;
        return
      }

      elmnt.style.transform = `translate(${transX - pos1}px, ${transY - pos2}px)`;      

      pos3 = e.clientX;
      pos4 = e.clientY;

    }

    function closeDragElement() {


        //  YOU NEED TO FIX SOME BUGS, INCLUDING: CAN'T SELECT AND MOVE A SECOND ELM, AND UN-CHECKING THE BOX ON A NEW ELM CLICK



        // stop moving when mouse button is released:
        frameDoc().onmouseup = null;
        frameDoc().onmousemove = null;
        elmnt.onmouseup = null;
        elmnt.onmousemove = null;
    }
    }
    dragElement(document.querySelector('#modalContent'));
  })
  
// MAKE DRAGGABLE WORK, MAYBE USE THING YoU DID FOR ELEMENTS INSTEAD OF DRAGGABLE FROM REACT
    return(

          <div id="modalContent" className={styles.modalContent} onMouseDown={stopStuff} >
            <div style={{display:'fixed'}}>
              <span className={`close`}>
                <CgCloseR />
              </span>
              <div style={{paddingBottom: "10px"}}>
                <div className="allArrowsContainer">
                  <div className="arrowsAndTitle">
                    <h4 className="arrowTitle" >Select Up/Down:</h4>
                    <div className="arrowsContainer" style={{position:'relative', top:'-5px'}}>
                      <span className="elementArrow" id="upElementArrow">
                        <BiUpArrow size={25} />
                      </span>
                      <span className="elementArrow" id="downElementArrow">
                        <BiDownArrow size={25} />
                      </span>
                    </div>
                  </div>
                
                  <div className="arrowsAndTitle">
                    <h4 className="arrowTitle" >Undo/Redo:</h4>
                    <div className="arrowsContainer" style={{position:'relative', top:'3px'}}>
                      <span className="elementUndo_Redo" id="undoElementArrow">
                        <FaUndoAlt size={18} />
                      </span>
                      <span className="elementUndo_Redo" id="redoElementArrow">
                        <FaRedoAlt size={18} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="thickBorder">
                  <Checkbox
                    label="Enable Drag And Drop"
                    checked={dragAndDropCheck}
                    onChange={handleDragAndDrop}
                  />
                </div>
              </div>
            </div>

            <Form noValidate>
              <FormLayout>
                <div className="thinBorder">
                  <Accordian title="Background/Opactiy">

                    <div className="inputContainer">
                      <label htmlFor="elementBackgroundColor">Background color:</label>
                      <input type="color" js_data="backgroundColor" style_data="background-color" unit="" className="elementBackgroundColor editorInput" name="elementBackgroundColor"></input>
                    </div>  
                    
                    <div className="inputContainer">
                      <label htmlFor="elementOpacity">Opactiy:</label>
                      <input type="range" min="0" max="1" step="0.05" js_data="opacity" style_data="opacity" unit="" className="elementOpacity editorInput" name="elementOpacity"></input>
                    </div>
                  </Accordian>
                </div>

                <div className="thickBorder">
                  <Accordian title="Text">

                    <div className="inputContainer">
                      <label htmlFor="elementColor">Color:</label>
                      <input type="color" id="elementColor" js_data="color" style_data="color" unit="" className="elementColor editorInput" name="elementColor"></input>
                    </div>

                    <ModalNumberInput 
                      label="Font size:"
                      labelFor="elementFontSize"
                      attsAndProps={{type:"number", js_data:"fontSize", style_data:"font-size", unit:"px", className:"elementFontSize editorInput", name:"elementFontSize"}} 
                    /> 
                  
                    {/* <div className="inputContainer">
                      <label htmlFor="elementFontSize">Font-size:</label>
                      <input type="number" js_data="fontSize" style_data="font-size" unit="px" className="elementFontSize editorInput" name="elementFontSize"></input>
                    </div> */}
                    
                    <div className="inputContainer">
                    <label htmlFor="elementFontWeight">Font-weight:</label>
                      <select js_data="fontWeight" style_data="font-weight" name="elementFontWeight" className="editorInput" >
                        <option value="100">Thin</option>
                        <option value="200">Extra Light</option>
                        <option value="300">Light</option>
                        <option value="400">Normal</option>
                        <option value="500">Medium</option>
                        <option value="600">Semi Bold</option>
                        <option value="700">Bold</option>
                        <option value="800">Extra Bold</option>
                        <option value="900">Black</option>
                      </select>
                    </div>
                    
                    <div className="inputContainer">
                      <label htmlFor="elementLineHeight">Line height:</label>
                      <input type="range" min="0" max="300" step="1" js_data="lineHeight" style_data="line-height" unit="px" className="elementLineHeight editorInput" name="elementLineHeight"></input>                    
                    </div>
                    
                    <div className="inputContainer">
                      <label htmlFor="elementLetterSpacing">Letter spacing:</label>
                      <input type="range" min="0" max="40" step=".25" js_data="letterSpacing" style_data="letter-spacing" unit="px" className="elementLetterSpacing editorInput" name="elementLetterSpacing"></input>                    
                    </div>
                    
                    <div className="inputContainer">
                      <label htmlFor="elementWordSpacing">Word spacing:</label>
                      <input type="range" min="0" max="400" step=".25" js_data="wordSpacing" style_data="word-spacing" unit="px" className="elementWordSpacing editorInput" name="elementWordSpacing"></input>                    
                    </div>
                    
                    <div className="inputContainer">
                      <label htmlFor="elementTextAllignment">Font-alignment:</label>
                      <select js_data="textAlign" style_data="text-align" name="elementTextAllignment" className="editorInput" >
                        <option value="right">Right</option>
                        <option value="center">Center</option>
                        <option value="left">Left</option>
                        <option value="justify">Justify</option>
                      </select>
                    </div>
                    
                    <div className="inputContainer">
                      <input type="checkbox" style_on="font-style: italic" style_off="font-style: normal" js_data="font-style" className="elementFontStyle editorInput" id="elementFontStyle" name="elementFontStyle"></input>
                      <label htmlFor="elementFontStyle">Italic</label>                    
                    </div>
                    
                    <div className="inputContainer">
                      <label htmlFor="elementTextDecoration">Text decoration:</label>
                      <select js_data="textDecoration" style_data="text-decoration" name="elementTextDecoration" className="editorInput">
                        <option value="none">None</option>
                        <option value="underline">Underline</option>
                        <option value="overline">Overline</option>
                        <option value="underline overline">Under/Overline</option>
                        <option value="line-through">Strike</option>
                      </select>
                    </div>
                    
                    <div className="inputContainer">
                      <label htmlFor="elementDecorationColor">Decoration color:</label>
                      <input type="color" js_data="textDecorationColor" style_data="text-decoration-color"  name="elementDecorationColor" className="editorInput"></input>
                    </div>
                    
                  </Accordian>
                </div>
                
                <div className="thinBorder">
                  <Accordian title="Border/Shadow">
                    <div className="inputContainer">
                      <label htmlFor="elementBorder">Border:</label>
                      <select js_data="borderStyle" style_data="border-style" name="elementBorder" className="editorInput">
                        <option value="none">None</option>
                        <option value="solid">Solid</option>
                        <option value="dotted">Dotted</option>
                        <option value="dashed">Dashed</option>
                        <option value="double">Double</option>
                      </select>
                    </div>
                    {/* <input type="checkbox" js_data="border" style_data="border" value="solid" name="elementBorder" id="elementBorder" className="editorInput"></input> */}

                    
                    <ModalNumberInput 
                      label="Border width:"
                      labelFor="elementBorderSize"
                      attsAndProps={{type:"number", js_data:"borderWidth", style_data:"border-width", unit:"px", className:"elementFontSize editorInput", name:"elementBorderSize"}} 
                    /> 
                    {/* <div className="inputContainer">
                      <label htmlFor="elementBorderSize">Border width:</label>
                      <input type="number" js_data="borderWidth" style_data="border-width" unit="px" className="elementFontSize editorInput" name="elementBorderSize"></input>
                    </div> */}
                    
                    <div className="inputContainer">
                      <label htmlFor="elementBorderColor">Border color:</label>
                      <input type="color" js_data="borderColor" style_data="border-color" unit=""  name="elementBorderColor" className="editorInput"></input>
                    </div>
                    
                    <ModalNumberInput 
                      label="Border radius:"
                      labelFor="elementBorderRadius"
                      attsAndProps={{type:"number", js_data:"borderRadius", style_data:"border-radius", unit:"px",  name:"elementBorderRadius", className:"editorInput"}} 
                    /> 
                    {/* <div className="inputContainer">
                      <label htmlFor="elementBorderRadius">Border radius:</label>
                      <input type="number" js_data="borderRadius" style_data="border-radius" unit="px"  name="elementBorderRadius" className="editorInput"></input>
                    </div> */}
                    
                    <div className="inputContainer">
                      <label htmlFor="elementShadowX">Shadow x:</label>
                      <input type="range" min="-200" max="200" step=".25" js_data="boxShadow" style_data="box-shadow" style_index="1" unit="px"  name="elementShadowX" className="editorInput"></input>
                    </div>
                    
                    <div className="inputContainer">
                      <label htmlFor="elementShadowY">Shadow y:</label>
                      <input type="range" min="-200" max="200" step=".25" js_data="boxShadow" style_data="box-shadow" style_index="2" unit="px"  name="elementShadowY" className="editorInput"></input>
                    </div>
                    
                    <div className="inputContainer">
                      <label htmlFor="elementShadowBlur">Shadow blur:</label>
                      <input type="range" min="0" max="100" step=".25" js_data="boxShadow" style_data="box-shadow" style_index="3" unit="px"  name="elementShadowBlur" className="editorInput"></input>
                    </div>  
                    
                    <div className="inputContainer">
                      <label htmlFor="elementShadowSpread">Shadow spread:</label>
                      <input type="range" min="0" max="100" step=".25" js_data="boxShadow" style_data="box-shadow" unit="px" style_index="4"  name="elementShadowSpread" className="editorInput"></input>
                    </div>
                    
                    <div className="inputContainer">
                      <label htmlFor="elementShadowColor">Shadow color:</label>
                      <input type="color" js_data="boxShadow" style_data="box-shadow" name="elementShadowColor" style_index="0" className="editorInput"></input>
                    </div>
                    
                  </Accordian>
                </div>
                
                <div className="thickBorder">
                  <Accordian title="Spacing">

                    <label>Margin:</label>
                    <div className="spacingInputContainer">
                      <div className="spacingInputTop">
                        <ModalNumberInput 
                          label=""
                          labelFor=""
                          attsAndProps={{type:"number", js_data:"marginTop", style_data:"margin-top", unit:"px",  name:"elementMarginTop", className:"editorInput"}} 
                        /> 
                      </div>
                      <div className="spacingInputLeft">
                        <ModalNumberInput 
                          label=""
                          labelFor=""
                          attsAndProps={{type:"number", js_data:"marginLeft", style_data:"margin-left", unit:"px",  name:"elementMarginLeft", className:"editorInput"}} 
                        /> 
                      </div>
                      <div className="spacingInputRight">
                        <ModalNumberInput 
                          label=""
                          labelFor=""
                          attsAndProps={{type:"number", js_data:"marginRight", style_data:"margin-right", unit:"px",  name:"elementMarginRight", className:"editorInput"}} 
                        /> 
                      </div>
                      <div className="spacingInputBottom">
                        <ModalNumberInput 
                          label=""
                          labelFor=""
                          attsAndProps={{type:"number", js_data:"marginBottom", style_data:"margin-bottom", unit:"px",  name:"elementMarginBottom", className:"editorInput"}} 
                        /> 
                      </div>
                    </div>
                    
                    {/* <input type="number" js_data="marginLeft" style_data="margin-left" unit="px"  name="elementMarginLeft" className="editorInput"></input> */}
                    {/* <input type="number" js_data="marginTop" style_data="margin-top" unit="px"  name="elementMarginTop" className="editorInput"></input> */}
                    {/* <input type="number" js_data="marginRight" style_data="margin-right" unit="px"  name="elementMarginRight" className="editorInput"></input> */}
                    {/* <input type="number" js_data="marginBottom" style_data="margin-bottom" unit="px"  name="elementMarginBottom" className="editorInput"></input> */}

                    <label>Padding:</label>
                    <div>
                      <div className="spacingInputTop">
                        <ModalNumberInput 
                          label=""
                          labelFor=""
                          attsAndProps={{type:"number", js_data:"paddingLeft", style_data:"padding-left", unit:"px",  name:"elementMarginLeft", className:"editorInput"}} 
                        /> 
                      </div>
                      <div className="spacingInputLeft">
                        <ModalNumberInput 
                          label=""
                          labelFor=""
                          attsAndProps={{type:"number", js_data:"paddingTop", style_data:"padding-top", unit:"px",  name:"elementMarginTop", className:"editorInput"}} 
                        /> 
                      </div>
                      <div className="spacingInputRight">
                        <ModalNumberInput 
                          label=""
                          labelFor=""
                          attsAndProps={{type:"number", js_data:"paddingRight", style_data:"padding-right", unit:"px",  name:"elementMarginRight", className:"editorInput"}} 
                        /> 
                      </div>
                      <div className="spacingInputBottom">
                        <ModalNumberInput 
                          label=""
                          labelFor=""
                          attsAndProps={{type:"number", js_data:"paddingBottom", style_data:"padding-bottom", unit:"px",  name:"elementMarginBottom", className:"editorInput"}} 
                        /> 
                      </div>
                    </div>

                    {/* <input type="number" js_data="paddingLeft" style_data="padding-left" unit="px"  name="elementMarginLeft" className="editorInput"></input>
                    <input type="number" js_data="paddingTop" style_data="padding-top" unit="px"  name="elementMarginTop" className="editorInput"></input>
                    <input type="number" js_data="paddingRight" style_data="padding-right" unit="px"  name="elementMarginRight" className="editorInput"></input>
                    <input type="number" js_data="paddingBottom" style_data="padding-bottom" unit="px"  name="elementMarginBottom" className="editorInput"></input> */}
                  </Accordian>
                </div>

{/*                 
                <div className="thickBorder">
                  <Accordian title="Position">
                     <label htmlFor="elementZIndex">Send Forward/Back</label>
                    <input type="number" js_data="zIndex" style_data="z-index" unit=""  name="elementZIndex" className="editorInput"></input> 
                    <ArrowInput name="elementZIndex" js_data="zIndex" style_data="z-index" unit=""></ArrowInput>
                     <label htmlFor="elementRelative">Use Relative Positioning</label>
                    <input type="checkbox" js_data="position" style_data="position" value="relative" id="elementRelative" name="elementRelative" className="editorInput"></input>
                    <label htmlFor="elementPositionLeft">Position</label>
                    <input type="number" js_data="left" style_data="left" unit="px"  name="elementPositionLeft" className="editorInput"></input>
                    <input type="number" js_data="top" style_data="top" unit="px"  name="elementPositionTop" className="editorInput"></input>
                    <input type="number" js_data="right" style_data="right" unit="px"  name="elementPositionRight" className="editorInput"></input>
                    <input type="number" js_data="bottom" style_data="bottom" unit="px"  name="elementPositionBottom" className="editorInput"></input> 
                  </Accordian>
                </div> */}

                <div className="thinBorder">                
                  <Accordian title="Sizing">
                  <ModalNumberInput 
                          label="Width"
                          labelFor="elementWidth"
                          attsAndProps={{type:"number", js_data:"width", style_data:"width", unit:"px",  name:"elementWidth", className:"editorInput"}} 
                  /> 
                  {/* <div className="inputContainer">
                    <label htmlFor="elementWidth">Width:</label>
                    <input type="number" js_data="width" style_data="width" unit="px"  name="elementWidth" className="editorInput"></input>
                   </div> */}

                  <ModalNumberInput 
                          label="Height:"
                          labelFor="elementHeight"
                          attsAndProps={{type:"number", js_data:"height", style_data:"height", unit:"px",  name:"elementHeight", className:"editorInput"}} 
                  /> 
                  {/* <div className="inputContainer"> 
                    <label htmlFor="elementHeight">Height:</label>
                    <input type="number" js_data="height" style_data="height" unit="px"  name="elementHeight" className="editorInput"></input>
                  </div> */}
                  </Accordian>
                </div>

                <div className="">
                  <Accordian title="Display/Position">
                  <ArrowInput name="elementZIndex" js_data="zIndex" style_data="z-index" unit=""></ArrowInput>
                    <div className="inputContainer">
                    <label htmlFor="elementTextDecoration">Display:</label>
                      <select js_data="display" style_data="display" name="elementDisplay" className="editorInput">
                        <option value="initial">Inital</option>
                        <option value="none">None</option>
                        <option value="inline">Inline</option>
                        <option value="block">Block</option>
                        <option value="inline-block">Inline-Block</option>
                      </select>
                    </div>
                  </Accordian>
                </div>

                
                {/* <Accordian title="Raw CSS">
                  <label htmlFor="elementRawCSS">Write your raw/plain CSS here:</label>
                  <textarea name="elementRawCSS" id="elementRawCSS" js_data="" style_data="" className="editorInput"></textarea>
                </Accordian> */}

              </FormLayout>
            </Form>
            <div style={{position:"fixed", WebkitBoxShadow:"0px 200px 24px 8px rgba(243,50,243,1)", 
boxShadow: "0px 200px 24px 8px rgba(243,50,243,1)"}}></div>
        </div>

      
    )
}

export default EditorModal


/* <TextField
value={}
onChange={}
label="App URL"
type="url"
/> */