

import { Store } from "./models.js";
import mongoose from "mongoose";
import sleep from 'sleep-promise';
import { Session } from "@shopify/shopify-api/dist/auth/session/session.js";

const dbActions = {};
const mongooseConnect = () => mongoose.connect(`mongodb+srv://easy-edits-server:${process.env.DB_PASSWORD}@easy-edits.prfo2.mongodb.net/?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})

dbActions.create = {
    shop: async (shopData) => {

        mongooseConnect();
        const {storeName, offline_token} = shopData;
        console.log('updated');
        // if the shop exists, we'll update, else we'll create it
        const createShop = async () => {
            await Shop.updateOne({ storeName: storeName}, 
                { $set:
                  {
                    storeName: storeName,
                    accessToken: offline_token,
                  }
               },
               {upsert:true,strict:false} // create shop if it doesn't exist
            ).catch(e=> {throw new Error('Failed Attempt At Creating Shop')});
        }

        await createShop().catch(async err=>{
            await sleep(2000);
            await createShop().catch(async err=>{
                throw new Error(`FAILED TO CREATE/UPDATE SHOP AFTER DOWNLOAD. SHOP: ${storeName}`);
            })
        })

        mongoose.connection.close();
        return;
    }
}

dbActions.get = {
    shop: async (storeName) => {
        mongooseConnect();

        let getShop = async () => await Shop.findOne({storeName: storeName});

        let gotShop = await getShop().catch(async err=>{
            await sleep(2000);
            return await getShop().catch(async err=>{
                console.log(`FAILED TO RETRIVE SHOP BY SHOP NAME: ${storeName}`);
            })
        })

        mongoose.connection.close();

        if(gotShop) gotShop.accessToken = null;

        return gotShop;
    },
    token: async (storeName) => {
        mongooseConnect();

        let getShop = async () => await Shop.findOne({storeName: storeName});

        let gotShop = await getShop().catch(async err=>{
            await sleep(2000);
            return await getShop().catch(async err=>{
                throw new Error(`FAILED TO RETRIVE SHOP BY SHOP NAME: ${storeName}`);
            })
        })

        mongoose.connection.close();

        return gotShop.accessToken;
    } 
}

dbActions.add = {
    shop: async (shopData) => {

        mongooseConnect();
        const {storeName, accessToken, storePass, inactiveEdits, edits} = shopData;

        const shopUpdates = {};
        accessToken?shopUpdates.accessToken = accessToken :'';
        downloaded?shopUpdates.downloaded = downloaded :'';
        storePass?shopUpdates.storePass = storePass :'';

        const pushes = {};

        inactiveEdits?pushes.inactiveEdits=inactiveEdits:'';
        if(edits){edits._id=mongoose.Types.ObjectId();pushes.edits=edits;};

        // if the shop exists, we'll update, else we'll create it
        const addToShop = async () => {
            await Shop.updateOne({ storeName: storeName}, 
                { $set: shopUpdates,
                  $push: pushes,
               },
               {strict:false} // create shop if it doesn't exist
            )
        }

        await addToShop().catch(async err=>{
            await sleep(2000);
            await addToShop().catch(async err=>{
                throw new Error(`FAILED TO ADD TO SHOP. SHOP: ${storeName}`);
            })
        })

        mongoose.connection.close();
        return;
    }
}

dbActions.delete = {
    shop: async () => {
        return;
    }    
}

export default dbActions;