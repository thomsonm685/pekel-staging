

import { useState } from "react";

const ModalNumberInput = ({label, labelFor, attsAndProps}) => {


    const increment = (e) => {
        let incBy;
        let numInput = e.target;
        while(!numInput.classList.contains('inputContainer')){
            if (numInput.getAttribute('tabIndex') !== null) incBy = parseInt(numInput.getAttribute('tabIndex'));
            numInput = numInput.parentElement;
        }
        if(parseInt(numInput.children[1].value) < 1 && incBy < 0) return;
        numInput.children[1].value = parseInt(numInput.children[1].value) + incBy;
        const event = new Event('change');  
        numInput.children[1].dispatchEvent(event);
    }

    return (

        <div className="inputContainer">
            <label htmlFor={labelFor}>{label}</label>

            <input {...attsAndProps}></input>

            <div className="Polaris-TextField__Spinner" aria-hidden="true">
                <div onClick={increment} role="button" className="Polaris-TextField__Segment incrementer"  tabIndex="1">
                    <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                        <path d="m15 12-5-5-5 5h10z"></path>
                    </svg>
                </div>
                <div onClick={increment} role="button" className="Polaris-TextField__Segment incrementer" tabIndex="-1">
                    <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
                        <path d="m5 8 5 5 5-5H5z"></path>
                    </svg>
                </div>
            </div>
        </div>
        
    )
}

export default ModalNumberInput;