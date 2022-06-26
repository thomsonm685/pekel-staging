




import enTranslations from '@shopify/polaris/locales/en.json';
import { Card, Stack, Button, Collapsible, TextContainer } from '@shopify/polaris';
import { useCallback, useState } from 'react';


function Accordian(props) {
    const [open, setOpen] = useState(true);

    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return (
      <div style={{height: '200px'}}>
        <Card sectioned>
          <Stack vertical>
            <h2>{props.title}</h2>  
            <Button
              onClick={handleToggle}
              ariaExpanded={open}
              ariaControls="basic-collapsible"
            >
              { props.button }
            </Button>
            <Collapsible
              open={open}
              id="basic-collapsible"
              transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
              expandOnPrint
            >
                { props.children }
            </Collapsible>
          </Stack>
        </Card>
      </div>
    );
  }


  export default Accordian