<template>

<button type="button" @click="resetGrid()">Click Me!</button> 

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

const setupBoard = async () => {
    await fetchAnagrams();
    createPieces();
    createSpots(pieces.value);
}
const fetchAnagrams = async () => {
    try {
        const response = await fetch('/english_anagrams_simple.txt');
        const data = await response.text();
        anagrams.value = data.split(/\r\n|\r|\n/);
        chooseAnagram();
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
const chooseAnagram = () => {
    if (anagrams.value.length > 0) {
        anagram.value = anagrams.value[Math.floor(Math.random() * anagrams.value.length)]
        baseAnagram.value = anagram.value.match(/^(\S+)\s(.*)/).slice(1)[0].split("").sort().join("");
    }
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

    for(i; i < amountOfInvSpots; i++)
    {
        spots.value[i].piece = { ...pieces.value[i] };
    }
    for (i; i < (amountOfGridSpots + amountOfInvSpots); i++) {
        spots.value[i].piece = null;
    }
}

onMounted(setupBoard);
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