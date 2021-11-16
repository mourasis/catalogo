<template>
  <v-app>
      <v-container>
        <h1>GAME JOLT</h1>
        <br>
        <v-card v-for="i in catalogos" :key="i.titulo">
           
           <v-img src="./assets/crunchyroll.png"> 
            <v-card-title class="white--text">{{i.titulo}}</v-card-title>
           </v-img>
        </v-card>
      </v-container>
  </v-app>
</template>

<script>


export default {
  name: 'App',
  data:()=>({
    catalogos:[{titulo:"Crunchyroll",imagem:"crunchyroll.png"}]
  }),
  mounted(){
    this.catalogos=[{titulo:"Crunchyroll",imagem:"crunchyroll.png"}]
  }
};  
</script>