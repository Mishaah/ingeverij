<template>
    <body>
        <h1>De ingeverij - about</h1>
        <p class="subtitle">is in opbouw... <br>
            <a title="overvloed6@hotmail.com" href="mailto:overvloed6@hotmail.com?subject=Mail from Our Site">Email Us</a>
        </p>
        <a @click.prevent="()=>{router.push({name:'aboutView'})}">
            About
        </a>
        <br>
        <router-link :to="{ name: 'aboutView' }">asadasd</router-link>
        <br>
        <router-link :to="{ name: 'homeView' }">asaaaaaaaaaaaaadasd</router-link>
    </body>
    
    </template>
    
    <script setup>
    
    import { useRouter, useRoute } from 'vue-router'
    
    const router = useRouter()
    const route = useRoute()
    
    </script>
    
    <style scoped>
    p.subtitle{
        line-height: 0.7;
        font-size: 11;
        font-style: italic;
    }
    [aria-current]{
        background-color:hotpink;
    }
    </style>