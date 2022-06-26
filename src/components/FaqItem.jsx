

import { useState, useCallback } from 'react'
import { Link, Collapsible, TextContainer } from "@shopify/polaris";

const FaqItem = ({title, paragraph}) => {

    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return(
    <>
        <Link
            onClick={handleToggle}
            ariaExpanded={open}
            ariaControls="basic-collapsible"
            removeUnderline={true}
        >
            {title}
        </Link>
        <Collapsible
            open={open}
            id="basic-collapsible"
            transition={{duration: '250ms', timingFunction: 'ease-in-out'}}
            expandOnPrint
        >
            <TextContainer>
            <p>
                {paragraph}
            </p>
            </TextContainer>
        </Collapsible>
    </>
    )
}

export default FaqItem