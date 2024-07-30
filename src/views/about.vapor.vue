<template>

    <button type="button" @click="resetGrid()">reset grid</button>
    <button type="button" @click="shuffleCharacters()">shuffle characters</button>
    <button type="button" @click="validateGrid()">validate grid</button>
    <button type="button" @click="setupGrid()">new anagram</button>

    <div class="spot-grid" :style="{
        '--grid-rows': baseAnagram.length,
        '--grid-columns': baseAnagram.length
    }">
        <div v-for="spot in spots.slice(baseAnagram.length)" :key="spot.id" class="spot" @drop="onDrop($event, spot.id)"
            @dragenter.prevent @dragover.prevent>
            <div v-if="spot.piece" :key="spot.piece.id" class="piece" @dragstart="startDrag($event, spot.piece.id)"
                draggable="true">
                <svg viewBox="0 0 100 100" width="100%" height="100%" text-anchor="middle" dominant-baseline="middle">
                    <text x="50" y="50" font-size="300%">
                        {{ spot.piece.char }}
                    </text>
                </svg>
            </div>
        </div>
    </div>
    <div class="spot-inv" :style="{
        '--grid-rows': 1,
        '--grid-columns': baseAnagram.length
    }">
        <div v-for="spot in spots.slice(0, baseAnagram.length)" :key="spot.id" class="spot"
            @drop="onDrop($event, spot.id)" @dragenter.prevent @dragover.prevent>
            <div v-if="spot.piece" :key="spot.piece.id" class="piece" @dragstart="startDrag($event, spot.piece.id)"
                draggable="true">
                <svg viewBox="0 0 100 100" width="100%" height="100%" text-anchor="middle" dominant-baseline="middle">
                    <text x="50" y="50" font-size="300%">
                        {{ spot.piece.char }}
                    </text>
                </svg>
            </div>
        </div>
    </div>

    <div>
        <h1>Anagram</h1>
        <pre>{{ anagram }}</pre>
    </div>
    <div>
        <h1>Base Anagram</h1>
        <pre>{{ baseAnagram }}</pre>
    </div>
    <div>
        <h1>Base Anagram Length</h1>
        <pre>{{ baseAnagram.length }}</pre>
    </div>
    <div>
        <h1>Anagram List</h1>
        <pre>{{ anagrams }}</pre>
    </div>
    <div>
        <h1>Anagram List Length</h1>
        <pre>{{ anagrams.length }}</pre>
    </div>
    <div>
        <h1>Dictionary List</h1>
        <pre>{{ dictionary }}</pre>
    </div>


</template>

<script setup>

import { ref, onMounted, computed } from 'vue';

const anagrams = ref([]);
const dictionary = ref('');

let anagram = ref('');
let baseAnagram = ref('');

let pieces = ref([])
let spots = ref([])

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
    }
    else {
        console.log("drag failed because missing data: ")
        console.log(draggedPiece)
        console.log(oldSpot)
        console.log(newSpot)
    }
}

const setupGrid = async () => {
    if (anagrams.value.length == 0) await fetchAnagrams();
    chooseAnagram(); // 18 is easy example
    createPieces();
    createSpots(pieces.value);
}
const fetchAnagrams = async () => {
    try {
        const response = await fetch('/english_anagrams_simple.txt');
        const data = await response.text();
        anagrams.value = data.split(/\r\n|\r|\n/);
    } catch (error) {
        console.error('Error fetching anagrams:', error);
    }
};
const fetchDictionary = async () => {
    try {
        const response = await fetch('/english_dictionary.txt');
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
    baseAnagram.value = anagram.value.match(/^(\S+)\s(.*)/).slice(1)[0].split("").sort().join("");
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
const validateGrid = () => {
    const readWordXA = readGrid(true, true)
    const readWordXD = readGrid(true, false)
    const readWordYA = readGrid(false, true)
    const readWordYD = readGrid(false, false)

    const XAIsWord = (dictionary.value.indexOf(readWordXA) != -1) * readWordXA.length > 0
    const XDIsWord = (dictionary.value.indexOf(readWordXD) != -1) * readWordXD.length > 0
    const YAIsWord = (dictionary.value.indexOf(readWordYA) != -1) * readWordYA.length > 0
    const YDIsWord = (dictionary.value.indexOf(readWordYD) != -1) * readWordYD.length > 0

    console.log("is " + ((XAIsWord) ? "" : "not ") + "a word read horizontal ascending: " + readWordXA)
    console.log("is " + ((XDIsWord) ? "" : "not ") + "a word read horizontal descending: " + readWordXD)
    console.log("is " + ((YAIsWord) ? "" : "not ") + "a word read vertical ascending: " + readWordYA)
    console.log("is " + ((YDIsWord) ? "" : "not ") + "a word read vertical descending: " + readWordYD)

    const sudokuValid = validateSudokuRule()
    console.log("sudoku rule " + ((sudokuValid) ? "" : "in") + "valid")
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

onMounted(setupGrid);
onMounted(fetchDictionary);
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

.spot-grid {
    box-sizing: border-box;
    display: grid;
    width: 80vmin;
    height: 80vmin;
    aspect-ratio: 1;
    grid-template-rows: repeat(var(--grid-rows), 1fr);
    grid-template-columns: repeat(var(--grid-columns), 1fr);
    align-items: center;
    justify-items: center;
    background-color: white;
    border: 2px solid black;
    margin-top: 20px;
}

.spot-inv {
    box-sizing: border-box;
    display: grid;
    width: 80vmin;
    height: calc(80vmin / var(--grid-columns));
    grid-template-rows: repeat(var(--grid-rows), 1fr);
    grid-template-columns: repeat(var(--grid-columns), 1fr);
    align-items: center;
    justify-items: center;
    background-color: white;
    border: 2px solid black;
    margin-top: 20px;
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
    border: 1px solid black;
    width: 100%;
    height: 100%;
    user-select: none;
}
</style>