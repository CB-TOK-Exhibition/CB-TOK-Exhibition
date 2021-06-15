/* #region  FTP*/
// EXPRESS
import * as express from "express";
import { Request, Response, NextFunction } from 'express'
import * as cors from 'cors'
const app = express();
app.use(cors({ origin: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

import getFiles from './getFiles'
import writeFiles from './writeFiles'
import path = require('path');
app.get("/get/:fileName", runAsync(getFiles))
app.post("/write", runAsync(writeFiles));
app.get("/getControl", (req, res) => {
	res.sendFile(path.join(__dirname, '../test.pdf'))
})

type appAction = (arg0: Request, arg1: Response, arg2: NextFunction) => Promise<void>;
function runAsync(callback: appAction) {
	return (req: Request, res: Response, next: NextFunction) => {
		callback(req, res, next).catch(next)
	}
}
/* #endregion */

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//FUNCTIONS JARGON
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
export const db = admin.firestore();

//HELLO WORLD TEST
export const helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });
	response.send("Hello from Firebase!");
});


//GET FEATURED PROJECTS
import getFeatured from './getFeatured'
export const fourHourSetFeature = functions.pubsub.schedule("0 */4 * * *").onRun(async ()=>{
	db.collection('meta').doc('featureProjects').update({
		projects: await getFeatured()
	});
})


//FTP STUFF
export const ftp = functions.https.onRequest(app);