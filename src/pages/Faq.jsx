

import Nav from '../components/Nav';
import FaqItem from '../components/FaqItem';
import { Card, Stack, Page, Heading, Spinner } from "@shopify/polaris";
import { FcManager } from "react-icons/fc"
import { useState } from 'react';

export async function getServerSideProps() {
    return {props: {shopName: process.env.NEXT_PUBLIC_SHOP/*, shopInfo: shopInfo*/}}
}

const Faq = ({app,shopName}) => {

    const [loading, setLoading] = useState(false);

    return(
    <>
        <Nav currentPage={2} setLoading={setLoading} app={app} shop={shopName}/>
        { loading ?
        <div style={{margin:"18% auto", width: "min-content"}}>
            < Spinner/>
        </div>
        :
        <div style={{padding:'10px'}}>
            <Page style={{padding:'10px'}}>
                <div style={{marginBottom:'10px'}}>
                    <h1 className="Polaris-Heading" style={{fontSize:'2rem'}}>Frequently Asked Questions:</h1>
                </div>
                <Card title="Editing Your Store:" sectioned>
                    <Stack vertical>
                        <FaqItem title="How Edits Are Applied" paragraph="
                            You can have single-page, multi-page, and site-wide edits, and they're applied in that order.
                            In other words, you can have a site-wide edit where an element is red, and a single page edit 
                            where it's green. The element will be red site wide, except for that single-page edit where it's
                            green.
                        "></FaqItem>
                        <FaqItem title="Editing For Mobile" paragraph="
                            To edit your page for mobile, just check the 'edit for mobile' checkbox in the edit store page.
                            Smaller screen edits will take precedence, for example: if you make text green at 1000px
                            , blue at 750px, and yellow at 500px, it will be green for screens between 1000-750px, blue for screens between 
                            750-500px, and yellow for screens 500px and below. 
                        "></FaqItem>
                    </Stack>
                </Card>
                <Card title="Managing Edits:" sectioned>
                    <Stack vertical>
                        <FaqItem title="Turning Off Edits" paragraph="
                            In the 'Manage Edits' page, find the right page url and application (single-page, multi-page or 
                                site-wide.), and select 'Turn Off Edits'. You can turn them back on anytime, and make sure to turn
                                them on whenever you'd like to edit that page again!
                        "></FaqItem>
                        <FaqItem title="Going Back Edits" paragraph="
                            All the edits you make are saved. You can go to 'Manage Edits' page, find the right page url 
                            and application (single-page, multi-page or site-wide.), find your edit by it's date and name,
                            then click 'Use These Edits'. Name the reversion whatever you'd like and it'll be saved as a new
                            edit!
                        "></FaqItem>
                    </Stack>
                </Card>
                <Card title="Other Questions:" sectioned>
                    <Stack vertical>
                        <FaqItem title="Deleting Easy-Edits" paragraph='
                            To delete Easy-Edits, just go to "Apps" in your dashboard, the select "Delete" and follow the
                            prompts. Fear not, any edits you made with Easy-Edits will stick around even when you delete 
                            the app!
                        '></FaqItem>
                        <FaqItem title="Deleting Easy-Edits Files" paragraph="
                            To delete any files left behind, go to 'Online Store' > 'Themes' in your dashboard,
                            then 'Actions' > 'Edit Code' in your current theme, then delete the 'easy_edits.css.liquid' file
                            in your snippets folder. (This will remove any edits you made with Easy-Edits!). You can also 
                            remove the this piece of code: `<style>{%- include 'easy_edits.css.liquid' -%}</style>`, from your
                            'Layout' > 'Theme.liquid' file. 
                        "></FaqItem>
                    </Stack>
                </Card>
                <Card title="No Help? Contact The Developer:" sectioned>
                    <Stack>
                        <FcManager style={{position:"relative", bottom:"20px"}} size={120}></FcManager>
                        <Stack vertical>
                            <Heading>Michael Thomson</Heading>
                            <Heading>Email Anytime: support@easy-edits.com</Heading>
                        </Stack>
                    </Stack>
                </Card>
            </Page>
        </div>
        }
    </>
    )
}

export default Faq
