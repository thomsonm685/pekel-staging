



import mongoose, { mongo } from 'mongoose';

// THE MONGOOSE SCHEMA
const storeSchema = new mongoose.Schema({ 
  storeName: String,
  accessToken: String,
  downloaded: Boolean,
  inactiveEdits: [String],
  storePass: [String],
  edits: [{
    _id: String,
    date: String,
    name: String,
    style: String,
    application: String,
    url: String
  }]


});
 // THE MONGOOSE MODEL (function so we don't get the  'can't overwrite model' error from mongoose)
function getStyleSheetModel() {
    try {
        mongoose.model('Store')  // it throws an error if the model is still not defined
        return mongoose.model('Store')
    } 
    catch (e) {
        return mongoose.model('Store', storeSchema)
    }
  }
const StoreData = getStyleSheetModel();



// The Object we're actually exporting and attaching methods to
let DBConnection = {};


DBConnection.GetToken = async () => {

 await mongoose.connect('mongodb+srv://easy-edits-server:'+process.env.DB_PASSWORDWORD+'@easy-edits.prfo2.mongodb.net/easy-edits?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
 .then( () => {
   console.log("Mongoose -> MongoDB Connection Is Open.(GetStore)")
 })
 .catch((err) => {
   console.log("Mongoose -> MongoDB Connection Error(GetStore):", err)
 })

 let theStoreData = await StoreData.findOne({storeName: process.env.NEXT_PUBLIC_SHOP})
     .then(res => {
         return res
     })
     .catch(err => {
         console.log("Error  in DBConnection.GetShop:", err)
         return err
     })

 return theStoreData.accessToken;
}


// Method to add shop name and access token to DB
DBConnection.AddToken = async (shop, accessToken) => {

  await mongoose.connect('mongodb+srv://easy-edits-server:'+process.env.DB_PASSWORD+'@easy-edits.prfo2.mongodb.net/easy-edits?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
  })
  .catch((err) => {
      console.log("Mongoose -> MongoDB Connection Error:", err)
  });
  await StoreData.updateOne({ storeName: shop}, 
      { $set:
        {
          accessToken: accessToken,
          downloaded: true,
        }
     },
     {upsert:true,strict:false} // should create shop if it doesn't exist
  )
  .catch(e => console.log('Error adding token in DBConnection.js:', e))
  mongoose.connection.close();
  return
  
}

DBConnection.MarkDownloaded = async (shop, theMark) => {

  // CONNECT TO MONGO 
  await('mongodb+srv://easy-edits-server:RZ5p4zWO2H83j75a@easy-edits.prfo2.mongodb.net/easy-edits?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
  .then( () => {
    console.log("Mongoose -> MongoDB Connection Is Open. (.MarkDownloaded)")
  })
  .catch((err) => {
    console.log("Mongoose -> MongoDB Connection Error (.MarkDownloaded):", err)
  })
  
  StoreData.updateOne(
    { storeName: shop}, 
    { $set:
      {
        downloaded: theMark
      }
    }
  )
    .then( async res => {
      console.log("Added To Mongo! Res:", res)
    })
    .catch( err => {
      console.log("Error Adding To Mongo:", err)
    })

}


// Method to add styles to the mongoDB
DBConnection.AddToDB = async (/*themeId, themeName,*/styleName, theStyles, styleApplication, styleUrl) => {

    // CONNECT TO MONGO 
    await mongoose.connect('mongodb+srv://easy-edits-server:RZ5p4zWO2H83j75a@easy-edits.prfo2.mongodb.net/easy-edits?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => {
      console.log("Mongoose -> MongoDB Connection Is Open. (.AddToDB)")
    })
    .catch((err) => {
      console.log("Mongoose -> MongoDB Connection Error(.AddToDB):", err)
    })
    

    let storeName = process.env.NEXT_PUBLIC_SHOP.substr(0, process.env.NEXT_PUBLIC_SHOP.indexOf('.'));

    let now = new Date();
    // let styleDate = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    let styleDate = now.toLocaleString({year: 'numeric', month: 'numeric', day: 'numeric' });

    // Checking if store obj already exists (unless this is their first edit, it should)
    let storeEdits = await StoreData.find({storeName: `${process.env.NEXT_PUBLIC_SHOP}`})
        .then(res => {
            return res
        })
        .catch(err => {
            return err
        })

    // If store obj exists, push new edit onto edits array, else create the whole thing
    // PROB DONT NEED THE ELSE, AS THE ACCESS TOKEN FUNCTIONS CREATE THE OBJ NO MATTER WHAT
    if(storeEdits.length > 0){
      StoreData.updateOne(
        { storeName: process.env.NEXT_PUBLIC_SHOP}, 
        { 
          $push: { 
            edits: { 
                _id: mongoose.Types.ObjectId(),
                date: styleDate,
                name: styleName,
                style: theStyles,
                application: styleApplication,
                url: styleUrl
            }
          } 
        },
      )
        .then( async res => {
          console.log("Added To Mongo! Res:", res)
        })
        .catch( err => {
          console.log("Error Adding To Mongo:", err)
        } )
    } 
    else 
    {
      await new StoreData({ 
        storeName: process.env.NEXT_PUBLIC_SHOP,
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
        themeId: 0,
        inactiveEdits: [],
        storePass: '',
        edits: [{
          _id: mongoose.Types.ObjectId(),
          date: styleDate,
          name: styleName,
          style: theStyles,
          application: styleApplication,
          url: styleUrl
        }]
      }).save()
        .then( async res => {
          console.log("Added To Mongo! Res:", res)
        })
        .catch( err => {
          console.log("Error Adding To Mongo:", err)
        } )
    }
}



// Method to get all styles matching store from the mongoDB
DBConnection.GetShop = async (shop=process.env.NEXT_PUBLIC_SHOP) => {

  await mongoose.connect('mongodb+srv://easy-edits-server:'+process.env.DB_PASSWORD+'@easy-edits.prfo2.mongodb.net/easy-edits?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
  })
  .catch((err) => {
      console.log("Mongoose -> MongoDB Connection Error:", err)
  });        
  const foundShop = await StoreData.findOne({storeName:shop})
  .then(obj=>{
      return obj===null?{downloaded:false}:obj;
  })
  .catch(e=>console.log('Error Getting Shop In dbCalls.js:', e))
  mongoose.connection.close();
  return foundShop;

}


DBConnection.GetByID = async (id) => {

    // CONNECT TO MONGO 
    await('mongodb+srv://easy-edits-server:RZ5p4zWO2H83j75a@easy-edits.prfo2.mongodb.net/easy-edits?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => {
      console.log("Mongoose -> MongoDB Connection Is Open.(GetByID)")
    })
    .catch((err) => {
      console.log("Mongoose -> MongoDB Connection Error (GetByID):", err)
    })
    
    let storeEdits = await StoreData.findOne({storeName: process.env.NEXT_PUBLIC_SHOP})
        .then(res => {
            return res
        })
        .catch(err => {
            return console.log('ERROR getting style:', err)
        })

    console.log('storeEdits', storeEdits)


    let theEdit = storeEdits.edits.filter((edit) => edit._id === id)[0];


    return theEdit
}


DBConnection.UpdateInactiveUrls = async (url, toggling, inactiveUrls) => {
  // CONNECT TO MONGO 
  await('mongodb+srv://easy-edits-server:RZ5p4zWO2H83j75a@easy-edits.prfo2.mongodb.net/easy-edits?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
  .then( () => {
    console.log("Mongoose -> MongoDB Connection Is Open.(UpdateInactiveUrls)")
  })
  .catch((err) => {
    console.log("Mongoose -> MongoDB Connection Error (UpdateInactiveUrls):", err)
  })
  
  let storeName = process.env.NEXT_PUBLIC_SHOP.substr(0, process.env.NEXT_PUBLIC_SHOP.indexOf('.'));

  console.log('url type of:', typeof(url))

  if (toggling === 'on'){
    StoreData.updateOne(
      { storeName: process.env.NEXT_PUBLIC_SHOP }, 
      { $pull: { inactiveEdits: `${url}` } }
      // {
      //   $pull: {
      //     inactiveEdits: url
      //   }
      // }
    )
      .then( async res => {
        console.log("Removed Inactive Url From Mongo! Res:", res)
      })
      .catch( err => {
        console.log("Error removing url from inactive urls!:", err)
      } )
  }
  else if (toggling === 'off'){
    inactiveUrls.push(url);
    StoreData.updateOne(
      { storeName: process.env.NEXT_PUBLIC_SHOP }, 
      { $push: 
        { 
          inactiveEdits: url
        } 
      }
    )
      .then( async res => {
        console.log("Added Inactive Url To Mongo! Error:", res)
      })
      .catch( err => {
        console.log("Error Adding Inactive Url To Mongo! Error:", err)
      } )
  }

}

// FUNCTION TO UPDATE STORE PASSWORD IN MONGO
DBConnection.UpdatePassword = async (password) => {

  await mongoose.connect('mongodb+srv://easy-edits-server:'+process.env.DB_PASSWORD+'@easy-edits.prfo2.mongodb.net/easy-edits?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
  .then( () => {
    console.log("Mongoose -> MongoDB Connection Is Open.(GetStore)")
  })
  .catch((err) => {
    console.log("Mongoose -> MongoDB Connection Error(GetStore):", err)
  })
 
  const updatedPass = await StoreData.updateOne(
    { storeName: process.env.NEXT_PUBLIC_SHOP }, 
    { $set:
      {
        storePass: password,
      }
   }
  )
 
  console.log('Updated Pass In Mongo:', updatedPass);

  return updatedPass;
 }


export default DBConnection;



