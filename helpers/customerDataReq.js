



import mongoose, { mongo } from 'mongoose';
import MarkDownloaded from '../helpers/dbConnection';

// THE MONGOOSE SCHEMA
const customerReqSchema = new mongoose.Schema({ 
  customerReq: String,
  type: String
});
 // THE MONGOOSE MODEL (function so we don't get the  'can't overwrite model' error from mongoose)
function getStyleSheetModel() {
    try {
        mongoose.model('CustomerReq')  // it throws an error if the model is still not defined
        return mongoose.model('CustomerReq')
    } 
    catch (e) {
        return mongoose.model('CustomerReq', customerReqSchema)
    }
  }
const CustomerReq = getStyleSheetModel();

const customerDataReq = async (reqData, type) => {

    const parsedReq = await JSON.parse(reqData);
    const shop = parsedReq.shop_domain;
    
    mongoose.connect('mongodb+srv://easy-edits-server:RZ5p4zWO2H83j75a@easy-edits.prfo2.mongodb.net/easy-edits?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
        .then( () => {
        console.log("Mongoose -> MongoDB Connection Is Open. (for customer data)")
        })
        .catch((err) => {
        console.log("Mongoose -> MongoDB Connection Error (customer data):", err)
        })

    await new CustomerReq({ 
        customerReq: reqData,
        type: type
    }).save()

}

export default customerDataReq;

