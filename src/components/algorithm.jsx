

const arr = [
    [1, 2, 3, 5, 66],
    [9, 10, 34, 35],
    [67, 243, 467, 23],
    [101, 102, 103],
]

const q = 10


const distributQuestion = (questions, mcq, theory) => {

    
    questions.forEach((chapter, index) => {
        console.log(chapter, index)
        chapter.forEach((question) => {
            if (question.type.toLowerCase() == "mcq") mcq.push(question)
            else theory.push(question)
        })
    })
}

const getRandom = (max) => {
    return Math.floor(Math.random() * 100) % max
}

const pickQuestions = (temp, subQuestions) => {

    console.log(temp, subQuestions)
    let questionsArr = []
    let indexCounter = 0;
    for (let i = 0; i < subQuestions; i++) {
        if (indexCounter >= temp.length) indexCounter = 0;
        let chapterQusetionsLength = temp.length;
        let getRandomQuestionIndex = getRandom(chapterQusetionsLength);
        questionsArr.push(temp[getRandomQuestionIndex]);
        // simultaneously delete the item from parent array it will help u selecting another quesitons
        temp.splice(getRandomQuestionIndex, 1);
        indexCounter += 1;
    }
    // return questions array 
    console.log(questionsArr)
    return questionsArr;

}

export const getQuestion = (easyQArr, mediumQArr, hardQArr, questionsObject, sets) => {

    // ap
    const MCQ = "MCQ"
    const THEORY = "Theory"


    // Generate Array from q 
    // Filter theory and mcq 
    // Array contains chapter wise questions 

    let easyTheory = []
    let easyMcq = []
    let mediumTheory = []
    let mediumMcq = []
    let hardTheroy = []
    let hardMcq = []
    let temp = []

    let papers = []


    distributQuestion(easyQArr, easyMcq, easyTheory)
    distributQuestion(mediumQArr, mediumMcq, mediumTheory)
    distributQuestion(hardQArr, hardMcq, hardTheroy)


    console.log(easyMcq, easyTheory)
    for (let set = 0; set < sets; set++) {
        // dividing all theory and mcq questions 
        let paper = []

        for (let subQuestions in questionsObject) {
            console.log(questionsObject[subQuestions])

            let difficulty = questionsObject[subQuestions].difficulty
            let numberOfSubQue = questionsObject[subQuestions].subQuestions
            let type = questionsObject[subQuestions].type

            // questions object containe all the sub questions 
            if (difficulty == "Easy") {

                if (type == MCQ) paper.push(pickQuestions(easyMcq, numberOfSubQue))
                else paper.push(pickQuestions(easyTheory, numberOfSubQue))

            } else if (difficulty == "Medium") {
                if (type == MCQ) paper.push(pickQuestions(mediumMcq, numberOfSubQue))
                else paper.push(pickQuestions(mediumTheory, numberOfSubQue))

            } else {
                // this is hard block 
                if (type == MCQ) paper.push(pickQuestions(hardMcq, numberOfSubQue))
                else paper.push(pickQuestions(hardTheroy, numberOfSubQue))
            }
        }
        papers.push(paper)
    }

    return papers
    // paper contains single question paper 


    // easyQArr.forEach((chapter, index) => {
    //     console.log(chapter, index)
    //     chapter.forEach((question) => {
    //         if (question.type.toLowerCase() == "mcq") easyMcq.push(question)
    //         else easyTheroy.push(question)
    //     })
    //     if (questionFormat.type.toLowerCase() == "mcq") temp.push(easyMcq)
    //     else temp.push(easyTheroy)
    // })

    // console.log(temp)

    // let questionsArr = []


    // let indexCounter = 0;

    // for (let i = 0; i < q; i++) {
    //     if (indexCounter >= temp.length) indexCounter = 0;
    //     let chapterQusetionsLength = temp[indexCounter].length;
    //     let getRandomQuestionIndex = getRandom(chapterQusetionsLength);
    //     questionsArr.push(temp[indexCounter][getRandomQuestionIndex]);
    //     // simultaneously delete the item from parent array it will help u selecting another quesitons
    //     temp[indexCounter].splice(getRandomQuestionIndex, 1);
    //     indexCounter += 1;

    // }

    // // return questions array 

    // return questionsArr;

    // let arr_ = [...temp]
    // console.log(temp)

    // const selecteQuestion = (chArr) => {
    //     let question = getRandom(chArr.length)
    //     return question
    // }

    // let c = 1
    // let ref = []
    // let chs = new Map()
    // let add = 0

    // while (c <= q) {
    //     if (temp.length == 0) {
    //         temp = [...arr_]
    //         add = arr_.length + add
    //     }
    //     let chapter = getRandom(temp.length)
    //     // Chapter
    //     let chQue = temp.splice(chapter, 1)
    //     // Questions 
    //     let ch = chQue[0]

    //     let Que = selecteQuestion(ch)
    //     let selected = ch.splice(Que, 1)
    //     chapter += add
    //     while (chs.has(chapter)) {
    //         chapter += 1
    //     }
    //     chs.set(chapter, selected)
    //     c += 1
    // }



    // let arrQue = []
    // let resetCou = 0
    // let hasReseted = false

    // for (let i = 0; i <= q + arr_.length; i++) {
    //     if (resetCou == arr_.length) {
    //         resetCou = 0
    //         hasReseted = true
    //     }
    //     if (chs.has(i))
    //         if (!hasReseted) arrQue.push(chs.get(i))
    //         else arrQue[resetCou] = [...arrQue[resetCou], ...chs.get(i)]
    //     resetCou += 1
    // }

    // let merged = []

    // for (let e of arrQue) {
    //     merged = merged.concat(e)
    // }

    // console.log(merged)
    // return merged
    // return arrQue


}