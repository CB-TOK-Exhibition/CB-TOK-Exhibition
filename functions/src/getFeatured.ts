import {db} from './index'

export default async (ctx?: any) => {
    const projectIds: any[] = []

    const projectsSnapshot = await db.collection("projects").get()
    projectsSnapshot.forEach(project => projectIds.push(project.id))


    const returnProjectIds: any[] = []
    if (projectIds.length <= 10) return projectIds

    for (let i = 0; i < 10; i++) {
        const j = getRandomInt(i, projectIds.length - 1)

        //swap
        const temp = projectIds[i]
        projectIds[i] = projectIds[j]
        projectIds[j] = temp;

        returnProjectIds.push(projectIds[i])
    }

    return returnProjectIds
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}