//initialize the game board on page load

initBoard()
initCatRow()

document.querySelector('button').addEventListener('click', buildCategories)

//GENERATE CATEGORY ROW
function initCatRow (){
    let catRow = document.getElementById('category-row')

    for (let j = 0; j < 6; j++){
        let box = document.createElement('div')
        box.className = 'clue-box category-box'
        catRow.appendChild(box)
    }
}

//CREATE CLUEBOARD
function initBoard(){
let board = document.getElementById('clue-board')

//generate 5 rows

//outerloop - runs one time and creates a row, then the inner loop runs to create 6 boxes inside the row
for(let i = 0; i < 5; i++){
    let row = document.createElement('div')
    let boxValue = 200 * (i + 1)
    row.className = 'clue-row' //applies CSS styling to this

    //generates 6 boxes within the 5 rows
    for (let j = 0; j < 6; j++){
        let box = document.createElement('div')
        box.className = 'clue-box'
        box.textContent = '$' + boxValue
        box.addEventListener('click', getClue, false)
        row.appendChild(box)
    }
board.appendChild(row)

}
}

//CALL API
function randInt(){
    return Math.floor(Math.random() * (18418) + 1)
}

let catArray = []

function buildCategories(){
    //do 6 initial hits and store those hits in an array

    if(!(document.getElementById('category-row').firstChild.innerText == '')){
        resetBoard()
    }

    const fetchReq1 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());

    const fetchReq2 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());

    const fetchReq3 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());

    const fetchReq4 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());

    const fetchReq5 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());

    const fetchReq6 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then((res) => res.json());

    //this waits until all 6 categories have been fetched and then will store in an array
    const allData = Promise.all([fetchReq1, fetchReq2, fetchReq3, fetchReq4, fetchReq5, fetchReq6]) 

    allData.then((res) => {
        console.log(res)
        catArray = res
        setCategories(catArray) //call to place categories in boxes
    })
}

//RESET BOARD AND DOLLAR AMOUNT IF NEEDED
//this removes all nested children from the associated parent
function resetBoard(){
    let clueParent = document.getElementById('clue-board')
    while (clueParent.firstChild){
        clueParent.removeChild(clueParent.firstChild)
    }
    let catParent = document.getElementById('category-row')
    while (catParent.firstChild){
        catParent.removeChild(catParent.firstChild)
    }
    document.getElementById('score').innerText = 0
}

//LOAD CATEGORIES TO THE BOARD
function setCategories(catArray){
     let element = document.getElementById('category-row')
        let children = element.children; //retrieves the child elements within the parent element
        
        //grabbing each <div> and attaching the category title to html
        for(let i = 0; i < children.length; i++){
            children[i].innerHTML = catArray[i].title 

        }
}

//FIGURE OUT WHICH ITEM WAS CLICKED
//this function will pass in information about what was clicked to know what category it belongs to
function getClue(event){
    let child = event.currentTarget
    child.classList.add('clicked-box')
    let boxValue = child.innerHTML.slice(1)//gives us value we want to search when we click
    let parent = child.parentNode
    let index = Array.prototype.findIndex.call(parent.children, (c) => c === child)
    let cluesList = catArray[index].clues
    let clue = cluesList.find(obj => {
        return obj.value == boxValue
    })
    showQuestion(clue, child, boxValue)
}

//SHOW QUESTION TO USER & GET ANSWER
function showQuestion(clue, target, boxValue){
    let userAnswer = prompt(clue.question).toLowerCase()
    let correctAnswer = clue.answer.toLowerCase()
    let possiblePoints = +(boxValue) //converts string to number
    target.innerHTML = clue.answer 
    target.removeEventListener('click', getClue, false)
    evaluateAnswer(userAnswer, correctAnswer, possiblePoints)
}

//EVALUATE ANSWER AND SHOW TO USER TO CONFIRM
function evaluateAnswer(userAnswer, correctAnswer, possiblePoints){
    let checkAnswer = (userAnswer == correctAnswer) ? 'correct' : 'incorrect'
    let confirmedAnswer = 
    confirm(`For ${possiblePoints}, you answered "${userAnswer}", and the correct answer was "${correctAnswer}". Your answer appears to be ${checkAnswer}. Click OK to accept or click Cancel if the answer was not properly evaluated.`)

    awardPoints(checkAnswer, confirmedAnswer, possiblePoints)
}

//AWARD POINTS
function awardPoints(checkAnswer, confirmedAnswer, possiblePoints){
    if(!(checkAnswer == 'incorrect' && confirmedAnswer == true)){
        //award points
        let target = document.getElementById('score')
        let currentScore = +(target.innerText)
        currentScore += possiblePoints
        target.innerText = currentScore 
    }else{
        alert(`No points awarded`)
    }
}