


const CSSParser = function (oldStyles, newStyles, pageURL, styleApplication){

    console.log('oldStyles 1:',oldStyles)
    // Joining New And Old Styles:
    // create dynamic regex for URL and liquid. 
    // let urlTag = new RegExp(`(?<={%- if canonical_url == "${pageURL}" -%})(.*?)(?={%- endif -%})`,"g");
    // let urlTagAll = new RegExp(`({%- if canonical_url == "${pageURL}" -%})(.*?)({%- endif -%})`,"g");
    let urlTag = styleApplication === 'pageSpecific' ? 
        new RegExp(`(?<={%- if canonical_url == "${pageURL}" -%})(.*?)(?={%- endif -%})`,"g") :
        new RegExp(`(?<={%- if canonical_url contains "${pageURL}" -%})(.*?)(?={%- endif -%})`,"g");

    let urlTagAll = styleApplication === 'pageSpecific' ? 
        new RegExp(`({%- if canonical_url == "${pageURL}" -%})(.*?)({%- endif -%})`,"g") :
        new RegExp(`({%- if canonical_url contains "${pageURL}" -%})(.*?)({%- endif -%})`,"g");

    // otherPageStyles = the old styles with the regex match removed, oldStyles = the regex match(in between)
    let otherPageStyles = oldStyles === null ? null : oldStyles.replace(urlTagAll, '');
    oldStyles = oldStyles === null ? null : oldStyles.match(urlTag);
    console.log('oldStyles 2:',oldStyles)

    // if no regex max, then parsedStyles = oldStyles += {% url stuff %}newStyles{% endStuff %}
    let stylesToBeParsed = oldStyles === null ? newStyles : oldStyles + newStyles;
    // oldAndNewStyles = oldStyles + newStyles     (creating one big string)
    console.log('stylesToBeParsed', stylesToBeParsed);
    console.log('otherPageStyles', otherPageStyles);


    // remove #activeElm with regex draggingCursor
    stylesToBeParsed = stylesToBeParsed.replace(/\.activeElm|\.draggableCursor|\.draggingCursor|\.glow/g, '');
    // use regex to get arrays of arrays for each selector (for @media query, get from before@ to just before second {. For styles, remove the second '}' from each, and when joining array, add back second '}' at end.)
    // create array of strings (selectors), with media querys last
    let mediaQuerys = stylesToBeParsed.match(/(@media)(.*?)(}})/g);
    stylesToBeParsed = stylesToBeParsed.replace(/(@media)(.*?)(}})/g, '');
    let notMediaQuerys = [stylesToBeParsed.match(/(.*?)(})/)[0]];
    stylesToBeParsed.match(/(?<=})(.*?)(})/g) ? notMediaQuerys.push(...stylesToBeParsed.match(/(?<=})(.*?)(})/g)) : null;

    const selectorAndStylesParser = (selectorAndStyles) => {
        // For parsing style string into: [['selector','style', 'style'], ['selector', 'style', 'style'] etc... ]
        let endArray = [];

        console.log('STARTING selectorAndStylesParser');

        while(selectorAndStyles.length !== 0){ 
            let style = selectorAndStyles[0];
            console.log('style:', style);
            let selector = style.match(/(.*?)(?={)/)[0]
                console.log('selector:', selector);

                endArray.push(selectorAndStyles.reduce((selectorArray, newStyle, i) => {
                if(i===0) selectorArray.push(selector);
                if(newStyle.includes(selector)){
                    // ADD IN LOGIC FOR IN CASE IT'S MULTIPLE STYLES AND ONE SELECTOR
                    newStyle = newStyle.replace(selector, ''); 
                    if(newStyle.match(/;/g).length > 1){
                        let someStyles = newStyle.match(/(\s)(.*?)(;)/g);
                        someStyles.forEach((style) => selectorArray.push(`{${style}}`));
                    } else{
                        selectorArray.push(newStyle);
                    }
                    // selectorArray.push(newStyle.replace(selector, ''));
                }
                console.log('selectorArray:', selectorArray);
                return selectorArray;
            }, []));
            selectorAndStyles = selectorAndStyles.filter((string) => !string.includes(selector));
        }

        return endArray;
    }

    const mediaSelectorAndStylesParser = (selectorAndStyles) => {
        console.log('MEDIA BEFORE', selectorAndStyles);
        // For parsing media style strings array (['@media{selector{style}}', '@media{selector{style}}']), into: [['@media', ['selector', 'style', 'style']], etc...]
        let endArray = [];
        while(selectorAndStyles.length !== 0){ 
            let style = selectorAndStyles[0];
            let query = style.match(/(.*?)(?={)/)[0]
                endArray.push(selectorAndStyles.reduce((selectorArray, newStyle, i) => {
                if(i===0) selectorArray.push(query);
                if(newStyle.includes(query)){
                    console.log("HEre 1", newStyle.match(/(?<={)(.*?)(})/)[0])
                    selectorArray.push(newStyle.match(/(?<={)(.*?)(})/)[0]);
                    if(newStyle.match(/(?<=})(.*?)(;})/g) !== null){
                        newStyle.match(/(?<=})(.*?)(;})/g).forEach((style) => selectorArray.push(style));
                    }
                }
                return selectorArray;
            }, []));




            console.log("selectorAndStyles BEfore", selectorAndStyles);
            selectorAndStyles = selectorAndStyles.filter((string) => !string.includes(query));
            console.log("selectorAndStyles After", selectorAndStyles);
        }

        console.log('endArray BEfore map', endArray)
        endArray = endArray.map((array) => {    
            console.log('Array of endArray, before', array)
        
            let selectorAndStylesArray = array.slice(1);

            selectorAndStylesArray = selectorAndStylesParser(selectorAndStylesArray);
        
            console.log('Array of endArray, after', [array[0], selectorAndStylesArray])

            return array = [array[0], selectorAndStylesArray];
        })

        console.log('endArray After map', endArray)

        return endArray;
    }

    const slimStyles = (selectorAndStylesArrays) => {

        let endArray = [];
        for(let i=0; i<selectorAndStylesArrays.length; i++){
            let selectorArray = selectorAndStylesArrays[i];
            // create new empty array
            // for each style, delete from others (remeber media) and format so you can .join() and have styles 
            // start from first, if array.slice(), (one ahead), includes the prop, then skip that one. If not, push to new array.
            let aParsedStyle = selectorArray.reduce((array, style, i) => {
                console.log('style', style);
                if(i===0){
                    array.push(style);
                    array.push('{');
                    return array;
                }
        
                if(selectorArray.slice(i+1).filter((item) => item.includes(style.match(/({)(.*?)(:)/g)[0])).length > 0){
                    return array;
                } 
                else{
                    array.push(style.replace(/{|}|(?<=;)(.*)/g,''));
                    return array;
                }
        
            }, []);
            aParsedStyle.push('}');
            aParsedStyle = aParsedStyle.join('');
            endArray.push(aParsedStyle);
            // .join that selector array and add to master array of new styles. Then .join that array to have compiled new styles.
        }
        return endArray;
    }



    // parsing all styles that arent media querys
    let notQueryStyles = '';
    if(notMediaQuerys !== null)
    {
        console.log('notMediaQuerys:',notMediaQuerys)
        let notMediaQuerysArray = selectorAndStylesParser(notMediaQuerys);
        console.log('notMediaQuerysArray:',notMediaQuerysArray)
        notQueryStyles = slimStyles(notMediaQuerysArray);
        // parsed not-query styles
        notQueryStyles = notQueryStyles.join('');
    }

    // parsing all media query styles
    let queryStyles = '';
    if(mediaQuerys !== null){
        console.log('mediaQuerys', mediaQuerys);
        let mediaQuerysArray = mediaSelectorAndStylesParser(mediaQuerys);
        console.log('mediaQuerysArray', mediaQuerysArray);
        queryStyles = mediaQuerysArray.map((queryAndArray) => {
            console.log('BOO BEFORE', queryAndArray)
            queryAndArray[1] = slimStyles(queryAndArray[1]);
            console.log('BOO', queryAndArray)
            return queryAndArray;
        })
        // parsed query styles
        queryStyles = queryStyles.map((queryArray) => {
            console.log('youre #1', queryArray[1]);
            queryArray[1] = queryArray[1].join('');
            queryArray.splice(1,0,'{');
            queryArray.push('}');
            queryArray = queryArray.join('');
            return queryArray;
        });
        let queryArray = queryStyles.reduce((sortedArray, newQuery) => {
            // Sorting the media querys from highest to lowest
            const queryToNum = (query) => parseInt(query.match(/(?<=:\s)(.*?)(?=px)/)[0]);
            let index = 0;
            while(index < sortedArray.length && queryToNum(newQuery) < queryToNum(sortedArray[index])) index++;
            sortedArray.splice(index, 0, newQuery);
            return sortedArray;
        }, []);
        queryStyles = queryArray.join('');
    }


    let parsedStyles = (notQueryStyles||'') + (queryStyles||'');

    // depending on style application, we change the url and how it's matched
    let finalStyles;
    if(styleApplication === 'pageSpecific') {
        if(otherPageStyles !== null){
            finalStyles = `${otherPageStyles} {%- if canonical_url == "${pageURL}" -%}${parsedStyles}{%- endif -%}`;
        } else{
            finalStyles = `{%- if canonical_url == "${pageURL}" -%}${parsedStyles}{%- endif -%}`;
        }
    } else {
        if(otherPageStyles !== null){
            finalStyles = `${otherPageStyles} {%- if canonical_url contains "${pageURL}" -%}${parsedStyles}{%- endif -%}`;
        } else{
            finalStyles = `{%- if canonical_url contains "${pageURL}" -%}${parsedStyles}{%- endif -%}`;
        }    
    }

    // data base styles are just the new styles and any styles under the same url
    let databaseStyles;
    if(styleApplication === 'pageSpecific') {
        databaseStyles = `{%- if canonical_url == "${pageURL}" -%}${parsedStyles}{%- endif -%}`;
    } else {
        databaseStyles = `{%- if canonical_url contains "${pageURL}" -%}${parsedStyles}{%- endif -%}`;
    }

    // Sorting final styles by: site wide canicol urls, mutli-page, then page specific
    let sortedUrlArray = [];
    for(let i=0; i<3; i++){
        sortedUrlArray.push(
            finalStyles.match(/({%-)(.*?)(endif -%})/g).reduce((newArray, currentStyle) => {
                if(i===0){
                    // if it's site wide
                    if(currentStyle.match(/"(.*?)"/)[0] === "\"http\"") newArray.push(currentStyle);
                }
                if(i===1){
                    // if it's multi page
                    if(currentStyle.match(/"(.*?)"/)[0][1] === "/") newArray.push(currentStyle);
                }
                if(i===2){
                    // if it's page specific
                    if(currentStyle.match(/"(.*?)"/)[0].includes('.')) newArray.push(currentStyle);
                }
                return newArray;
            }, []).join('')
        )
    }

    finalStyles = sortedUrlArray.join('');

    console.log('finalStyles', finalStyles)


    // finalStyles = finalStyles.match(/({%-)(.*?)(endif -%})/g).reduce((newArray, currentStyle) => {

    //     if (newArray.includes(currentStyle)) return newArray;

    //     else if()


    //     return newArray;
    // }, []);





    // let finalStyles = styleApplication === 'multiPage' ? `${otherPageStyles} {%- if canonical_url contains "${pageURL}" -%}${parsedStyles}{%- endif -%}` : 
    // `${otherPageStyles} {%- if canonical_url == "${pageURL}" -%}${parsedStyles}{%- endif -%}`;


    // BOOM, DONE BITCH!!!

    // return finalStyles; 
    // return {finalStyles, databaseStyles: `{%- if canonical_url contains "${pageURL}" -%}${parsedStyles}{%- endif -%}`};
    finalStyles= finalStyles.replace(/\.activeElm|\.draggableCursor|\.draggingCursor|\.glow/g, '');
    databaseStyles= databaseStyles.replace(/\.activeElm|\.draggableCursor|\.draggingCursor|\.glow/g, '');

    return {finalStyles, databaseStyles};

}


export default CSSParser



