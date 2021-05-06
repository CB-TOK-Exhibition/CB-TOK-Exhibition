import * as functions from "firebase-functions";
import * as express from "express";
import { Request, Response, NextFunction } from 'express'
import * as cors from 'cors'

//FTP THINGS
import * as basic_ftp from "basic-ftp";
import { Client } from "basic-ftp";

//FILE SYSTEM THINGS
import * as path from 'path'
import * as streamBuffers from 'stream-buffers'
import { Readable, Writable } from 'stream';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//
exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });
	response.send("Hello from Firebase!");
});

// EXPRESS
const app = express();
app.use(cors({ origin: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//FTP THINGS
const getClient = async (): (Promise<Client>) => {
	// console.log(await client.list())
	const client = new basic_ftp.Client()
	client.ftp.verbose = true
	await client.access({
		host: "colonelby.com",
		user: "NO",
		password: "FUCK YOU"
	}).catch(err => {
		throw err;
	})
	return client;
}

/* #region  READING FILES */
app.get("/get/:fileName", runAsync(async (req: Request, res:Response, next:NextFunction) => {
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

	const client = await getClient().catch(err => { throw err })

	const write = new streamBuffers.WritableStreamBuffer();
	console.log(`/pdfs/${req.params.fileName}`)
	await client.downloadTo(write, `/pdfs/${req.params.fileName}`).catch(err => { throw err })
	await client.downloadTo('./test.pdf', `/pdfs/${req.params.fileName}`).catch(err => { throw err })
	write.end()

	res.setHeader('Content-Length', write.size());
	res.contentType("application/pdf");
	res.setHeader('content-disposition', 'attachment; filename=name.pdf');

	// write.pipe(res)
	res.send(write.getContentsAsString())
	client.close()
}))
/* #endregion */

/* #region  WRITING FILES */
const putFile = async (file: Readable) => {
	const client = await getClient().catch(err => {
		throw err;
	})
	await client.uploadFrom(file, "/pdfs/testFile.pdf").catch(err => {
		client.close()
		throw err;
	})
	client.close()
}

app.post("/write", runAsync(async ({ body }: Request, res: Response) => {
	const file = body as Buffer;
	const penis = new streamBuffers.ReadableStreamBuffer();
	penis.put(file);
	penis.stop();

	await putFile(penis).catch(err => {
		res.status(500).send(err)
		return
	})
	res.send("Write Success!")
}));
/* #endregion */


export const ftp = functions.https.onRequest(app);


/* #region  HELPER */
type appAction = (arg0: Request, arg1: Response, arg2: NextFunction) => any;
function runAsync(callback: appAction) {
	return (req: Request, res: Response, next: NextFunction) => {
		callback(req, res, next).catch(next)
	}
}
/* #endregion */