



import {ColorPicker} from '@shopify/polaris';
import React, { useState, useCallback } from 'react';

import  styles from '../css/app.module.css' ;


function EditorColorPicker() {
    // const [color, setColor] = useState({
    //   hue: 300,
    //   brightness: 1,
    //   saturation: 0.7,
    //   alpha: 0.7,
    // });
    // const handleChange = () => {
    // 
    // }
    return (
      <div>
        <input type="color" data="background-color" className={`elementColor ${styles.elementColor}`} name="elementColor"></input>
        <label name="elementColor">Color</label>
      </div>
    )
  }


  export default EditorColorPicker