import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes:[
    { 
      path:'/', 
      component: () => import('./pages/views/Fila'), 
      name:"fila" ,
      meta:{
        title:"HRO | Fila",
      }
    },
    { path:'*', redirect: '/' },
  ]
});

router.beforeEach((to, from, next) => {
  
  document.title = to.meta.title
  if (to.meta.requirestAuth){
    var usertoken = localStorage.getItem('tokenAccess')
    /*var usu = JSON.parse(localStorage.getItem('cfgu'))||{usuario:{data:{trocar_senha:''}}}
    console.log(usu.usuario.data.trocar_senha)*/
    if(usertoken){
      document.title = to.meta.title
      next()
    }else{
      document.title = to.meta.title
      next({name:'fila'})
    }
  }

  next();
});

export { router };