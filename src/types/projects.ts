export default interface project{
    id:string,
    projectTitle: string,
    topics: number[],
    class: string,
    imageFeature: string,
    rating:number,
    filePath: string
}

const topicsList = ["Knowledge and the Knower" ,"Knowledge and Language" ,"Knowledge and Tech" ,"Knowledge and Religion" ,"Knowledge and Politics" ,"Knowledge and Indigenous Societies"]
const topicColours = ["#f19ebc", "#1ee4be", "#63cd22", "#398be6", "#fcba03", "#c02516"]
type topics = "Knowledge and the Knower" | "Knowledge and Language" | "Knowledge and Tech" | "Knowledge and Religion" | "Knowledge and Politics" | "Knowledge and Indigenous Societies"
export { topicsList, topicColours, topics}