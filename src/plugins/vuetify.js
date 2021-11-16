import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      dark: {
        primary: '#686868',
        secondary: '#47A4AD',
        accent: '#8c9eff',
        error: '#b71c1c',
        background: '#47A4AD',
        mytab:'#0e7580',
        white:'#ffffff',
        cinza2:'#88868b',
        mostarda:'#f1aa48',
      },
      options: {
        customProperties: false
      },
    },
  },
});

