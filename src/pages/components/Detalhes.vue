<template>
  <v-dialog
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        color="green"
        class="pr-4 ma-2"
        @click="get_procedimentos()"
      ><v-icon class="mx-2 white--text">mdi-eye-outline</v-icon></v-btn>
    </template>
    <v-card
      class="my-auto"
      :loading="loading_procedimentos"
    >
      <v-card-title>
        <v-row>
          <v-col cols="2">
            Cod: <b>{{item.cd_paciente}}</b> 
          </v-col>
          <v-col cols="9">  
            Paciente: <b>{{item.nm_paciente}}</b>
          </v-col>
          <v-col cols="1" class="text-right">  
            <v-btn @click="dialog=false" icon><v-icon>mdi-close</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card>
        <v-card-text>
          <v-data-table
            :items="procedimentos"
            :headers="headers"
          >
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template>   
<script>

import AppEtlService from '@/service/AppEtlService'
//import AppConfigService from '../../service/AppConfigService'

const api = new AppEtlService();
export default {
  name:"Detalhes",
  props:{
    item:Object
  },
  data:()=>({
    dialog:false,
    loading_procedimentos:false,
    procedimentos:[],
    headers:[
      { text: 'ATENDIMENTO', align: 'start', sortable: false, value: 'CD_ATENDIMENTO'},
      { text: 'CONVENIO', align: 'start', sortable: false, value: 'NM_CONVENIO'},
      { text: 'ORI_ATE', align: 'start', sortable: false, value: 'DS_ORI_ATE'},
      { text: 'ATENDIMENTO', align: 'start', sortable: false, value: 'DT_ATENDIMENTO'},
      { text: 'PRESTADOR', align: 'start', sortable: false, value: 'NM_PRESTADOR'},
      { text: 'PRO_INT', align: 'start', sortable: false, value: 'CD_PRO_INT'},
      { text: 'ATENDIMENTO', align: 'start', sortable: false, value: 'TP_ATENDIMENTO'},
      { text: 'DES_ATE', align: 'start', sortable: false, value: 'CD_DES_ATE'},
      { text: 'TIPO_INTERNACAO', align: 'start', sortable: false, value: 'CD_TIPO_INTERNACAO'},
      { text: 'RETORNO', align: 'start', sortable: false, value: 'SN_RETORNO'},
      { text: 'PRO_FAT', align: 'start', sortable: false, value: 'DS_PRO_FAT'},
    ],
  }),
  methods:{
    async get_procedimentos(){
      this.loading_procedimentos = true
      return await api
        .get_procedimentos(`pesquisa=${this.item.nr_cpf}`)
        .then( response => { this.procedimentos = response.data;})
        .catch( error => { console.log(error)})
        .finally( ()=>{ this.loading_procedimentos = false})
    }
  }
}
</script>