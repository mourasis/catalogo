class AppConfigService{

    static menus(){
        return [
            {
                name: 'Conta',
                icon:'mdi-account',
                to:'contas'
            },
            {
                name: 'Informe & Transforme',
                icon:'mdi-view-dashboard',
                to:'informe',
                children: [
                    {
                        name: 'Ouvidoria',
                        icon: 'mdi-archivelock',
                        to:'ouvidoria'
                    },
                    {
                        name: 'Sugestão',
                        icon: 'mdi-archive',
                        to:'sugestoes'
                    },
                ],
            },
            {
                name: 'Pacientes',
                icon:'mdi-view-dashboard',
                to:'pacientes'
            },         
        ]
    }

    static meses(){
        return [
            { id: 1, mes: 'Janeiro'},
            { id: 2, mes: 'Fevereiro'},
            { id: 3, mes: 'Março'},
            { id: 4, mes: 'Abril'},
            { id: 5, mes: 'Maio'},
            { id: 6, mes: 'Junho'},
            { id: 7, mes: 'Julho'},
            { id: 8, mes: 'Agosto'},
            { id: 9, mes: 'Setembro'},
            { id: 10, mes: 'Outubro'},
            { id: 11, mes: 'Novembro'},
            { id: 12, mes: 'Dezembro'}
        ]
    }

    static icons(){
        return {
            dashboard: 'mdi-view-dashboard',
            html: 'mdi-language-html5',
            js: 'mdi-nodejs',
            json: 'mdi-code-json',
            md: 'mdi-language-markdown',
            pdf: 'mdi-file-pdf',
            png: 'mdi-file-image',
            txt: 'mdi-file-document-outline',
            xls: 'mdi-file-excel',
            info: 'mdi-book-information-variant',
            archivelock:'mdi-archive',
            ideia:'mdi-lightbulb-on',
            account:'mdi-account',
            home:'mdi-home',
            email:'mdi-email',
            prontuario:'mdi-medical-bag',
        }
    }

}

export default AppConfigService