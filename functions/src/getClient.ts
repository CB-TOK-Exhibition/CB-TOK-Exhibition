import * as basic_ftp from "basic-ftp";
import { Client } from "basic-ftp";
export default async (): (Promise<Client>) => {
    // console.log(await client.list())
    const client = new basic_ftp.Client()
    client.ftp.verbose = true
    await client.access({
        host: "colonelby.com"
    }).catch(err => {
        throw err;
    })
    return client;
}