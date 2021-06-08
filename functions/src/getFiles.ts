import getClient from './getClient'
import { Request, Response } from 'express'
import {Transform} from 'stream'

export default async (req: Request, res: Response) => {
	console.log(`Right now processing: /pdfs/${req.params.fileName}`)
	res.writeHead(200, {
		"content-type": "application/pdf",
		'content-disposition': `inline; filename=${req.params.fileName}`,
		'Accept-Ranges': 'bytes',
		// 'Content-Length':write.size(),
	})
	//SOME VARIABLES
	const client = await getClient().catch(err => { throw err })
	const out = new Transform({
		write(chunk, encoding, callback) {
			console.log('[transform]', chunk, encoding);
			res.write(chunk, encoding);
			callback()
		},
	});

	//DOWNLOAD
	await client.downloadTo(out, `/pdfs/${req.params.fileName}`).catch(err => { throw err })
	// await client.downloadTo('./test.pdf', `/pdfs/${req.params.fileName}`).catch(err => { throw err })
	console.log('post download')
	out.end()
	res.end()
	client.close()

	//GUT CHECK
	// res.sendFile(path.join(__dirname, "../test.pdf"))
	// return
	//OLD
	// const errorFunction = (err: Error) => {
	// 	if (err) next(err)
	// }
	// const options = {
	// 	root: path.dirname('../'),
	// 	dotfiles: 'deny',
	// 	headers: {
	// 		'x-timestamp': Date.now(),
	// 		'x-sent': true
	// 	}
	// }
}