import BrowserStorageService from './BrowserStorageService'

export const USUARIO_LOGADO = '_usuario_logado'
export default class AuthService {

    static isUsuarioAutenticado(){
        const usuario = BrowserStorageService.obterItem(USUARIO_LOGADO)
        return usuario && usuario.username
    }

    static removerUsuarioAutenticado(){
        BrowserStorageService.removerItem(USUARIO_LOGADO)
    }

    static logar(usuario){
        BrowserStorageService.adicionarItem(USUARIO_LOGADO,usuario)
    }

    static obterUsuarioAutenticado(){
        return BrowserStorageService.obterItem(USUARIO_LOGADO)
    }
}