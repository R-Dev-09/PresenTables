const JsonDB = require('node-json-db').JsonDB; // Only for use with JsonDB
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config; // Only for use with JsonDB
// const Presentable = require('../models/present'); // Only for use with MongoDB 
const endecrypt = require('../endecrypt/endecrypt');
const db = new JsonDB(new Config('backend/db/presentables.json', true, false, '/')); // Only for use with JsonDB

// POST method using JsonDB and encryption
exports.createPresentable = (req, res, next) => {
    try {
        const {creator, ...uePresentable} = req.body;
        const ePresentable = endecrypt.endecrypt(uePresentable);
        db.push(`/${creator}/presentables[]`, ePresentable, true);
        res.status(201).json({message: 'Creation successful'}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Pushing to database failed', error});
    }
};
 
// GET method using JsonDB and decryption
exports.getPresentables = (req, res, next) => {
    try {
        const user = req.headers['user-email'];
        const udPresentables = db.getData(`/${user}/presentables`);
        const presentables = udPresentables.map(doc => {
            const deDoc = endecrypt.endecrypt(doc, true);
            return deDoc;
        });
        res.status(200).json({message: 'Fetching successful', presentables});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Fetching documents failed', error});
    }
};

//DELETE method using JsonDB

exports.deletePresentable = (req, res, next) => {
    try {
        const presId = req.params.presId;
        const user = req.headers['user-email'];
        db.delete(`/${user}/presentables[${presId}]`);
        res.status(200).json({message: 'Deleting successful'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Deleting document failed', error});
    }
};

// PUT method using JsonDB

exports.updatePresentable = (req, res, next) => {
    const presId = req.params.presId;
    if (req.body.edited) {
       try {
            const {creator, ...uePresentable} = req.body;
            const ePresentable = endecrypt.endecrypt(uePresentable);
            db.push(`/${creator}/presentables[${presId}]`, ePresentable, false);
            res.status(200).json({message: 'Updating successful'});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Updating document failed', error});
        } 
    } else {
        try {
            const {creator, ...ueData} = req.body;
            const eData = endecrypt.endecrypt(ueData);
            db.push(`/${creator}/presentables[${presId}]`, eData, false);
            res.status(200).json({message: 'Updating successful'});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Updating document failed', error});
        }
    }
};

// POST method using MongoDB and encrypted request

// exports.createPresentable = (req, res, next) => {
//     const uePresentable = req.body;
//     const ePresentable = endecrypt.endecrypt(uePresentable);
//     const presentable = new Presentable(ePresentable);
//     presentable.save().then(createdP => {
//         res.status(201).json({
//             message: "Creating a presentable was successful!",
//             presentable: {...createdP, id: createdP._id}
//         });
//     }).catch(error => {
//         res.status(404).json({error});
//         console.log(error);
//     });
// } 

// GET method using MongoDB and decrypted response

// exports.getPresentables = (req, res, next) => {
//     const pageSize = +req.query.pageSize;
//     const currentPage = req.query.page;
//     const pQuery = Presentable.find();
//     let fetchedPresentables;
//     if (pageSize && currentPage) {
//         pQuery
//         .skip(pageSize * (currentPage - 1))
//         .limit(pageSize);
//     }
//     pQuery.then(documents => {
//         const deDocuments = documents.map(doc => {
//             const {gmt, mnd, led, opw, totled, totopw, gemled, gemopw} = doc;
//             const docLED = {
//                 w1: led.w1,
//                 w2: led.w2,
//                 w3: led.w3,
//                 w4: led.w4,
//                 w5: led.w5
//             };
//             const docOPW = {
//                 w1: opw.w1,
//                 w2: opw.w2,
//                 w3: opw.w3,
//                 w4: opw.w4,
//                 w5: opw.w5
//             }
//             const presentable = {gmt, mnd, led: docLED, opw: docOPW, totled, totopw, gemled, gemopw};
//             const dePresentable = endecrypt.endecrypt(presentable, true);
//             return dePresentable;
//         });       
//         fetchedPresentables = deDocuments;
//         return Presentable.countDocuments();
//     }).then(count => {
//         res.status(200).json({
//           message: 'Presentables fetched successfully!',
//           presentables: fetchedPresentables,
//           maxP: count
//         });
//       })
//       .catch(error => {
//         res.status(500).json({
//           message: 'Fetching presentables failed!',
//           error
//         });
//       });
// }