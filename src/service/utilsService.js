
export default class UtilsService {

    static formatData(val){
        return new Date(val).toLocaleString()
    }

    static protectCPF(val){
        var c = val.split('');
        var protect = c.map((char,i)=>{
          // marcarar apenas indices maior que a 4ª pos e menor que a 11ª pos, a partir de um CPF Formatado com o filtro Vue formatCPF
          return (i > 3 && i < 11) ? '*' : char;
        })
        return protect.join('');
    }

    static formatCPF(val){
        if (val){
            var formattedCPF = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            return formattedCPF;
        }
        return ''
    }

    static getWeekDay(val){
        return new Date(val).toLocaleDateString('pt-br',{weekday:'long'})
    }
}