<template>
  <div id="app">
    <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" alt="Pokémon" class="logo" style="width: 600px; height: auto;">
    <h2>¿Creés ser el mejor maestro pokemon del mundo?</h2>
    <h3>Memoriza la mayor cantidad de Pokemons y demuestralo!!</h3>
    <h1>Equipo elegido para esta ronda:</h1>
    <div v-if="equipoPokemon.length===0">
      <h4>Cargando equipo Pokemon...</h4>
    </div>
    <div class="button-container" v-else>
      <ImageButton
          v-for="(imageSrc, index) in equipoPokemon"
          :key="index"
          :imageSrc="imageSrc"
      />
    </div>
    <button class="start-button"
            v-if="equipoPokemon.length!==0"
    ></button>
  </div>
</template>

<script>

import ImageButton from './components/ImageButton.vue';

export default {
  name: 'App',
  data(){
    return {
      equipoPokemon: []
    }
  },
  components: {
    ImageButton
  },
  methods: {
    ObtenerEquipoInicial (){

    }
  },
  mounted: {

  },
  created: {

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.start-button {
  width: 150px; /* Ajusta el tamaño según sea necesario */
  height: 50px; /* Ajusta el tamaño según sea necesario */
  background-image: url('https://static.vecteezy.com/system/resources/thumbnails/017/522/394/small/button-for-8-bit-games-start-beginning-vector.jpg');
  background-size: cover;
  background-position: center;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.start-button:hover {
  transform: scale(1.1);
}
</style>
