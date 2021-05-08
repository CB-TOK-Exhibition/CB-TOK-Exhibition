import getClient from './getClient'
import { Request, Response } from 'express'
import * as streamBuffers from 'stream-buffers'

export default async (req: Request, res: Response) => {
    console.log(`Right now processing: /pdfs/${req.params.fileName}`)
    //SOME VARIABLES
    const client = await getClient().catch(err => { throw err })
    const outBucket = new streamBuffers.WritableStreamBuffer();

    //DOWNLOAD
    await client.downloadTo(outBucket, `/pdfs/${req.params.fileName}`).catch(err => { throw err })
    // await client.downloadTo('./test.pdf', `/pdfs/${req.params.fileName}`).catch(err => { throw err })

    //SEND TO CLIENT
    outBucket.end()
    res.writeHead(200, {
        "content-type": "application/pdf",
        'content-disposition': `inline; filename=${req.params.fileName}`,
        'Accept-Ranges': 'bytes',
        // 'Content-Length':write.size(),
    })
    res.end(outBucket.getContentsAsString());
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