/* #region  FTP*/
// EXPRESS
// import * as express from "express";
// import { Request, Response, NextFunction } from 'express'
// import * as cors from 'cors'
// const app = express();
// app.use(cors({ origin: true }));
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

// import getFiles from './getFiles'
// import writeFiles from './writeFiles'
// import path = require('path');
// app.get("/get/:fileName", runAsync(getFiles))
// app.post("/write", runAsync(writeFiles));
// app.get("/getControl", (req, res) => {
// 	res.sendFile(path.join(__dirname, '../test.pdf'))
// })

// type appAction = (arg0: Request, arg1: Response, arg2: NextFunction) => Promise<void>;
// function runAsync(callback: appAction) {
// 	return (req: Request, res: Response, next: NextFunction) => {
// 		callback(req, res, next).catch(next)
// 	}
// }
/* #endregion */

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
// FUNCTIONS JARGON
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
export const db = admin.firestore();

// HELLO WORLD TEST
// export const helloWorld = functions.https.onRequest((request, response) => {
// 	functions.logger.info("Hello logs!", { structuredData: true });
// 	response.send("Hello from Firebase!");
// });

// FTP STUFF
// export const ftp = functions.https.onRequest(app);

// GET FEATURED PROJECTS
import getFeatured from "./getFeatured";
export const fourHourSetFeature = functions.pubsub.schedule("0 */4 * * *").onRun(async () => {
	db.collection("meta").doc("featureProjects").update({
		projects: await getFeatured(),
	});
});
export const fuck = functions.https.onRequest(async (req, res) => {
	const count = (await db.collection("projects").get()).size;
	db.collection("meta").doc("projects").update({
		projectCount: count,
	});
	res.send(count);
});

/* #region UPDATING ALGOLIA INDEX (USED FOR SEARCH) */
import algoliasearch from "algoliasearch";
import firebase from "firebase";

// VANSH's
// const APP_ID = "71DQO3F2KO"
// const ADMIN_KEY = "2027099cd83ca8f71e2e5e25cc2a979b"

// EDWIN's
const APP_ID = "JERBZD5TNR";
const ADMIN_KEY = "1e3bbc2c8a71aa35303ee9d7ec89caf9";

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("projects");

export const hardUpdateAll = functions.https.onRequest(async (req, res) => {
	const projects = await db.collection("projects").get();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = [] as any[];
	projects.docs.forEach((doc)=>{
		const project = doc.data();
		project.objectID = doc.id;
		data.push({
			objectID: doc.id,
			projectTitle: project.projectTitle,
			rating: project.rating,
			class: project.class,
			year: project.year,
		});
	});

	let error;
	const repp = await index.replaceAllObjects(data).catch((err)=>{
		error = err;
	});
	res.send([repp, error, data]);
});

export const addToIndex = functions.firestore.document("projects/{projectId}")
	.onCreate((snapshot) => {
		db.collection("meta").doc("projects").update({
			projectCount: firebase.firestore.FieldValue.increment(1),
		}).catch((err)=>{
			console.log(err);
		});
		const project = snapshot.data();
		const objectID = snapshot.id;

		return index.saveObject({
			objectID,
			projectTitle: project.projectTitle,
			rating: project.rating,
			class: project.class,
			year: project.year,
		});
	});

export const updateIndex = functions.firestore.document("projects/{projectId}")
	.onUpdate((change) => {
		const project = change.after.data();
		const objectID = change.after.id;
		return index.saveObject({
			objectID,
			projectTitle: project.projectTitle,
			rating: project.rating,
			class: project.class,
			year: project.year,
		});
	});

export const deleteFromIndex = functions.firestore.document("projects/{projectId}")
	.onDelete((snapshot) => {
		db.collection("meta").doc("projects").update({
			projectCount: firebase.firestore.FieldValue.increment(-1),
		}).catch((err) => {
			console.log(err);
		});
		index.deleteObject(snapshot.id);
	});
/* #endregion */
