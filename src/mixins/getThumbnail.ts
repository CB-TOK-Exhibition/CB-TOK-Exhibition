import project from "@/types/projects"
export default {
    methods: {
        getThumbnailURL(project: project): string{
            return `https://cb-tok-exhibition.github.io/databasePDFs/${project.year}/${project.class}/${project.id}.${project.imageExtension}`
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