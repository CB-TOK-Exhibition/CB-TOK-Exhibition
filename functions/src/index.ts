import * as functions from "firebase-functions";
import * as express from "express";
import * as ftp from "basic-ftp";
import { Client } from "basic-ftp";
import * as path from 'path'
import { Readable } from 'stream';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//
exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });
	response.send("Hello from Firebase!");
});

// EXPRESS
const app = express();
const cors = require('cors')({ origin: true });
app.use(express.json())
app.use(cors);

//FTP THINGS
const getClient = async (): (Promise<Client | string>) => {
	// console.log(await client.list())
	const client = new ftp.Client();
	await client.access({
		host: "colonelby.com",
		user: "NO",
		password: "FUCK YOU"
	}).catch(err => {
		console.error("Error accessing Client")
		return "error"
	})
	return client;
}

/* #region  READING FILES */
const getFile = async (fileName: string) => {
	const client = await getClient()
	if (client == "error" || typeof client == "string") return "error";
	client.close()
	// const file = await client.downloadTo("README_COPY.md", "README_FTP.md")
	// return file
}

app.get("/get", (req, res, next) => {
	const errorFunction = (err: Error) => {
		if (err) next(err)
	}
	const options = {
		root: path.dirname('../'),
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	}
	const file = getFile(req.body)
	if (typeof file == "string" && file == "") { res.status(401); res.send("Unable to get file") }
	// res.sendFile(file, options, errorFunction)
})
/* #endregion */


/* #region  WRITING FILES */
const putFile = async (file: Readable) => {
	const client = await getClient()
	if (client == "error" || typeof client == "string") return "error";

	await client.uploadFrom(file, "/pdfs/testFile.pdf").catch(err=>{
		client.close()
		return "error"
	})
	client.close()
	return "success"
}

app.get("/write", async (req, res, next) => {
	const result = await putFile(req.body)
	if (result == "success") {
		res.send("Write Success!")
	} else if (result == "error") {
		res.status(401);
		res.send("Error writing file")
	}
});
/* #endregion */


exports.ftp = functions.https.onRequest(app);
