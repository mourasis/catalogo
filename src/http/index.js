import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'? "http://api.hro.int/":"http://api.hro.int",
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem('tokenAccess'),
    
  }
})
/*
async function refreshToken(error) {
  return new Promise((resolve, reject) => {
    try {
      const refresh_token = localStorage.getItem("tokenRefresh");
      
      const config = {
        url: 'api/token/refresh/',
        method:'post',
        data: {refresh:refresh_token}
      }
      
      api(config)
        .then(async (res) => {
          localStorage.setItem("tokenAccess", res.data.access);
          localStorage.setItem("tokenRefresh", res.data.refresh);
          // Fazer algo caso seja feito o refresh token
          return resolve(res);
        })
        .catch((err) => {
          // Fazer algo caso não seja feito o refresh token
          return reject(err);
        });
    } catch (err) {
      return reject(error);
    }
  });
}
*/
api.interceptors.response.use((response)=>{
  return response;
}),
function(error){
  if (error.response.status === 401) {
    localStorage.removeItem('tokenAccess')
    return error
  }
}
  /*
  
define('DB_USER', 'vmaism87_hro');
define('DB_PASSWORD', 'Padrao@2020@#$');

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    //const access_token = localStorage.getItem("tokenAccess");
    const refresh_token = localStorage.getItem('tokenRefresh')
   
    if(refresh_token=='undefined'){
      window.location="http://localhost:8080/login"
    }
    console.log(error)
    return error
  
    if (error.response.status === 401 || access_token!='undefined') {
      
      console.log(localStorage.getItem('tokenRefresh')=='undefined')
      try{
        const res = await api({
          url: 'api/token/refresh/',
          method:'post',
          data: {refresh:localStorage.getItem('tokenRefresh')} 
        })
        localStorage.setItem('tokenAccess',res.data.access)
        localStorage.setItem('tokenRefresh',res.data.refresh)
        //console.log('header',error.response)
        error.response.config.headers['Authorization'] = 'Bearer ' + res.data.token;
        //console.log(res)
        
      }catch(erro){
        console.log(erro)
        localStorage.removeItem('tokenAccess')
        
      }
      
      /*.then(response => {
        localStorage.setItem('tokenAccess',response.data.access)
        localStorage.setItem('tokenRefresh',response.data.refresh)
        error.response.config.headers['Authorization'] = 'Bearer ' + response.data.token;
        return false
      }).catch(() => {
        localStorage.removeItem('tokenAccess')
        this.router.push('/login');
        return false
      })
    }
  }
);*/
export default api;