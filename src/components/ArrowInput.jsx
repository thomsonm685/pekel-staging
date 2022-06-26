


import { HiArrowNarrowUp, HiArrowNarrowDown } from 'react-icons/hi';


function ArrowInput({name, js_data, style_data, unit}){ 

    // getting number input
    const numInput = () => document.querySelector("#zIndexInput");
    
    const plusOne = (e) => {
        numInput().value = (+numInput().value + +"1");
        let event = new Event('change', { bubbles: true, cancelable: true,});
        numInput().dispatchEvent(event);
    }
    const minusOne = (e) => {
        numInput().value = (+numInput().value + -"1");
        let event = new Event('change', { bubbles: true, cancelable: true,});
        numInput().dispatchEvent(event);
    }

    return(
        <>  
            <label htmlFor={name}>Send Forward/Back</label>
            <input hidden type="number" js_data={js_data} style_data={style_data} unit={unit}  name={name} className="editorInput" id="zIndexInput"></input>
            <span className="elementArrow" onClick={plusOne}>
                  <HiArrowNarrowUp size={25} />
            </span>
            <span className="elementArrow" onClick={minusOne}>
                <HiArrowNarrowDown size={25} />
            </span>
        </>
    )
}



export default ArrowInput