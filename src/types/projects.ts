export default interface project{
    id?:string,
    author: string,
    projectTitle: string,
    topics: number[],
    imageExtension: string,
    imageURL: string,
    rating:number,

    class: string,
    year:string,

    votes: number,
}

export interface noidProject{
    author: string,
    projectTitle: string,
    topics: number[],
    imageExtension: string,
    imageURL: string,
    rating: number,

    class: string,
    year: string,

    votes: number,
}

export interface yearContainer{
    year:string,
    classes:string[]
}

const topicsList = ["Knowledge and the Knower" ,"Knowledge and Language" ,"Knowledge and Tech" ,"Knowledge and Religion" ,"Knowledge and Politics" ,"Knowledge and Indigenous Societies"]
const topicColours = ["#f19ebc", "#1ee4be", "#63cd22", "#398be6", "#fcba03", "#c02516"]
type topics = "Knowledge and the Knower" | "Knowledge and Language" | "Knowledge and Tech" | "Knowledge and Religion" | "Knowledge and Politics" | "Knowledge and Indigenous Societies"
export { topicsList, topicColours, topics}