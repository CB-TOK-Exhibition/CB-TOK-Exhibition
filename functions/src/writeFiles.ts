import getClient from './getClient'
import * as streamBuffers from 'stream-buffers'
import { Request, Response } from 'express'
import { Readable } from 'stream';

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

export default async ({ body }: Request, res: Response) => {
	const file = body as Buffer;
	const penis = new streamBuffers.ReadableStreamBuffer();
	penis.put(file);
	penis.stop();

	await putFile(penis).catch(err => {
		res.status(500).send(err)
		return
	})
	res.send("Write Success!")
}