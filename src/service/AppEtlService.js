import ApiService from './ApiService'
import AuthService from './AuthService'

class AppEtlService extends ApiService{

    constructor(){
        const basic_auth = AuthService.obterUsuarioAutenticado()
        let headers = {}
        if (basic_auth){
            headers = {'Authorization': `Basic ${basic_auth}`, 'Content-type':'application/json', 'Accept':'application/json'}
        }
        super('/', headers)
    }

    get_pacientes(pesquisa){
        return this.get(`/pacientes?pesquisa=${pesquisa}`)
    }

    get_query(query,params){
        return this.get(`etl/query/?query=${query}&params=${JSON.stringify(params)}`)
    }

    create_agenda_paciente(obj){
      return this.put('/atendimentos/', obj)
    }

    create_paciente(obj){
        return this.post(`/pacientes/`, obj)
    }

    update_paciente(obj){
        return this.put(`/pacientes/`, obj)
    }
    
    get_agendamentos_livres_by_id_prestador(id_medico,mes){
        return this.get(`/agendacentral/livres/id_prestador?pesquisa=${id_medico}&mes=${mes}`)
    }
    
    get_medicos(pesquisa){
        return this.get(`/medicos?pesquisa=${pesquisa}`)
    }

    get_empresas(pesquisa){
        return this.get(`/empresas?pesquisa=${pesquisa}`)
    }

    get_convenios(pesquisa){
        return this.get(`/convenios?pesquisa=${pesquisa}`)
    }

    get_setores(pesquisa){
        return this.get(`/setores?pesquisa=${pesquisa}`)
    }

    get_agenda_central_by_id_paciente(pesquisa, datainicio, datafim){
        return this.get(`/agendacentral/id_paciente?pesquisa=${pesquisa}&datainicio=${datainicio}&datafim=${datafim}`)
    }

    get_agenda_central_by_id_prestador(pesquisa){
        return this.get(`/agendacentral/id_prestador?pesquisa=${pesquisa}`)
    }

    get_unidades(pesquisa){
        return this.get(`/unidades?pesquisa=${pesquisa}`)
    }
 
    get_tiposmarcacao(){
      return this.get(`/tiposmarcacao/`)
  }
    
    

}

export default AppEtlService