import { resolve } from 'q'
import Vue from 'vue'
import Vuex from 'vuex'
import api from './http'
import { USUARIO_LOGADO } from './service/AuthService'
import BrowserStorageService from './service/BrowserStorageService'

//import { router } from './routes'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // auth
    tokenAccess:null,
    refreshToken:null,
    auth:false,
    usuarios:[],
    usuario:{},
    avatar:'',

    //tables
    loading:false,
    headers:[],
    search:'',

    //sugestoes 25f5dc86d92c392c15ef10e68a1ea7b651f60264
    resposta_sugestao:false,
    lista_status_analise: [],
    lista_1_array: [],
    lista_2: [],
    lista_3_array: [],
    lista_3: {},
    lista_4: [],
    lista_5: [],
    lista_6: [],
    e1:1,
    avanca:true,
    mensagem:'',
    cor:'',
    current_iten:{},
    analise_sugestoes:[],
    data_analises_sugestoes:{},
    count_grupos_sugestao:{},
    movimentos:[],
    resultados:[],

    //configuracoes
    configuracoes:{},
    perm:'',
    ouvidoria:false,
    permt:'',

    //home
    banners:[],

    // lista genericamente o item de acordo com o componente
    listaAdd:[],
    adm:false,
    ava:false,

    //ouvidoria
    campos:[],

    // chat
    chat:[],
    conversa:[],

    // painel de senhas
    locais:[],
  },
  mutations: {
    increment(state){
        state.e1++
        state.avanca = true
    },
    decrement(state){
        state.e1--
    },
    increment_local(state,val){
        state.locais.push({val})
    },
    decrement_local(state,val){
      state.locais = state.locais.splice(val,1)
    },
    locais(state,val){
      state.locais = val
    },
    avanca(state, val){state.avanca = val},
    avatar(state, val){state.avatar = val},
    ouvidoria(state,val){
        state.ouvidoria = val.usuario.data.id==val.conf.usus_pode_ler_todo_ouvidoria.filter(i=>{return i==val.usuario.data.id})
    },
    reset(state){
        state.e1 = 1
    },
    adm(state,val){state.adm = val.conf.papel_full==val.usuario.data.papel.id},
    ava(state,val){state.ava = val.conf.papel_parcial==val.usuario.data.papel.id},
    /** Table*/
    btn_loading(state,val){
        state.loading = val
    },
    search(state, val){state.search = val},
    headers(state, val){state.headers = val},

    /** usuarios */        
    updateStorage(state,val){
        state.tokenAccess = val.access
        state.refreshToken = val.refresh
    },
    usuLogout(state){
        state.tokenAccess = ''
        state.refreshToken = ''
        localStorage.removeItem('tokenAccess')
        localStorage.removeItem('tokenRefresh')
        localStorage.removeItem('cfgu')
        window.location=process.env.NODE_ENV === 'production'? 'http://intra.hro.med.br/':'http://localhost:8080/'
    },
    usuarios(state,val){
        state.usuarios = val
    },
    usuario(state,val){
      console.log(val)
      state.usuario = val
    },

    updateErro(state,erro){
        state.cor ='red ligthen-2'
        state.mensagem = erro.message
        setTimeout(function(){
            state.loading = false
        },5000)
    },
    /*configs*/
    updateConfig(state,config){
        state.configuracoes = config    
    },
    perm(state){
        let val = JSON.parse(localStorage.getItem('cfgu'))
        state.perm = val.usuario.data.papel.id == val.conf.papel_full || val.usuario.data.papel.id == val.conf.papel_parcial
    },
    updateSugestao(state){
        state.resposta_sugestao = true
        state.e1 = 1
        state.cor ='green ligthen-2'
        state.mensagem = 'Sua resposta foi enviada com sucesso! o prazo da resposta é de até dez dias úteis.'
    },
    lista_1_array(state,lista){ // Sugestoes.vue
        if (Array.isArray(lista)){
            state.lista_1_array = lista    
        }else{
            setInterval(()=>{
                state.loading = false
            },3000)
            state.mensagem = 'Gravado com sucesso.'   
        }
    },
    lista_2(state,val){state.lista_2 = val},
    lista_3(state,val){state.lista_3 = val},
    lista_3_array(state,val){state.lista_3_array = val},
    lista_4(state,val){state.lista_4 = val},
    lista_5(state,val){state.lista_5 = val},
    lista_6(state,val){state.lista_6 = val},
    statusAnalise(state,config){ // Sugestao.vue
        state.lista_status_analise = config    
    },
    movimentos(state,val){
        state.movimentos = val
        setInterval(()=>{
            state.loading = false
        },3000)
    },
    mensagem(state,val){state.mensagem = val},
    cor(state,val){state.cor = val},
    resultados(state,val){state.resultados = val},
    analise_sugestoes(state,lista){
        state.analise_sugestoes = lista
        state.data_analises_sugestoes.text = ''
    },
    data_analises_sugestoes(state){
        state.data_analises_sugestoes
    },
    count_grupos_sugestao(state,val){
        state.count_grupos_sugestao = val
    },
    updateBanner(state,banner){ //Banner.vue
        state.banners = banner
    },
    // Lista genericamente de acordo com o componente chamado
    updateListaAdd(state,config){
        state.listaAdd = config
    },
    updateCurrentIten(state,value){
        state.current_iten = value
    },
    campos(state, val){
        state.campos = val
    },
    chat(state,val){
        if(val.params.method=='post'){
            state.chat = val
        }
        if(val.params.method=='get'){
            state.conversa = val
        }
    }
  },
  actions:{
    userLogin(context, usercredentials){
      new Promise(()=>{
        api(usercredentials).then(response=>{
          context.commit('updateStorage',response.data)
          localStorage.setItem('tokenAccess',response.data.access)
          localStorage.setItem('tokenRefresh',response.data.refresh)
          localStorage.setItem('token_usuario',JSON.stringify(response.data))
          localStorage.setItem('cfgu',JSON.stringify(response.data))
          
          //basic to consume from api's
          const authorization = Buffer.from(`${usercredentials.data.username}:${usercredentials.data.password}`).toString('base64')
          BrowserStorageService.adicionarItem(USUARIO_LOGADO, authorization)
          
          //if(localStorage.getItem('tokenAccess')) router.push({name:'informe'})
          window.location=process.env.NODE_ENV === 'production'? 'http://intra.hro.med.br/':'http://localhost:8080/'
          // poto
          resolve()
        }).catch(err=>{
          localStorage.removeItem('tokenAccess')
          
          context.commit('btn_loading',true)
          context.commit('cor','red')
          //context.commit('mensagem',err.response.data.detail )
          console.log(err)
          setTimeout(()=>{
            context.commit('btn_loading',false)
          },3000)
            
        })
      })

    }, // o parametro val recebe tambem um objeto que passa o valor false para a variavel loading
    adm(context,val){
        context.commit('adm',val)
    },
    ava(context,val){
        context.commit('ava',val)
    },
    usuarios(context,config){
        return new Promise(()=>{
          let msg = ''  
          api(config).then(response=>{
              if(config.instancia=='change_password'){
                console.log('JSON.parse(JSON.stringify(erro.response.data))')
                context.commit('btn_loading',true)
                context.commit('cor','green')
                context.commit('mensagem','Senha alterada com sucesso :)')
              }
              context.commit('usuarios',response.data)
            }).catch(erro=>{
              msg = erro.response.data.old_password!=undefined?erro.response.data.old_password.old_password:' '
              msg += erro.response.data.password!=undefined?erro.response.data.password[0]:''
              context.commit('btn_loading',true)
              context.commit('cor','red')
              context.commit('mensagem',msg)
              
            })
        })
    },
    lista_1_array(context,v){context.commit('lista_1_array',v)},
    lista(context,value){
      return new Promise(()=>{
        api(value).then(response=>{
          if(value.instancia == 'analise-sugestoes'){
            if (value.method=='post'){
              context.commit('btn_loading',true)
              context.commit('cor','green lighten-2')
            }
            context.commit('analise_sugestoes',response.data)
          }else if(value.instancia=='campos'){
            context.commit('campos',response.data)
          }else if(value.instancia=='chat'){
            console.log(['val',value])
            response.data.params = value
            context.commit('chat',response.data)
          }else if(value.instancia=='ouvidoria'){
            if(value.method=='get'){
              context.commit('updateListaSugestoes',response.data)
            }else{
              context.commit('btn_loading',true)
              context.commit('cor','green lighten-2')
              context.commit('mensagem', 'Gravado com sucesso :)')     
              context.commit('updateListaSugestoes',response.data)
            }
            //
          }else if(value.instancia=='lista_1_array'){
            if (value.method=='get'){
              context.commit('lista_1_array', response.data)
              context.commit('btn_loading', false)
            }else{
              context.commit('lista_3',response.data)
              context.commit('btn_loading',true)
              context.commit('cor','green lighten-2')
              context.commit('mensagem', 'Gravado com sucesso :)') 
              setTimeout(()=>{
                context.commit('btn_loading',false)    
              },3000)
            }
                                      
          }else if(value.instancia=='lista_2'){
            if (value.method=='get'){
              context.commit('lista_2', response.data)

            }else{
              context.commit('btn_loading',true)
              context.commit('cor','green lighten-2')
              context.commit('mensagem', 'Gravado com sucesso :)') 
              setTimeout(()=>{
                context.commit('btn_loading',false)    
              },3000)
            }
                                  
          }
          else if(value.instancia=='lista_3_array'){
            if (value.method=='get'){
              context.commit('lista_3_array', response.data)
            }else{
              context.commit('btn_loading',true)
              context.commit('cor','green lighten-2')
              context.commit('mensagem', 'Gravado com sucesso :)') 
              setTimeout(()=>{
                context.commit('btn_loading',false)    
              },3000)
            }                      
          }
          else if(value.instancia=='lista_4'){
            if (value.method=='get'){
              context.commit('lista_4', response.data)
            }else{
              context.commit('btn_loading',true)
              context.commit('cor','green lighten-2')
              context.commit('mensagem', 'Gravado com sucesso :)') 
              setTimeout(()=>{
                context.commit('btn_loading',false)    
              },3000)
            }    
          }                  
          else if(value.instancia=='lista_5'){
            if (value.method=='get'){
              context.commit('lista_5', response.data)
            }else{
              context.commit('btn_loading',true)
              context.commit('cor','green lighten-2')
              context.commit('mensagem', 'Gravado com sucesso :)') 
              setTimeout(()=>{
                context.commit('btn_loading',false)    
              },3000)
            }                  
              
          }
          else if(value.instancia=='lista_6'){
            if (value.method=='get'){
              context.commit('lista_6', response.data)
            }else{
              context.commit('btn_loading',true)
              context.commit('cor','green lighten-2')
              context.commit('mensagem', 'Gravado com sucesso :)') 
              setTimeout(()=>{
                context.commit('btn_loading',false)    
              },3000)
            }                  
          }else if(value.instancia=='resultados'){
            console.log(response.data)
            context.commit('resultados', response.data)
          }
            // resolve()
        }) .catch(err=>{
          if(JSON.parse(JSON.stringify(err)).message==='Request failed with status code 401'){
            localStorage.removeItem('tokenAccess')
          }
          context.commit('btn_loading',true)
          //console.log('aqui erro',JSON.parse(JSON.stringify(err))) 
          context.commit('updateErro',JSON.parse(JSON.stringify(err)))
          
        })
      })
    },
    sugestoesListaStatus(context, config){
        return new Promise(()=>{
            api(config).then(response=>{
                context.commit('statusAnalise', response.data)
                return response.data
                //resolve()
            }) .catch(err=>{
                console.log(err)
            })
        })
    },
    count_grupos_sugestao(context, config){
        return new Promise(()=>{
            api(config).then(response=>{
                context.commit('count_grupos_sugestao',response.data)
                resolve()
            })
        })
    },
    /**desabilitar em breve*/
    enviarSugestao(context,config){
        return new Promise(()=>{
            api(config).then(()=>{
                context.commit('updateSugestao')
            }).catch(err=>{
                console.log(err['request'].response)
                context.commit('updateErro',JSON.parse(err['request'].response))
            })
        })
    },
    movimentos(context,config){
        return new Promise(()=>{
            api(config).then(response=>{
                context.commit('mensagem','Gravado com sucesso!')
                context.commit('cor','green')
                context.commit('movimentos',response.data)
                setTimeout(()=>{
                    context.commit('btn_loading',true)
                },3000)
            }).catch(function(err){
                context.commit('cor','red')
                context.commit('updateErro',JSON.parse(err['request'].response))
            })
        })
    },
    resultados(context,config){
        return new Promise(()=>{
            api(config).then(response=>{
                context.commit('resultados',response.data)
            }).catch(err=>{
                console.log(JSON.parse(err['request'].response))
                context.commit('updateErro',JSON.parse(err['request'].response))
            })
        })
    },
    configPage(context, config){
      
        return new Promise(()=>{
            api(config).then(response=>{
                localStorage.setItem('cfg',JSON.stringify(response.data[0]))
                context.commit('updateConfig',response.data[0])    
            })
        })
    },
    listaStatusAnalise(context, config){
      return new Promise(()=>{
        api(config).then(response=>{
          context.commit('statusAnalise', response.data)
          resolve()
        }) .catch(err=>{
          console.log(err)
        })
      })
    },
    listaBanner(context, config){
      return new Promise(()=>{
        api(config).then(response=>{
          context.commit('updateBanner',response.data)
          resolve()
        })
      })
    },      
    listaItensAdd(context, config){
      return new Promise(()=>{
        api(config).then(response=>{
          context.commit('updateListaAdd',response.data)
          resolve()
        })
      })
    },    
    listaAnaliseSugestoes(context, config){
      return new Promise(()=>{
        api(config).then(response=>{
          context.commit('analise_sugestoes',response.data)
          resolve()
        })
      })
    },
    increment: ({ commit }) => commit('increment'),
    decrement: ({ commit }) => commit('decrement'),
    increment_local(context,value ){context.commit('increment_local',value)},
    decrement_local(context,value){ context.commit('decrement_local',value)},
    locais(context,value){context.commit('locais',value)},
    reset: ({ commit }) => commit('reset'),
    usuLogout:({commit})=>commit('usuLogout'),
    btnLoading(context,value){context.commit('btn_loading',value)},
    headers(context,value){context.commit('headers',value)},
    search(context,value){context.commit('search',value)},
    
    cor(context,value){context.commit('cor',value)},
    currentIten(context,config){context.commit('updateCurrentIten',config)},
    perm(context){context.commit('perm')},
    ouvidoria(context,value){context.commit('ouvidoria',value)},
    avatar(context,value){context.commit('avatar',value)},
    mensagem(context,value){context.commit('mensagem',value)},
    avanca(context,value){context.commit('avanca',value)},
  },
  getters: {
    usuarios: state => {
      return state.usuarios
    },
    adm: state => {
      return state.adm
    },
    ava: state => {
      return state.ava
    },
    configs: state => {
      return state.configuracoes
    },
    loading: state => {
      return state.loading
    },
    headers: state => {
      return state.headers
    },
    search: state => {
      return state.search
    },
    cor: state => {
      return state.cor
    },
    mensagem: state => {
      return state.mensagem
    },
    moeda: state => {
      return state.moeda
    },
    analise_sugestoes: state => {
      return state.analise_sugestoes
    },
    lista_1_array: state => {
      return state.lista_1_array
    },
    lista_2: state => {
      return state.lista_2
    },
    lista_3: state => {
      return state.lista_3
    },
    lista_3_array: state => {
      return state.lista_3_array
    },
    lista_4: state => {
      return state.lista_4
    },
    lista_5: state => {
      return state.lista_5
    },
    lista_6: state => {
      return state.lista_6
    },
    data_analises_sugestoes: state => {
      return state.data_analises_sugestoes
    },
    perm: state => {
      return state.perm
    },
    ouvidoria: state => {
      return state.ouvidoria
    },
    movimentos: state => {
      return state.movimentos
    },
    resultados: state => {
      return state.resultados
    },
    campos: state => {
      return state.campos
    },
    chat: state => {
      return state.chat
    },
    conversa: state => {
      return state.conversa
    },
    avatar: state => {
      return state.avatar
    },
    usuario: state => {
      return state.usuario
    },
    avanca: state => {
      return state.avanca
    },
    locais: state => {
      return state.locais
    }
  }
})
export default store;