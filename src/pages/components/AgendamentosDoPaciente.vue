<template>
  <div>
    <!-- FILTROS DE PESQUISA -->
    <v-row dense class="pa-1">
      <v-col sm="3" cols="12" dense>
        <v-menu v-model="datepicker_datainicio_dialog"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y max-width="290px" min-width="auto">

          <template v-slot:activator="{ on }">
            <v-text-field outlined dense hide-details
              v-model="datainicio"
              label="Data início"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker locale="pt-br" v-model="date_start_field" no-title @input="datepicker_datainicio_dialog = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col sm="3" cols="12" dense>
        <v-menu v-model="datepicker_datafim_dialog"
          :close-on-content-click="false" 
          transition="scale-transition"
          offset-y max-width="290px" min-width="auto">
        
          <template v-slot:activator="{ on }">
            <v-text-field outlined dense
              v-model="datafim" hide-details
              label="Data fim"
              readonly
              prepend-inner-icon="mdi-calendar"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker locale="pt-br" v-model="date_end_field" no-title @input="datepicker_datafim_dialog = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col sm="3" cols="12" dense>
          <v-btn :loading="loading" elevation="1" color="primary" @click="getAgendamentosPaciente">
            <v-icon small>mdi-table-search</v-icon>
            Pesquisar
          </v-btn>
      </v-col>
    </v-row>
    <v-divider class="my-1 mx-1"></v-divider>
    <!-- LISTA DE AGENDAMENTOS -->
    <v-card outlined flat v-for="agenda,index in agendamentos" :key="index" class="pa-2 ma-1">
      <v-row dense>
        <v-col sm="6" cols="12" dense>
          <b>Unidade: </b> <div class="pl-2">{{agenda.ds_unidade_atendimento}} em {{agenda.hr_agenda|formatData}}</div>
        </v-col>
        <v-col sm="6" cols="12" dense>
        </v-col>
        <v-col sm="6" cols="12" dense>
          <b>Médico: </b> <div class="pl-2">{{agenda.nm_prestador}}</div>
        </v-col>
        <v-col sm="6" cols="12" dense>
          <b>Tipo Agenda: </b> <div class="pl-2">{{agenda.tipo_agenda}}</div>
        </v-col>
      </v-row>
    </v-card>
    
  </div>
        
</template>

<script>
import AppEtlService from '@/service/AppEtlService'
const api = new AppEtlService();
var d = new Date();
d.setDate(d.getDate()-30)
export default {
    name: 'AgendamentosDoPaciente',
    props:{
        paciente:{
            required:true,
            type:Object
        }
    },
    data () {
      return {
        datainicio:d.toLocaleDateString(),
        datafim:new Date().toLocaleDateString(),
        agendamentos:[],
        loading:false,

        date_end_field: null,
        date_start_field: null,
        datepicker_datainicio_dialog:false,
        datepicker_datafim_dialog:false
      }
    },
    methods:{
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      dataFormatada(){
        let data = new Date();
        let dia = data.getDate() < 10 ? `0${data.getDate()}` : data.getDate()
        let mes = data.getMonth() < 10 ? `0${data.getMonth()}` : data.getMonth()
        let ano = data.getFullYear()
        return {dia, mes, ano}
      },
      async getAgendamentosPaciente(){
        if(!this.datainicio || !this.datafim){
          let data = this.dataFormatada()
          if(!this.datainicio){ this.datainicio = `${data.dia}/${data.mes}/${data.ano-1}` }
          if(!this.datafim){ this.datafim = `${data.dia}/${data.mes}/${data.ano}` }
          //alert('Data início e Data fim são obrigatórios')
          //return false
        } 
        this.loading = true
        return await api
          .get_agenda_central_by_id_paciente(this.paciente.cd_paciente, this.datainicio, this.datafim)
          .then( response => { this.agendamentos = response.data;
           //console.log(response.data) 
          })
          .catch( error => { console.log(error)})
          .finally( ()=>{ this.loading = false})
      }
    },
    mounted(){
      //this.getAgendamentosPaciente()
    },
    watch: {
      date_start_field (val) {
        this.datainicio = this.formatDate(val)
      },
      date_end_field (val) {
        this.datafim = this.formatDate(val)
      },
    },
  }
</script>