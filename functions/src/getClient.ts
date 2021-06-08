import * as basic_ftp from "basic-ftp";
import { Client } from "basic-ftp";
export default async (): (Promise<Client>) => {
	// console.log(await client.list())
	const client = new basic_ftp.Client()
	client.ftp.verbose = true
	await client.access({
		host: "colonelby.com",
		user: "cbtok12345",
		password: "CougarsTOK21"
	}).catch(err => {
		throw err;
	})
	return client;
}