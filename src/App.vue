<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <div class="navbar-parent">
    <h1 class="navbar-title">De Ingeverij</h1>

    <nav class="navbar">
      <div class="navbar-children">
        <div><router-link :to="{ name: 'homeView' }">Home</router-link></div>
        <!-- <div><router-link :to="{ name: 'aboutView' }">About</router-link></div> -->
        <div><router-link :to="{ name: 'anagrammarView' }">Anagrammar</router-link></div>
      </div>
    </nav>
  </div>
  <main>
    <RouterView />
  </main>

</template>

<style>
body {
  margin: 0px;
}
main {
  margin: 20px;
}
.navbar-parent{
  display: grid;
  grid-template-columns: auto 1fr;
}
.navbar-title{
  font-size: 20px;
  padding-left: 10px;
  padding-right: 10px;
}

p.subtitle {
  font-size: 20px;
  font-style: italic;
}

[aria-current] {
  background-color: black;
}
.navbar-children {
  display: grid;
  grid-template-columns: auto auto auto 1fr;
  list-style-type: none;
  background-color: hsl(0, 0%, 25%);
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}
.navbar a {
  color: white;
  text-decoration: none;
  padding: 15px;
  display: block;
  text-align: center;
}
.navbar a:hover {
  background-color: hsl(0, 0%, 20%)
}

</style>

<style scoped></style>
