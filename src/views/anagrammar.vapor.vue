<template>

    <div class="anagrammar">

        <div class="clue">
            {{ anagram.clue }}
        </div>

        
        <div class="spot-board" :style="{
            '--board-rows': baseAnagram.length,
            '--board-columns': baseAnagram.length
        }">

            <div v-for="spot in spots.slice(baseAnagram.length)" :key="spot.id" class="spot"
                @drop="onDrop($event, spot.id)" @dragenter.prevent @dragover.prevent>
                <transition-group name="move" tag="div" class="piece-container" @before-enter="beforeEnter"
                    @enter="enter">
                    <div v-if="spot.piece" :key="spot.piece.id" class="piece"
                        @dragstart="startDrag($event, spot.piece.id)" draggable="true">
                        <svg viewBox="0 0 100 100" width="100%" height="100%" text-anchor="middle"
                            dominant-baseline="middle">
                            <text x="50" y="50" font-size="300%">
                                {{ spot.piece.char }}
                            </text>
                        </svg>
                    </div>
                </transition-group>
            </div>
        </div>


        <div class="spot-inv" :style="{
            '--board-rows': 1,
            '--board-columns': baseAnagram.length
        }">

            <div v-for="spot in spots.slice(0, baseAnagram.length)" :key="spot.id" class="spot"
                @drop="onDrop($event, spot.id)" @dragenter.prevent @dragover.prevent>
                <transition-group name="move" tag="div" class="piece-container" @before-enter="beforeEnter"
                    @enter="enter">
                    <div v-if="spot.piece" :key="spot.piece.id" class="piece"
                        @dragstart="startDrag($event, spot.piece.id)" draggable="true">
                        <svg viewBox="0 0 100 100" width="100%" height="100%" text-anchor="middle"
                            dominant-baseline="middle">
                            <text x="50" y="50" font-size="300%">
                                {{ spot.piece.char }}
                            </text>
                        </svg>
                    </div>
                </transition-group>
            </div>
        </div>
        <div class="board-buttons">
            <button class="board-button" type="button" @click="resetGrid()">Reset</button>
            <button class="board-button" type="button" @click="shuffleCharacters()">Shuffle</button>
            <button class="board-button" type="button" @click="validateGrid()"
                :style="{ backgroundColor: isCorrect ? 'lightgreen' : 'white' }">Try</button>
            <button class="board-button" type="button" @click="setupGrid()">New</button>
        </div>
    </div>

</template>

<script setup>

import { ref, onMounted, computed } from 'vue';

const anagrams = ref([]);
const dictionary = ref('');
//TODO: onderscheid maken clue en geen clue

let anagram = ref('');
let baseAnagram = ref('');

let isCorrect = ref(false)

let pieces = ref([])
let spots = ref([])



//const beforeEnter = (el) => {
//    el.style.position = 'absolute';
//
//    requestAnimationFrame(() => {
//        const startRect = el.getBoundingClientRect();
//        el.dataset.startX = startRect.left + window.scrollX;
//        el.dataset.startY = startRect.top + window.scrollY;
//        console.log(el.dataset.startX)
//        console.log(el.dataset.startY)
//    });
//}
//
//const enter = (el, done) => {
//
//    requestAnimationFrame(() => {
//        requestAnimationFrame(() => {
//            const startX = parseFloat(el.dataset.startX);
//            const startY = parseFloat(el.dataset.startY);
//
//            const endRect = el.getBoundingClientRect();
//            const deltaX = startX - endRect.left - window.scrollX;
//            const deltaY = startY - endRect.top - window.scrollY;
//
//            console.log("sx: " + startX)
//            console.log("sy: " + startY)
//            console.log("dx: " + deltaX)
//            console.log("dy: " + deltaY)
//            console.log(endRect.left)
//            console.log(endRect.top)
//
//            el.animate(
//                [
//                    { transform: `translate(${deltaX}px, ${deltaY}px)` },
//                    { transform: `translate(0px, 0px)` }
//                ],
//                {
//                    duration: 300,
//                    fill: 'forwards'
//                }
//            )
//            el.style.position = 'relative';
//
//            el.addEventListener('animationend', done, { once: true });
//        });
//    });
//}

const startDrag = (event, pieceID) => {
    console.log("piece ID: " + pieceID)

    const oldSpotID = spots.value.findIndex(spot => spot.piece && spot.piece.id === pieceID);
    console.log("old spot ID: " + pieceID)

    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'

    event.dataTransfer.setData('pieceID', pieceID)
    event.dataTransfer.setData('oldSpotID', oldSpotID)
}
const onDrop = (event, spotID) => {
    console.log("spot ID: " + spotID)

    const draggedPieceID = event.dataTransfer.getData('pieceID')
    const oldSpotID = event.dataTransfer.getData('oldSpotID')

    if (oldSpotID == spotID) return

    const draggedPiece = pieces.value[draggedPieceID]
    const oldSpot = spots.value[oldSpotID]
    const newSpot = spots.value[spotID]

    if (draggedPiece && oldSpot && newSpot) {
        console.log("setting piece " + draggedPieceID + " to spot " + spotID);

        oldSpot.piece = newSpot.piece == null ? null : { ...newSpot.piece };
        newSpot.piece = { ...draggedPiece };

        spots.value = [...spots.value] //necessary for reactivity?
    }
    else {
        console.log("drag failed because missing data: ")
        console.log(draggedPiece)
        console.log(oldSpot)
        console.log(newSpot)
    }

    isCorrect.value = false
}

const setupGrid = async () => {
    if (anagrams.value.length == 0) await fetchAnagrams();
    chooseAnagram();
    createPieces();
    createSpots(pieces.value);

    isCorrect.value = false
}
const fetchAnagrams = async () => {
    try {
        const response = await fetch('/dutch_anagrams_curated.json');
        //const data = await response.text();
        //anagrams.value = data.split(/\r\n|\r|\n/);
        const data = await response.json();
        anagrams.value = data;
    } catch (error) {
        console.error('Error fetching anagrams:', error);
    }
};
const fetchDictionary = async () => {
    try {
        const response = await fetch('/dutch_dictionary.txt');
        const data = await response.text();
        dictionary.value = data;
    } catch (error) {
        console.error('Error fetching dictionary:', error);
    }
};
const chooseAnagram = (index = -1) => {
    if (anagrams.value.length == 0) return
    if (index >= 0 && index <= (anagrams.value.length - 1)) {
        anagram.value = anagrams.value[index]
    }
    else {
        anagram.value = anagrams.value[Math.floor(Math.random() * anagrams.value.length)]
    }
    baseAnagram.value = anagram.value.words[0].split("").sort().join("");
    console.log(anagram.value)
}
const createPieces = () => {
    let newPieces = []

    let amountOfPieces = baseAnagram.value.length

    for (let i = 0; i < amountOfPieces; i++) {
        newPieces.push({ id: i, char: baseAnagram.value[i] })
    }
    pieces.value = newPieces
}
const createSpots = (createdPieces) => {
    let newSpots = []
    let i = 0

    let amountOfInvSpots = baseAnagram.value.length
    let amountOfGridSpots = (baseAnagram.value.length * baseAnagram.value.length)

    for (i; i < amountOfInvSpots; i++) {
        newSpots.push({ id: i, piece: createdPieces[i] })
    }
    for (i; i < (amountOfGridSpots + amountOfInvSpots); i++) {
        newSpots.push({ id: i, piece: null })
    }
    spots.value = newSpots
}
const resetGrid = () => {
    let i = 0

    let amountOfInvSpots = baseAnagram.value.length
    let amountOfGridSpots = (baseAnagram.value.length * baseAnagram.value.length)

    for (i; i < amountOfInvSpots; i++) {
        spots.value[i].piece = { ...pieces.value[i] };
    }
    for (i; i < (amountOfGridSpots + amountOfInvSpots); i++) {
        spots.value[i].piece = null;
    }
    isCorrect.value = false
}
const shuffleCharacters = () => {
    let index = baseAnagram.value.length
    resetGrid()

    while (index != 0) {
        let randomIndex = Math.floor(Math.random() * index)
        index--

        [spots.value[index].piece, spots.value[randomIndex].piece] = [spots.value[randomIndex].piece, spots.value[index].piece]
    }
}
//TODO: change the nameing of grid into board
const validateGrid = () => {
    const readWords = {
        readWordXA: "",
        readWordXD: "",
        readWordYA: "",
        readWordYD: "",
    }
    readWords.readWordXA = readGrid(true, true)
    readWords.readWordXD = readGrid(true, false)
    readWords.readWordYA = readGrid(false, true)
    readWords.readWordYD = readGrid(false, false)

    const wordsAreValid = {
        XAIsWord: false,
        XDIsWord: false,
        YAIsWord: false,
        YDIsWord: false,
    }

    wordsAreValid.XAIsWord = (dictionary.value.indexOf(readWords.readWordXA) != -1) * readWords.readWordXA.length > 0
    wordsAreValid.XDIsWord = (dictionary.value.indexOf(readWords.readWordXD) != -1) * readWords.readWordXD.length > 0
    wordsAreValid.YAIsWord = (dictionary.value.indexOf(readWords.readWordYA) != -1) * readWords.readWordYA.length > 0
    wordsAreValid.YDIsWord = (dictionary.value.indexOf(readWords.readWordYD) != -1) * readWords.readWordYD.length > 0

    console.log("is " + ((wordsAreValid.XAIsWord) ? "" : "not ") + "a word read horizontal ascending: " + readWords.readWordXA)
    console.log("is " + ((wordsAreValid.XDIsWord) ? "" : "not ") + "a word read horizontal descending: " + readWords.readWordXD)
    console.log("is " + ((wordsAreValid.YAIsWord) ? "" : "not ") + "a word read vertical ascending: " + readWords.readWordYA)
    console.log("is " + ((wordsAreValid.YDIsWord) ? "" : "not ") + "a word read vertical descending: " + readWords.readWordYD)

    const sudokuValid = validateSudokuRule()
    console.log("sudoku rule " + ((sudokuValid) ? "" : "in") + "valid")

    const anagrammarValid = (sudokuValid && (Object.values(wordsAreValid).filter(Boolean).length >= 2))
    console.log("anagrammar is " + ((anagrammarValid) ? "" : "in") + "valid")

    isCorrect.value = anagrammarValid; //TODO: make more permanent solution
}
const readGrid = (horizontal, ascending) => {
    const size = baseAnagram.value.length

    let readWord = ""
    let x, y

    for (y = (ascending) ? 0 : size - 1; y < size && y >= 0; y += (ascending) ? 1 : -1) {
        for (x = (ascending) ? 0 : size - 1; x < size && x >= 0; x += (ascending) ? 1 : -1) {
            const readPiece = (spots.value[(size + y * ((horizontal) ? 1 : size) + x * ((horizontal) ? size : 1))]).piece
            const readLetter = (readPiece == null) ? "" : readPiece.char
            readWord += readLetter
        }
    }
    return readWord
}
const validateSudokuRule = () => { // exactly 1 letter in a given row or column
    //make return an array of all invalid?
    const size = baseAnagram.value.length

    let sudokuValidity = true
    let x, y

    for (y = 0; y < size; y++) {
        let rowHasPiece = false
        let colHasPiece = false
        for (x = 0; x < size; x++) {
            if ((spots.value[(size + y * size + x)]).piece != null) {
                if (rowHasPiece) sudokuValidity = false
                else rowHasPiece = true
            }
            if ((spots.value[(size + x * size + y)]).piece != null) {
                if (colHasPiece) sudokuValidity = false
                else colHasPiece = true
            }
        }
        if (rowHasPiece == false || colHasPiece == false) sudokuValidity = false
    }
    return sudokuValidity
}

onMounted(()=>{
    setupGrid()
    fetchDictionary() 
})
</script>

<style scoped>
pre {
    white-space: pre-wrap;
}

body {
    align-items: center;
    justify-items: center;
    display: grid;
}

.anagrammar {
    align-items: center;
    justify-items: center;
    display: grid;
}


.spot-board {
    box-sizing: border-box;
    display: grid;
    width: calc(min(80vmin, 500px));
    height: calc(min(80vmin, 500px));
    aspect-ratio: 1;
    grid-template-rows: repeat(var(--board-rows), 1fr);
    grid-template-columns: repeat(var(--board-columns), 1fr);
    align-items: center;
    justify-items: center;
    background-color: white;
    border: 2px solid black;
    margin-top: 20px;
}

.spot-inv {
    box-sizing: border-box;
    display: grid;
    width: calc(min(80vmin, 500px));
    height: calc(calc(min(80vmin, 500px)) / var(--board-columns));
    aspect-ratio: 1;
    grid-template-rows: repeat(var(--board-rows), 1fr);
    grid-template-columns: repeat(var(--board-columns), 1fr);
    align-items: center;
    justify-items: center;
    background-color: white;
    border: 2px solid black;
    margin: 2vmin 0px 0px 0px;
}

.piece {
    box-sizing: border-box;
    aspect-ratio: 1;
    display: grid;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    width: 100%;
    height: 100%;
    user-select: none;
}

.spot {
    box-sizing: border-box;
    aspect-ratio: 1;
    display: grid;
    justify-content: center;
    align-items: center;
    border: 2px solid black;
    width: 100%;
    height: 100%;
    user-select: none;
    position: relative;
}

.piece-container {
    position: absolute;
    width: 100%;
    height: 100%;
}

.clue {
    font-size: 4vmin;
    height: 10vmin;
    width: calc(min(80vmin, 500px));
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-style: italic;
}

.board-buttons {
    display: grid;
    width: calc(min(80vmin, 500px));
    height: calc(calc(min(80vmin, 500px)) / var(--board-columns));
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}

.board-button {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    box-sizing: border-box;
    display: grid;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    user-select: none;
    background-color: white;
}

/* .move-enter-active, .move-leave-active {
  transition: transform 0.5s;
}

.move-enter-from, .move-leave-to {
  transform: translate(0, 0);
} */
/* .move-enter-active,
.move-leave-active {
    transition: transform 0.3s ease-in-out;
}

.move-enter-from{
    transform: translate(0%)
}
.move-leave-to {
    transform: translate(100%)
}

.move-enter-to {
    transform: translate(100%);
}
.move-leave-from {
    transform: translate(0%);
} */
</style>