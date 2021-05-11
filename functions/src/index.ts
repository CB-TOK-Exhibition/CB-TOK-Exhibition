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
app.get("/getControl", (req, res) =>{
	res.sendFile(path.join(__dirname,'../test.pdf'))
})


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
import * as functions from "firebase-functions";
exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });
	response.send("Hello from Firebase!");
});
export const ftp = functions.https.onRequest(app);

/* #region  HELPER */
type appAction = (arg0: Request, arg1: Response, arg2: NextFunction) => Promise<void>;
function runAsync(callback: appAction) {
	return (req: Request, res: Response, next: NextFunction) => {
		callback(req, res, next).catch(next)
	}
}
/* #endregion */