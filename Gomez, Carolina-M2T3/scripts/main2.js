Vue.createApp({//un objeto que tiene propiedades
    data() {//data un objeto que retorna mas propiedades 
      return {
        init :{
            method:"GET",
            headers :{
                "X-API-Key" : "mKap1p5z4xvXwUvzYl5bsOvTb18eVTnL9ySMo1da"
            }
        },
        URLAPI : "",
        miembros : [],
        valoresCheckbox :[],
        auxiliarPartido : [],
        auxiliarEstado : [],
        opcionSeleccionada :"all",
        estadosOrdenados : [],
        
        cantidadesR: 0,
        cantidadesD: 0,
        cantidadesID: 0,
        votosR: 0,
        votosD: 0,
        votosID: 0,
        total: 0,
        miembrosTotalesPorPartidos:0,

        arrayCortadoMenores : [],
        arrayCortadoMayores : [],
        arrayCortarMenoresLeales : [],
        arrayCortarMayoresLeales : [],
     }
    },

      created(){
        let chamber = document.querySelector("#senadoTabla") ? "senate" : "house"
        this.URLAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

        fetch(this.URLAPI, this.init)
        .then(response => response.json())
        .then(data => {
            this.miembros = data.results[0].members
            this.traerEstados(this.miembros)
            this.contarMiembrosPorPatido(),
            this.tablaAsistencia()
            let loading = document.querySelector("#loader")
            loading.classList.add("loader-desactive")
        })
    },
    methods : {
        traerEstados (datos){
            let ordenado = [] //creo un array vacio, donde se van a guardar la info
            datos.forEach(cadaMiembro => { //llamo a la variable que contien los datos y quiero que me haga un foreach (donde me va arecorrer todo el array)
                if(!ordenado.includes(cadaMiembro.state)){ //quiero que los estados no se repitan, entonces si los estados no se repiten incluimelos en el array (xcada array por miembro) que cree para guardar la info, includes me dice si es true o false
                    ordenado.push(cadaMiembro.state)//una vez que tengo la info haceme un push (agragamelo)a los que no se repiten
                };
            });
            this.estadosOrdenados = ordenado.sort()
        },

        filtrarPorPartidoYEstado () {
            this.auxiliarPartido = []
            this.auxiliarEstado = []

            if (this.valoresCheckbox.length == 0) {
                this.auxiliarPartido = this.miembros  
            }else{
                this.miembros.forEach(miembroPorPartido => 
                this.valoresCheckbox.forEach(check =>{
                    if(miembroPorPartido.party == check){
                        this.auxiliarPartido.push(miembroPorPartido)
                    }
                }))
            };

            this.auxiliarPartido.forEach(miembroFiltrado => {
                if(this.opcionSeleccionada == "all"){
                    this.auxiliarEstado.push(miembroFiltrado)
                }else if (this.opcionSeleccionada == miembroFiltrado.state) {
                    this.auxiliarEstado.push(miembroFiltrado)
                }
            })
        },
        contarMiembrosPorPatido(){
            this.miembros.forEach(miembros =>{
                if(miembros.party == "R"){
                    this.cantidadesR ++;
                    this.votosR += miembros.votes_with_party_pct;
                }else if(miembros.party == "D" ){
                    this.cantidadesD ++;
                    this.votosD += miembros.votes_with_party_pct;
                }else if(miembros.party == "ID"){
                    this.cantidadesID ++;
                    this.votosID += miembros.votes_with_party_pct;
                }
            })
            
            this.total =((this.votosR + this.votosD + this.votosID)/(this.cantidadesR + this.cantidadesD + this.cantidadesID)).toFixed(2);
            this.votosR = (this.votosR/this.cantidadesR).toFixed(2);
            this.votosD = (this.votosD/this.cantidadesD).toFixed(2);
            this.votosID = (this.votosID > 0) ? (this.votosID/this.cantidadesID).toFixed(2) : 0;

            this.miembrosTotalesPorPartidos = (this.cantidadesR + this.cantidadesD + this.cantidadesID);
        },
        tablaAsistencia(){
            let porcentajeDiez = Math.floor(this.miembrosTotalesPorPartidos * 0.10)

            const ordenarMenor = (x, y) => y.missed_votes_pct - x.missed_votes_pct
            const ordenarMayor = (x, y) => x.missed_votes_pct - y.missed_votes_pct

            const lealMenor = (x, y) => y.votes_with_party_pct - x.votes_with_party_pct
            const lealMayor = (x, y) => x.votes_with_party_pct - y.votes_with_party_pct

            function cortarArray(array){
                let arrayCortado = [] 
                for (let i=0; i < porcentajeDiez; i++){ 
                    arrayCortado.push(array[i]); 
                };
                return arrayCortado; 
            };

    let menores = this.miembros.sort(ordenarMenor);
    this.arrayCortadoMenores = cortarArray(menores);
    console.log(this.arrayCortadoMayores)

    let mayores = this.miembros.sort(ordenarMayor); 
    this.arrayCortadoMayores = cortarArray(mayores); 
    
    //---tablaP
    let lealMenores = this.miembros.sort(lealMenor);
    this.arrayCortarMenoresLeales = cortarArray(lealMenores);
    
    let lealMayores = this.miembros.sort(lealMayor);
    this.arrayCortarMayoresLeales = cortarArray(lealMayores);
    },
    },
    computed:{

        filtrar (){
            this.filtrarPorPartidoYEstado()
        }
    },
}).mount('#app')//enlasamos nuestro objeto vue con el id,queda entrelasado nuestro html con el objeto vue