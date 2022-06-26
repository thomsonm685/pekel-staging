

import jwt from "jsonwebtoken";


const verifySession = async (token) => {
    try {
        jwt.verify(token,process.env.SHOPIFY_API_SECRET,{ algorithms: ['HS256'] });
        console.log('VALID JWT TOKEN!')
        return true;
    } catch(err) {
        console.log('INVALID JWT TOKEN!:', err);
        return false;
    }
}

// const createToken = async (token) => {
//     try {
//         jwt.sign({ 
//             headers: {
//                 "alg": "HS256",
//                 "typ": "JWT"
//             },
//             payload: {
//                 "shop": "shop-name.myshopify.com"
//             }
//         }, 
//         process.env.SHOPIFY_API_SECRET, 
//         { algorithm: 'HS256', expiresIn: '1h'})
//         return true;
//     } catch(err) {
//         return false;
//     }
// }



export default verifySession