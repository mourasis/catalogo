<template>
  <div class="pa-2">
    <v-row dense>
      <v-col sm="12" md="12" dense>
        <!--  <div v-if="agenda_selecionada">{{agenda_selecionada.agenda}}</div> -->
        <!-- SELETOR DE MÉDICO PARA FILTRO DE AGENDAS -->
        <v-autocomplete outlined dense hide-details :loading="loading_medicos" :disabled="loading_agendamentos || loading_medicos"
          v-model="pesquisa_medico" 
          prepend-inner-icon="mdi-hospital-box"
          @change="limparVars()"
          placeholder="Selecione um(a) médico(a)" 
          label="Médico(a)"
          :items="medicos" 
          item-value="cd_prestador" 
          item-text="nm_prestador"
          :no-data-text="loading_medicos ? 'Carregando Médicos...':'Sem Médicos'" 
          no-results-text="Nenhum registro encontrado">

          <template v-slot:append-outer>
            <!-- BOTÃO PARA RECARREGAR MEDICOS, QUANDO NECESSÁRIO -->
            <v-btn small icon @click="getMedicos('')" title="Recarregar Médicos"><v-icon>mdi-refresh</v-icon></v-btn>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col sm="6" md="4" dense v-if="pesquisa_medico">
        <v-select prepend-inner-icon="mdi-calendar" 
          :disabled="loading_agendamentos" hide-details outlined dense label="Selecione o mês"
          v-model="pesquisa_mes"  :items="meses"  item-value="id"  item-text="mes">
        </v-select>
      </v-col>
      <v-col sm="6" md="4" dense v-if="pesquisa_medico">
        <v-btn elevation="0" :loading="loading_agendamentos || loading_medicos" color="primary" @click="carregarAgendasMes" style="margin-top:2px">
          <v-icon small>mdi-calendar-search</v-icon>
          Pesquisar
        </v-btn>
      </v-col>
      
    </v-row>
    <v-divider class="my-1"></v-divider>

    <v-card outlined>
      <v-card-title>
        Unidades e horários
        <v-spacer></v-spacer>
        
        <!-- RESUMO QUANTITATIVO DE AGENDAMENTOS DO MEDICO SELECIONADO -->
        <div v-if="agendamentos.length > 0" class="overline"> {{agendamentos.length}} agenda(s) </div>
      </v-card-title>
      <v-card-text>
        <v-row dense v-if="agenda_selecionada && agenda_selecionada.agenda">
          <v-col sm="6" md="4" dense v-if="pesquisa_medico">
            <v-autocomplete dense item-value="cd_tip_mar" item-text="ds_tip_mar"
            v-model="agenda_selecionada.agenda.cd_tip_mar"
              outlined
              :items="tiposmarcacao"
              label="Tipos de Marcação"
             
            ></v-autocomplete>
          </v-col>
          <v-col sm="6" md="4" dense v-if="pesquisa_medico">
            <v-autocomplete dense item-value="cd_convenio" item-text="nm_convenio"
              outlined
              v-model="agenda_selecionada.agenda.cd_convenio"
              :items="convenios"
              label="CONVÊNIO"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <!-- provisorio para acesso às props da agenda x paciente 
        <div v-if="agenda_selecionada && agenda_selecionada.agenda && agenda_selecionada.paciente">
          {{agenda_selecionada.paciente}}
          <br>  
          <br>  
          {{agenda_selecionada.agenda}} 
        </div>
        -->

        <!-- AGENDAMENTOS DO MÉDICO SELECIONADO -->
        <v-data-table
          
          :search="search_agenda"
          :loading="loading_agendamentos"
          loading-text="Carregando agendas..."
          :headers="dataTable_header" 
          :items="agendamentos" 
          item-key="cd_it_agenda_central" 
          locale="pt-BR" 
          no-data-text="Sem Agenda registrada" 
          no-results-text="Nenhum registro encontrado"
          >
        <template v-slot:[`item.cd_it_agenda_central`]="props">
          <span class="grey--text">{{props.item.cd_it_agenda_central}}</span>
        </template>
        <template v-slot:[`item.hr_agenda_formatada`]="props">
          {{props.item.hr_agenda_formatada}} ({{props.item.hr_agenda|weekDay}})
        </template>
        <template v-slot:[`item.opcoes`]="props">
          
          <v-col v-if="isReservationAgenda(props.item)">
            Reservado para: {{props.item.nm_paciente}}
            <v-btn small elevation="0" :loading="loading_agendamentos"
              @click="reservarPacienteAgenda(props.item,true)" outlined color="warning">cancelar</v-btn>
          </v-col>
          <v-col v-else>
            <v-btn small elevation="0" :loading="loading_agendamentos"
              @click="selecionarAgenda(props.item)" outlined color="grey">reservar</v-btn>
          </v-col>
          <v-col v-if="isSelectedAgenda(props.item)">
            <v-btn small elevation="0" :disabled="!selctTipMarcConvenio()" @click="agendarPaciente(props.item)" color="info" class="ml-1">
              <v-icon>mdi-calendar-check</v-icon>Agendar
            </v-btn>            
          </v-col>
          <v-col v-else>
            <v-btn small elevation="0" 
              @click="reservarPacienteAgenda(props.item)" outlined color="success">SELECIONAR</v-btn>
          </v-col>
        </template>
        <template v-slot:top>
          <v-text-field prepend-inner-icon="mdi-filter" v-if="agendamentos.length > 0" outlined dense 
              label="Pesquisar na agenda" v-model="search_agenda"></v-text-field>
        </template>

        </v-data-table>
      </v-card-text>
      <v-card-actions></v-card-actions>
    </v-card>
  </div>
        
</template>

<script>
import AppEtlService from '@/service/AppEtlService'
import AppConfigService from '../../service/AppConfigService'

const api = new AppEtlService();
export default {
    name: 'Agendar',
    props:{
        paciente:{
            required:true,
            type:Object
        }
    },
    data () {
      return {
        // pesquisa
        pesquisa_medico:null,
        pesquisa_mes: new Date().getMonth()+1,

        agendamentos:[],
        monitor_agendamentos:[],
        medicos:[],
        search_agenda:'',
        loading_agendamentos:false,
        loading_medicos:false,
        agenda_selecionada:null,

        convenios:[],
        tiposmarcacao:[],

        dataTable_header: [
          { text: 'Cód. AC', align: 'start', sortable: true, value: 'cd_it_agenda_central'},
          { text: 'Unidade', align: 'start', sortable: true, value: 'ds_unidade_atendimento'},
          { text: 'Horário', value: 'hr_agenda_formatada', sortable: false },
          { text: 'Opções',  align: 'end', value: 'opcoes' },
        ],
      }
    },
    methods:{
      
      limparVars(){
        this.agenda_selecionada = null;
        this.agendamentos = []
      },
      carregarAgendasMes(){
        this.getAgendaLivreMedico(this.pesquisa_medico,this.pesquisa_mes)
        this.monitorAgendamentos(this.pesquisa_medico,this.pesquisa_mes)
      },
      reservarPacienteAgenda(agenda,cancelar=false){
        console.log('funcao reserva')
        this.agenda_selecionada = null;
        this.loading_agendamentos = true
        const { cd_paciente, nm_paciente, dt_nascimento, tp_sexo, nr_ddd_celular, nr_celular } = this.paciente
        agenda = {...agenda, cd_paciente, nm_paciente, dt_nascimento, tp_sexo,  nr_ddd_celular, nr_celular, agendar:'reservar', cd_usuario:'AGEND.DEVINTERNO'}
        if(cancelar){
          agenda = {...agenda, cd_paciente, nm_paciente,dt_nascimento, tp_sexo,  nr_ddd_celular, nr_celular, agendar:'cancelar', cd_usuario:'AGEND.DEVINTERNO'}
        }
        //this.agenda_selecionada = {...{agenda}, ...{paciente:this.paciente}}
        this.agenda_selecionada = {...{agenda}}
        console.log('estou aqui',agenda)
        
        let tmp = this.agenda_selecionada.agenda
        api
        .create_agenda_paciente(tmp)
        .then(response=>{
          console.log('resevar => ',response.data)
        }).catch(error=>{
          console.log(error)
        }).finally(()=>{this.loading_agendamentos = false})
        
      },
      selctTipMarcConvenio(){
        return this.agenda_selecionada.agenda.cd_tip_mar && this.agenda_selecionada.agenda.cd_convenio
      },
      agendarPaciente(agenda){
        this.agenda_selecionada = null;
        const { cd_paciente, nm_paciente, dt_nascimento, tp_sexo, nr_ddd_celular, nr_celular } = this.paciente
        agenda = {...agenda, cd_paciente, nm_paciente, dt_nascimento, tp_sexo ,  nr_ddd_celular, nr_celular,agendar:'False', cd_usuario:'AGEND.DEVINTERNO'}
        this.agenda_selecionada = {...{agenda}}
        // Validar se existe agenda_selecionada
        if (this.validateSelectedAgenda){
          // confirmar via alerta com OK na página
          let confirmaAgendamento = confirm("Deseja confirmar este agendamento?")
          if ( confirmaAgendamento ){
            // TODO
            api.create_agenda_paciente(this.agenda_selecionada.agenda)
              .then(() =>{
                //console.log(response.data)
                let agenda = this.agenda_selecionada.agenda
                let ticket = `Nome Paciente: ${agenda.nm_paciente} \n`
                ticket += `Data: ${agenda.hr_agenda_formatada}\n`
                ticket += `Local: ${agenda.ds_unidade_atendimento}\n`
                ticket += `Médico: ${agenda.nm_prestador}\n`
                alert(ticket)
                // Em seguida recarregar agendamentos
                this.getAgendaLivreMedico(this.pesquisa_medico, this.pesquisa_mes)
                
              }).catch( error =>{
                console.error(error)
              })

          }
        }else{
          alert("Agenda do médico não foi vinculada ao paciente!!!")
        }
      },
      validateSelectedAgenda(){
        //return this.agenda_selecionada && this.agenda_selecionada.agenda && this.agenda_selecionada.paciente
        return this.agenda_selecionada && this.agenda_selecionada.agenda
      },
      isReservationAgenda(agenda){
        return agenda.nm_paciente!=null
      },
      isSelectedAgenda(agenda){
        return this.agenda_selecionada && 
          this.agenda_selecionada.agenda && 
          this.agenda_selecionada.agenda.cd_it_agenda_central == agenda.cd_it_agenda_central 
      },
      selecionarAgenda(agenda,reserva=false){
        
        this.agenda_selecionada = null;
        const { cd_paciente, nm_paciente, dt_nascimento, tp_sexo, nr_ddd_celular, nr_celular } = this.paciente
        agenda = {...agenda, cd_paciente, nm_paciente, dt_nascimento, tp_sexo ,  nr_ddd_celular, nr_celular, cd_usuario:'AGEND.DEVINTERNO'}
        //this.agenda_selecionada = {...{agenda}, ...{paciente:this.paciente}}
        this.agenda_selecionada = {...{agenda}}
        if(reserva){
          //this.reservarPacienteAgenda(agenda)
        }

      },
      monitorAgendamentos(medico,mes){
        setInterval(()=>{
          return api
            .get_agendamentos_livres_by_id_prestador(medico,mes)
            .then( response => { 
              this.monitor_agendamentos = response.data; console.log('oi')
              for(let i=0;i<this.monitor_agendamentos.length;i++){
                if(this.monitor_agendamentos[i].nm_paciente){
                  let a = this.agendamentos.find(e=>
                    e.cd_it_agenda_central==this.monitor_agendamentos[i].cd_it_agenda_central
                  )           
                  this.agendamentos[this.agendamentos.indexOf(a)].nm_paciente = response.data[i].nm_paciente       
                  //console.log(this.agendamentos.indexOf(a),response.data[i].nm_paciente)
                }else{
                  this.agendamentos[i].nm_paciente = null
                }
              }
            })
            .catch( error => { console.log(error.response)})
        },5000)
      },
      async getAgendaLivreMedico (medico, mes,monitor=false){
        if(!medico || !mes){
          alert('Médico e/ou mês não informado!')
          return
        }
        this.limparVars()
        if(monitor){
          this.loading_agendamentos = true
        }
        return await api
          .get_agendamentos_livres_by_id_prestador(medico,mes)
          .then( response => { this.agendamentos = response.data; })
          .catch( error => { console.log(error.response)})
          .finally( ()=>{ this.loading_agendamentos = false})
      },
      async getMedicos(pesquisa){
          this.limparVars()
          this.loading_medicos = true
          return await api
          .get_medicos(pesquisa)
          .then( response => { this.medicos = response.data;})
          .catch( error => { console.log(error)})
          .finally( ()=>{ this.loading_medicos = false})
      },
      async getConvenios(obj) {
        this.loading = true
        return await api.get_convenios(obj)
          .then( response => {
            //console.log('convenios',response)
            this.convenios = response.data
          }).catch( error => {
            console.log(error.response)
          }).finally( ()=> {
            this.loading = false
          })
      },
      async getTiposMarcacao() {
        this.loading = true
        return await api.get_tiposmarcacao()
          .then( response => {
            //console.log('Tipos marcacao',response)
            this.tiposmarcacao = response.data
          }).catch( error => {
            console.log(error.response)
          }).finally( ()=> {
            this.loading = false
          })
      },
    },
    computed:{
      meses(){
        return AppConfigService.meses()
      },
      computedIsSelectedAgenda(){
        if (this.agenda_selecionada && this.agenda_selecionada.agenda &&  this.agenda_selecionada.agenda.cd_it_agenda_central){
          return this.agenda_selecionada.agenda.cd_it_agenda_central
        }else{
          return 0
        }
      }
    },
    mounted(){
      this.getMedicos('')
      this.getConvenios('')
      this.getTiposMarcacao()
    },
    /*
    watch:{
     
     agenda_selecionada: {
        handler(value){
          console.log('watch agenda selecionada', value)
        }, deep:true
      }, 
      agendamentos:{
        handler(value){
          for(let i=0;i<value.length;i++){
            console.log(value[i].nm_paciente)
          }
        },deep:true
      }
    }
    */
  }
</script>