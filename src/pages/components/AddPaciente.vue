<template>
    <div class="text-center">
        <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
                <v-btn small elevation="0" color="success" dark v-bind="attrs" v-on="on">
                    <v-icon small>mdi-account-plus</v-icon> 
                    Cadastrar 
                </v-btn>
            </template>

            <v-card>
                <v-card-title class="text-h5"> Novo Paciente </v-card-title>

                <v-card-text> 
                    <v-divider></v-divider>
                    {{paciente}}
                    <br>
                    <v-form ref="form" v-model="valid" >
                        <div v-if="loading_paciente">
                            <v-progress-circular indeterminate size="50" color="success"></v-progress-circular>
                        </div>
                        <div v-else>
                            <v-text-field dense outlined v-model="paciente.nm_paciente" 
                                :rules="[v => !!v || 'Campo obrigatório']" 
                                label="Nome completo" required></v-text-field>
                            
                            <v-radio-group row v-model="paciente.tp_sexo">
                              <v-radio
                                v-for="n in 2"
                                :key="n"
                                :label="tp_sexo(n)"
                                :value="tp_sexo(n)"
                              ></v-radio>
                            </v-radio-group>

                            <v-text-field dense :rules="[v => !!v || 'Campo obrigatório']" outlined v-mask="'###.###.###-##'" v-model="paciente.nr_cpf" 
                                label="CPF" required></v-text-field>

                            <v-text-field dense outlined v-model="paciente.email" 
                                label="E-mail"></v-text-field>

                            <v-text-field dense outlined v-mask="'#####-####'" v-model="paciente.nr_celular" 
                                label="Celular" required></v-text-field>
                            
                            <div>
                                <v-menu v-model="datepicker_dt_nascimento_dialog"
                                    :close-on-content-click="false" 
                                    transition="scale-transition"
                                    offset-y max-width="290px" min-width="auto">
                                    
                                    <template v-slot:activator="{ on }">
                                        <v-text-field outlined dense readonly
                                            v-model="computedDataNascimento"
                                            :rules="[v => !!v || 'Campo obrigatório']" 
                                            label="Nascimento"
                                            prepend-inner-icon="mdi-calendar"
                                            v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker locale="pt-br" v-model="born_date" no-title @input="datepicker_dt_nascimento_dialog = false"></v-date-picker>
                                </v-menu>
                            </div>
                            <v-select dense outlined v-model="paciente.cd_multi_empresa" 
                                :items="empresas" :rules="[v => !!v || 'Campo obrigatório']" 
                                item-value="cd_multi_empresa" item-text="ds_multi_empresa" label="Unidade" required></v-select>

                            <v-divider class="my-4"></v-divider>

                            <v-row dense>
                                <v-btn color="error" outlined @click="fecharDialog"> Fechar </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="warning" class="mr-2" outlined @click="limparForm" > Limpar </v-btn>
                                <confirm-dialog v-if="valid" openBtnTextDialog="Salvar" @confirmation="confirmationDialog" />
                            </v-row>

                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import AppEtlService from '../../service/AppEtlService'
import ConfirmDialog from '@/components/confirmDialog'
const api = new AppEtlService()
export default {
    name: 'AddPaciente',
    components:{
        ConfirmDialog
    },
    data(){
        return{
            empresas: [],
            loading_empresas:false,
            loading_paciente:false,
            dialog : false,
            paciente:{
                nm_paciente:'Augustus',
                dt_nascimento:'2020-01-01',
                nr_celular:'98989898',
                email:'email@hro.med.br',
                cd_multi_empresa:1,
                nr_cpf:'01998812312',
                tp_sexo:'M'
            },
            valid: true,
            // datepicker dt_nascimento
            born_date:'2020-01-01',
            datepicker_dt_nascimento_dialog:false
            
        }
    },
    methods:{
        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        confirmationDialog(event){
            if(event){
              let cpf = this.paciente.nr_cpf.replace('.','')
              cpf = cpf.replace('-','')
              this.existePacienteByCPF(cpf)
            }
        },
        fecharDialog(){
            this.dialog = false
        },
          /*
        salvar_paciente(){
            this.createPaciente()
            return
            if(this.$refs.form.validate()){
                alert('Salvar Paciente')
                this.limparForm()
                this.fecharDialog()
            }else{
                alert('formulário incompleto')
            }
        },
            */

        async existePacienteByCPF(cpf){
            return await api.get_pacientes(cpf)
                .then( response => {  
                  //console.log(response)
                    if(response.data.length > 0){
                      alert('Já existe um paciente com o CPF informado')
                    }else{
                      this.createPaciente()
                    }

                })
                .catch( error => {
                    console.error(error.response)
                })
                .finally( () => {

                })
        },
        
        async createPaciente(){
            return await api.create_paciente(this.paciente)
                .then( response => {
                    //console.log('paciente criado:',response.data.paciente)
                    this.fecharDialog()
                    this.$emit('onCreatedPaciente',response.data.paciente)
                })
                .catch( error => {
                    console.error(error.response)
                })
                .finally( () => {

                })
        },
        limparForm () {
            //this.$refs.form.reset()
            this.paciente.nm_paciente = null
            this.paciente.dt_nascimento = null
            this.paciente.nr_celular = null
            this.paciente.email = null
            this.paciente.cd_multi_empresa = null
            this.paciente.nr_cpf = null
            this.born_date = null
        },
        
        async get_empresas(){
            this.loading_empresas = true
            return await api.get_empresas('')
                .then( response => {
                    this.empresas = response.data
                    //console.log(this.empresas)
                }).catch( error => {
                    console.error(error.response)
                }).finally(()=>{
                    this.loading_empresas = false
                })
        },
        tp_sexo(n){
          //console.log(n)
          return n%2==0?'F':'M'
        }
    },
    mounted(){
        this.get_empresas()
    },
    computed:{
        computedDataNascimento(){
            return this.formatDate(this.born_date)
        },

    },
    watch:{
        born_date(val) {
            this.paciente.dt_nascimento = val
        },
    }
}
</script>