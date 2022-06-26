


import mongoose from 'mongoose';

// THE MONGOOSE SCHEMA
const storeSchema = new mongoose.Schema({ 
    storeName: String,
    accessToken: String,
    inactiveEdits: { type: Array, default: []},
    storePass: { type: String, default: null},
    edits: { type: Array, default: []}
});

 // THE MONGOOSE MODEL (function so we don't get the  'can't overwrite model' error from mongoose)
function getModel(name, schema) {
    try {
        mongoose.model(name)  // it throws an error if the model is still not defined
        return mongoose.model(name)
    } 
    catch (e) {
        return mongoose.model(name, schema)
    }
}

export const Store = getModel('Store', storeSchema);

