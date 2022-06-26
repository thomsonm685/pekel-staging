



import {Icon} from '@shopify/polaris';
import {MobilePlusMajor} from '@shopify/polaris-icons';

import { CgMathPlus } from 'react-icons/cg';


function Accordain(props){


    function openAndClose(element){
        if(element.classList.contains('opened')){
            element.classList.remove('opened');
            element.classList.add('closed');
        } else{
            element.classList.remove('closed');
            element.classList.add('opened');
        }
    }
    // const rotate = (elm) => { elm.style.transform === "rotate(45deg)" ? elm.style.transform = "rotate(90deg)" : elm.style.transform = "rotate(45deg)";}

    function rotate(elm){

        }



        // if(elm.style.transform === "rotate(45deg)"){
        //     elm.style.bottom = "6px"
        //     var deg = 45;  // initial opacity
        //     var timer = setInterval(function () {
        //         if (deg = 360){
        //             clearInterval(timer);
        //         }
        //         elm.style.transform = `rotate(${deg}deg)`;
        //         deg += (deg + .00005);
        //     }, 100);
        // }
        // else{
        //     elm.style.bottom = "3px"
        //     var deg = 360;  // initial opacity
        //     var timer = setInterval(function () {
        //         if (deg = 45){
        //             clearInterval(timer);
        //         }
        //         elm.style.transform = `rotate(${deg}deg)`;
        //         deg += (deg - .00005);
        //     }, 100);
        // }
    



    // const rotate = (elm) => {
    //     if(elm.style.transform === "rotate(45deg)"){
    //         elm.style.bottom = "6px"
    //         elm.style.transform = "rotate(90deg)"
    //     }
    //     else{
    //         elm.style.bottom = "3px"
    //         elm.style.transform = "rotate(45deg)"
    //     }
    // }

    const toggleView = (element) => {
        element.style.display === "none" ? element.style.display = "initial" : element.style.display = "none";
    }

    const toggleAccordian = (e)=> { // probably could just cycle through parents to h4 to make cleaner
        if(e.target.tagName === "H4"){
            console.log((e.target.childNodes[1].style.transform === "rotate(90deg)"))
            rotate(e.target.childNodes[1]);
            openAndClose(e.target.childNodes[1]);
            // e.target.childNodes[1].style.transform = 'rotate(45deg)'; // rotating open icon to "X"
            toggleView(e.target.nextSibling);
        } else{
            let element = e.target;
            for(let i=0; i < 50; i++){
                if(element.classList.contains('accordianH4')){
                    openAndClose(element.childNodes[1]);
                    toggleView(element.nextSibling);
                    return;
                } else {
                    element = element.parentElement
                }
            }
        }
        // else if(e.target.tagName === "svg"){
        //     rotate(e.target.parentElement);
        //     toggleView(e.target.parentElement.parentElement.nextSibling);
        // }
        // else if(e.target.tagName === "path"){
        //     rotate(e.target.parentElement.parentElement);
        //     toggleView(e.target.parentElement.parentElement.parentElement.nextSibling);
        // }
    }

    return(
        <>
        <h4 onClick={toggleAccordian} className="accordianH4" style={{marginTop:'16.5px'}}>
             {props.title}
             <div className="circle-plus closed">
                <div className="circle">
                    <div className="horizontal"></div>
                    <div className="vertical"></div>
                </div>
             </div>
             {/* <span className="accordianIcon" style={{float:'right', position: 'relative', bottom:'3px', color:'#000000'}}><CgMathPlus size={25}/></span> */}
        </h4>
        <div style={{display: "none", position:'relative', left:'5px'}}>
            {props.children}
        </div>
        </>
    )
}



export default Accordain