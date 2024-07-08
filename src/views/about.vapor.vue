<template>
    <div id="app">
        <div class="board">
            <div v-for="piece in pieces" :key="piece.id" :class="['piece', { active: piece.active }]"
                :style="{ top: piece.top + 'px', left: piece.left + 'px' }" @mousedown="onMouseDown(piece, $event)">
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

import { ref, onMounted, onUnmounted } from 'vue';
const pieces = ref([
    { id: 1, top: 50, left: 50, active: false },
    { id: 2, top: 150, left: 150, active: false },
    // Add more pieces as needed
]);

const selectedPiece = ref(null);
const mouseOffset = ref({ x: 0, y: 0 });
const mouseHeldDown = ref(false);

const onMouseDown = (piece, event) => {
    mouseHeldDown.value = true;
    selectedPiece.value = piece;
    piece.active = true;

    const pieceRect = event.target.getBoundingClientRect();
    mouseOffset.value.x = event.clientX - pieceRect.left;
    mouseOffset.value.y = event.clientY - pieceRect.top;

    // Add event listeners for mousemove and mouseup when a piece is selected
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
};

const onMouseUp = () => {
    if (selectedPiece.value) {
        selectedPiece.value.active = false;
        selectedPiece.value = null;
    }
    mouseHeldDown.value = false;

    // Remove the global event listeners when the piece is released
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
};

const onMouseMove = (event) => {
    if (mouseHeldDown.value && selectedPiece.value) {
        selectedPiece.value.top = event.clientY - mouseOffset.value.y;
        selectedPiece.value.left = event.clientX - mouseOffset.value.x;
    }
};

// Add event listeners to handle global mouse up event to prevent pieces from getting stuck
onMounted(() => {
    window.addEventListener('mouseup', onMouseUp);
});

// Remove event listeners when the component is unmounted
onUnmounted(() => {
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
});
</script>

<style scoped>
.board {
    position: relative;
    width: 600px;
    height: 600px;
    border: 1px solid #000;
}

.piece {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: blue;
    cursor: pointer;
}

.piece.active {
    background-color: red;
    z-index: 10;
}
</style>