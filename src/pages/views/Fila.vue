<template>
  <v-container>
    <!--v-autocomplete
      outlined
      label="Filas"
      multiple
      :items="filas"
      v-model="fila_selecionada"
      item-text="ds_fila"
      item-value="cd_fila_senha"
      @change="mostra_fila()"
      clearable
      clear-icon="mdi-close"
    ></v-autocomplete-->
    <v-row dense>
      <v-col
        cols="12"
        sm="4"
        md="4"
        class="ma-0 pa-0"
        dense
        v-for="(e,i) in fila"
        :key="i"
      >
        <v-checkbox
          v-model="e.ctrl"
          :value="e.chamada"
          :label="e.text"
        ></v-checkbox>
      </v-col>
    </v-row>
     <v-row dense>
      <v-col
        cols="12"
        sm="4"
        md="4"
        class="ma-0 pa-0"
        dense
        v-for="(e,i) in etapa"
        :key="i"
      >
        <v-checkbox
          v-model="e.ctrl"
          :value="e.chamada"
          :label="e.text"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-checkbox
          v-model="categoria"
          :value="2"
          label="Não filtrar categoria LIBERADO PARA CONSULTA"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-data-table
      :items="filtro_senha"
      :loading="loading"
      :search="pesquisa"
      :headers="dataTable_header"
    >
      <template v-slot:top>
        <v-text-field
          v-model="pesquisa"
          label="Filtro"
          class="mx-4"
        ></v-text-field>
      </template>
      <template v-slot:[`item.ordem`]="{ item }">
        {{item.ordem}}
      </template>
      <template v-slot:[`item.categoria`]="{ item }">
        <v-chip :color="item.ds_rgb_hexadecimal">
          {{item.ds_categoria}}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import AppEtlService from '@/service/AppEtlService'
//import UtilsService from '../../service/utilsService';
const api = new AppEtlService();
function monta_arr(val){
  let arr = []
  val.map(v=>{
    v.ctrl.map(c=>{
      c.map(v=>{
        arr.push(v)
      })
    })
  })
  return arr
}

export default {
  name: 'Fila',
  components:{
   },
  data: () => ({
    filtro:[],
    cont:0,
    filas:["","","","","","","","",""],
    etapas:["","","","","","","","",""],
    senhas:[],
    categoria:'',
    fila:[ 
      {id:1,ctrl:[],text:'CONSULTAS, EXAMES E RETORNO',chamada:[20,21,22]}, 
      {id:22,ctrl:[],text:'LENTES DE CONTATO',chamada:[]}, 
      {id:23,ctrl:[],text:'CENTRO CIRÚRGICO',chamada:[]}, 
    ],
    etapa:[ 
      {id:1,ctrl:[],text:'WORKLIST RECEPÇÃO',chamada:[1,20,21]}, 
      {id:22,ctrl:[],text:'WORKLIST PRÉ-CONSULTA',chamada:[22]}, 
    ],
    pesquisa:'',
    loading:false,
    dataTable_header: [
      { text: 'ordem', value: 'ordem' },
      { text: 'Médico', value: 'nm_prestador' },
      { text: 'Tempo * peso', value: 'tempo_peso' },
      //{ text: 'Tempo real', value: 'tempo' },
      { text: 'ds_senha', align: 'start', sortable: false, value: 'ds_senha'},
      { text: 'cd_tip_mar', value: 'cd_tip_mar' },
      { text: 'ds_categoria', value: 'ds_categoria' },
      { text: 'nm_paciente', value: 'nm_paciente' },
      { text: 'tipo', value: 'tipo' },
      { text: 'nm_usuario', value: 'nm_usuario' },
      { text: 'cd_atendimento', value: 'cd_atendimento' },
    ],
  }),
  methods: {
    async get_(query,params,variavel){
      this.loading = true
      return await api.get_query(query,params)
        .then( response => { 
          if(variavel=='filas'){
            this.filas = response.data.map(e=>{
              return e
            }) 
          }else if(variavel=='senhas'){
            this.senhas = response.data
          }
        })
        .catch(error => { console.log(error) })
        .finally( () => { this.loading = false })
    },
    mostra_fila(){
      this.get_(8,'','senhas')
    },
  },
  computed:{
    filtro_senha(){
      let senhas = this.senhas.filter(e=>{
        let x = this.etapas.filter(j=>{
          
          return j==e.cd_tipo_tempo_processo
        }) 

        if(e.cd_categoria!=this.categoria && this.categoria){
          return x==e.cd_tipo_tempo_processo
        }else{
          return x==e.cd_tipo_tempo_processo
        }
      })
      senhas.sort(function (a, b) {
        if (a.tempo_peso < b.tempo_peso) {
          return 1;
        }
        if (a.tempo_peso > b.tempo_peso) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })
      senhas.map((e,i)=>{
        let n = i+1
        return e.ordem = n+'º'
      })
      return senhas
    }
  },
  mounted(){
    //this.get_(7,[1],'filas')
    this.get_(8,this.filas,'senhas')
    setInterval(() => {
      this.get_(8,this.filas,'senhas')
    }, 5000);
  },
  watch:{
    fila:{
      handler(val){
        let c = [0,1,2,3,4,5,6,7,8]
        let arr = monta_arr(val)
        c.map(k=>{
          this.filas[k] = arr[k]||""
        })
      },deep:true
    },
    etapa:{
      handler(val){
        let c = [0,1,2,3,4,5,6,7,8]
        let arr = monta_arr(val)
        
        c.map(k=>{
          this.etapas[k] = arr[k]||""
        })
      },deep:true
    },
  }
  
}
</script>
