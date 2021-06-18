export default {
    methods: {
        getSchoolYear(): number[]{
            let out = [] as number[]
            const dateMachine = new Date();
            const yearNum = dateMachine.getFullYear();
            const month = dateMachine.getMonth();
            if (month < 9) out = [yearNum - 1, yearNum]
            else if (month >= 9) out = [yearNum, (yearNum + 1)]
            return out
        },
        getSchoolYearString(): string{
            const [a, b] = this.getSchoolYear();
            return a.toString() + "-" + b.toString();
        }
    },
}