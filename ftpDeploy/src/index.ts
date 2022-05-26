import * as ftp from "basic-ftp"
const client = new ftp.Client(60000)
const build = async() => {
	client.ftp.verbose = true
	console.log(client.ftp.timeout)
	await client.access({
		host: "colonelby.com",
		user: "cbtok12345",
		password: process.env.FTP_PASSWORD,
	})
	//clear
	await client.clearWorkingDir()

	//take dist folder and upload everything
	await client.uploadFromDir("../dist")

	return
}

async function cock(){
	await build().catch(err=>{
		console.log(err)
	})
	client.close()
}

cock()