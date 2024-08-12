<template>

    <body>
        <a class="mail" title="overvloed6@hotmail.com" href="mailto:overvloed6@hotmail.com">Email ons...</a>
    </body>

</template>

<script setup>

import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

</script>

<style scoped>

.mail{
    font-size: larger
}

</style>