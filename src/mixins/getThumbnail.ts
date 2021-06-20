import {storage} from "@/firebase"
import project from "@/types/projects"
export default {
    methods: {
        async getThumbnailURL(project: project): Promise<string>{
            const url = await storage.ref(`/images/${project.year}/${project.class}/${project.id}.${project.imageExtension}`).getDownloadURL().catch(err=>{
                console.error("CAUGHT ISSUE: ", err)
                return "data:image/jpeg;base64,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"
            })
            return url
            // return `https://cb-tok-exhibition.github.io/databasePDFs/${project.year}/${project.class}/${project.id}.${project.imageExtension}`
        },
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        concatenate(resultConstructor: any, ...arrays: any[]): any{
            let totalLength = 0;
            for (const arr of arrays) {
                totalLength += arr.length;
            }
            const result = new resultConstructor(totalLength);
            let offset = 0;
            for (const arr of arrays) {
                result.set(arr, offset);
                offset += arr.length;
            }
            return result;
        }
    }
}