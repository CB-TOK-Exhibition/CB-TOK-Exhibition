/* #region  FTP*/
// EXPRESS
import * as express from "express";
import { Request, Response, NextFunction } from 'express'
import * as cors from 'cors'
const app = express();
app.use(cors({ origin: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


/* #region  READING FILES */
import getFiles from './getFiles'
import writeFiles from './writeFiles'
import path = require('path');
app.get("/get/:fileName", runAsync(getFiles))
app.post("/write", runAsync(writeFiles));
app.get("/getControl", (req, res) => {
	res.sendFile(path.join(__dirname, '../test.pdf'))
})

/* #region  HELPER */
type appAction = (arg0: Request, arg1: Response, arg2: NextFunction) => Promise<void>;
function runAsync(callback: appAction) {
	return (req: Request, res: Response, next: NextFunction) => {
		callback(req, res, next).catch(next)
	}
}
/* #endregion */
/* #endregion */
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
export const job = functions.pubsub.schedule("0 */4 * * *").onRun(async ()=>{
	db.collection('meta').doc('featureProjects').update({
		projects: await getFeatured()
	});
})

export const penis = functions.https.onRequest(async (request, response)=> {
	response.send(await getFeatured())
})


//FTP STUFF
export const ftp = functions.https.onRequest(app);

// UPDATING ALGOLIA INDEX (USED FOR SEARCH)
import algoliasearch from "algoliasearch";
const APP_ID = "71DQO3F2KO"
const ADMIN_KEY = "2027099cd83ca8f71e2e5e25cc2a979b"

const client = algoliasearch(APP_ID, ADMIN_KEY)
const index = client.initIndex("projects")

export const addToIndex = functions.firestore.document("projects/{projectId}")
	.onCreate(snapshot => {
		const data = snapshot.data()
		const objectID = snapshot.id

		return index.saveObject({...data, objectID})
	})

export const updateIndex = functions.firestore.document("projects/{projectId}")
	.onUpdate((change) => {
		const newData = change.after.data()
		const objectID = change.after.id
		return index.saveObject({ ...newData, objectID})
	})

export const deleteFromIndex = functions.firestore.document("projects/{projectId}")
	.onDelete(snapshot => index.deleteObject(snapshot.id))
