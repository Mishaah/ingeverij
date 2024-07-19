<template>

    <!-- <div class="anagrid" id="anagrid" :style="gridStyles" > -->
    <!--  -->
    <!-- </div> -->
    <div class="drop-zone" @drop="onDrop($event, 1)" @dragenter.prevent @dragover.prevent>
        <div v-for="item in getList(1)" :key="item.id" class="drag-el" draggable="true"
            @dragstart="startDrag($event, item)">
            {{ item.title }}
        </div>
    </div>
    <div class="drop-zone" @drop="onDrop($event, 2)" @dragenter.prevent @dragover.prevent>
        <div v-for="item in getList(2)" :key="item.id" class="drag-el" draggable="true"
            @dragstart="startDrag($event, item)">
            {{ item.title }}
        </div>
    </div>



    <p><strong>Previous Index: </strong> {{ oldIndex }}</p>
    <p><strong>New Index: </strong> {{ newIndex }}</p>


    <div class="anagrid" :style="{
        '--grid-rows': baseAnagram.length,
        '--grid-columns': baseAnagram.length
    }">
        <!-- zoek een manier om de letters dynamisch te tekenen dmv svg of emoji's, iig moet het veld een vierkant zijn. -->
        <div v-for="item in gridItems" :key="item.id" class="item">
            {{ item.name }}
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

const anagram = ref('');
const baseAnagram = ref('');

const oldIndex = ref('')
const newIndex = ref('')

const items = ref([
    { id: 0, title: 'Item A', list: 1 },
    { id: 1, title: 'Item B', list: 1 },
    { id: 2, title: 'Item C', list: 1 },
    { id: 3, title: 'Item D', list: 2 },
    { id: 4, title: 'Item E', list: 2 },
])

const getList = (list) => {
    return items.value.filter((item) => item.list == list)
}

const gridItems = computed(() => {
    let tempArray = []

    let size = baseAnagram.value.length * baseAnagram.value.length
    for (let i = 0; i < size; i++) {
        tempArray.push({ name: 'a', id: Math.random + '-id' })
    }
    // baseAnagram.value.split('').forEach((letter)=>{tempArray.push({name:letter, id:Math.random+'-id'})})
    return tempArray
}

)

const startDrag = (event, item) => {
    console.log(item)
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('itemID', item.id)
}
const onDrop = (event, list) => {
    const itemID = event.dataTransfer.getData('itemID')
    const item = items.value.find((item) => item.id == itemID)
    item.list = list
}

const setupBoard = async () => {
    await fetchAnagrams();
    chooseAnagram();
    //addInvSpots();
    //addPieces();
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

.anagrid {
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
}

.item {
    box-sizing: content-box;
    display: grid;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    width: 100%;
    height: 100%;
}

.drop-zone {
    width: 50%;
    margin: 50px auto;
    background-color: lightgray;
    padding: 10px;
    min-height: 10px;
}

.drag-el {
    background-color: aqua;
    color: white;
    padding: 50px;
    margin-bottom: 10px;
}
</style>