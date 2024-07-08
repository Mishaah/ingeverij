<!-- <template> -->
<!--  -->
    <!-- <body> -->
        <!-- <div class="anagrid"> -->
            <!-- <div class="item item1-1"> </div> -->
            <!-- <div class="item item2-2"> </div> -->
            <!-- <div class="item item3-3">g</div> -->
            <!-- <div class="item item2-1"> </div> -->
            <!-- <div class="item item2-2">o</div> -->
            <!-- <div class="item item2-3"> </div> -->
            <!-- <div class="item item3-1">d</div> -->
            <!-- <div class="item item3-2"> </div> -->
            <!-- <div class="item item3-3"> </div> -->
<!--  -->
        <!-- </div> -->
    <!-- </body> -->
<!-- </template> -->

<script setup>

import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

</script>

<style scoped>

body{
    align-items: center;
    justify-items: center;
    display: grid;
}

.anagrid {
    display: grid;
    width: 80vmin;
    height: 80vmin;
    aspect-ratio: 1;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    justify-items: center;
    font-size: 20vmin;
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
</style>