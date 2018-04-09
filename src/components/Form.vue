<template>
  <div>
    <b-form @submit="onSubmit" v-if="show">
      <b-container class="bv-example-row">
        <b-row>
          <b-col>
            <p>Cadastro de CEP</p>            
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="exampleInputGroup1"
                          label="CEP:"
                          label-for="exampleInput1"
                          description="">
              <b-form-input id="exampleInput1"
                            type="text"
                            v-model="form.cep"
                            v-on:change="getCEP"
                            v-on:keyup="getCEP"
                            v-on:keydown="getCEP"
                            v-on:keypress="getCEP"
                            v-on:blur="getCEP"
                            maxlength="9"
                            autocomplete="off"
                            placeholder="ex: 99999-999">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col><span class="error">{{form.error}}</span></b-col>
          <b-col></b-col>
        </b-row>

        <b-row>
          <b-col cols="5">
            <b-form-group id="exampleInputGroup2"
                          label="Logradouro:"
                          label-for="exampleInput2">
              <b-form-input id="exampleInput2"
                            type="text"
                            v-model="form.endereco.logradouro"
                            v-bind:readonly="!form.editable"
                            ref="logradouro">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
             <b-form-group id="exampleInputGroup3"
                          label="Número:"
                          label-for="exampleInput3">
              <b-form-input id="exampleInput3"
                            type="text"
                            v-model="form.endereco.numero"
                            ref="numero">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="5">
            <b-form-group id="exampleInputGroup4"
                          label="Complemento:"
                          label-for="exampleInput4">
              <b-form-input id="exampleInput4"
                            type="text"
                            v-model="form.endereco.complemento"
                            ref="Complemento">
              </b-form-input>
            </b-form-group>
          </b-col>         
        </b-row>

        <b-row>
          <b-col cols="5">
            <b-form-group id="exampleInputGroup5"
                          label="Bairro:"
                          label-for="exampleInput5">
              <b-form-input id="exampleInput5"
                            type="text"
                            v-model="form.endereco.bairro"
                            v-bind:readonly="!form.editable"
                            ref="bairro">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="5">
            <b-form-group id="exampleInputGroup6"
                          label="Cidade:"
                          label-for="exampleInput6">
              <b-form-input id="exampleInput6"
                            type="text"
                            v-model="form.endereco.localidade"
                            v-bind:readonly="!form.editable"
                            ref="localidade">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group id="exampleInputGroup7"
                          label="Estado:"
                          label-for="exampleInput7">
              <b-form-input id="exampleInput7"
                            type="text"
                            v-model="form.endereco.uf"
                            v-bind:readonly="!form.editable"
                            ref="uf">
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      
        <b-button type="submit" v-bind:disabled="!isValid" variant="primary">Avançar</b-button>
        <b-button type="reset" variant="danger">Resetar</b-button>
      </b-container>
    </b-form>

    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <ul class="list" id="example-1">
            <li v-for="cp in ceps">
                {{ cp.logradouro }}, {{ cp.numero }} {{ cp.complemento }} - {{ cp.bairro }}, {{ cp.localidade }}/{{ cp.uf }}. CEP: {{ cp.cep }} 
                <span v-if="locationLoaded">
                  <span>{{ cp.distancia }}</span>
                  - <a v-bind:href="'https://www.google.com/maps/dir/'+ currentLocation.lat +',' + currentLocation.lng +'/'+ cp.logradouro +',' + cp.numero + '-' + cp.bairro +',' + cp.localidade +'/?&travelmode=driving'" target="_blank">Rota</a>
                </span>
            </li>
          </ul>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>


<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        form: {
          editable: true,
          cep: '', 
          error: '', 
          endereco: {
            logradouro: '',
            bairro: '',
            localidade: '',
            uf: '',
            numero: '',
            complemento: '',
            distancia: ''
          }
        },

        ceps: this.$ceps,

        show: true,
        currentLocation: {lat: 0, lng: 0},
        locationLoaded: false,
        loading: false
      }
    },

    computed: {
      isValid: function(){
        return this.form.cep != '' && this.form.endereco.logradouro != '' && this.form.endereco.bairro != '' && this.form.endereco.localidade != '' && this.form.endereco.uf != '' /*&& this.form.endereco.numero != '' && this.form.endereco.complemento != ''*/
      }
    },

    methods: {
      initCurrentLocation: function(){
        if ( navigator.geolocation ) {
          navigator.geolocation.getCurrentPosition( this.setCurrentLocation )
        }
      },

      setCurrentLocation: function( position ){
        this.currentLocation.lat = position.coords.latitude 
        this.currentLocation.lng = position.coords.longitude
        this.locationLoaded = true
        this.$forceUpdate()
      },

      getCEP: function() {
        const that = this
        const url = 'https://viacep.com.br/ws/' + that.form.cep + '/json'

        if( ( /^([0-9]{5})(-?)([0-9]{3})$/ ).test( that.form.cep ) ){
          if( (/^( [0-9]{8})$/ ).test( that.form.cep ) ){
            that.form.cep = ( that.form.cep ).substr( 0,5 ) + '-' + ( that.form.cep ).substr( 5,8 )
          }
          axios.get( url )
          .then( response => {
            var result = response.data
            that.form.error = ''
            that.form.editable = false
            that.form.endereco = result
            that.form.endereco.numero = ''
            that.form.endereco.complemento = ''
            that.form.endereco.distancia = ''
            that.$refs.numero.$el.focus()

            if( result.erro ){
              that.form.error = 'CEP não encontrado'
              that.form.editable = true
              that.form.result = ''
              that.$refs.logradouro.$el.focus()
            }
          } )
        } else {
          that.form.editable = true
        }
      },

      cleanFields: function(){
        this.form.editable = true
        this.form.cep = ''
        this.form.endereco.logradouro = ''
        this.form.endereco.numero = ''
        this.form.endereco.complemento = ''
        this.form.endereco.bairro = ''
        this.form.endereco.localidade = ''
        this.form.endereco.uf = ''
        this.form.endereco.distancia = ''
      },

      onSubmit ( evt ) {
        evt.preventDefault()
        this.refreshCeps( this.form.endereco, this.form.cep )
      },

      refreshCeps: function( val, cep ){
        //this.ceps.push( val )
        val.distancia = this.getDistance(this.form.endereco.logradouro +',' + this.form.endereco.numero + '-' + this.form.endereco.bairro +',' + this.form.endereco.localidade)
        this.$ceps.push( val )
        
        /*if( typeof this.$ceps[cep] == 'undefined' ) {
          this.ceps.push( {[cep] : val} )
        } else {
          this.ceps[cep] = val
        }
        this.$ceps[cep] = val
        this.ceps = []*/
        localStorage.setItem( 'cepss', JSON.stringify( this.$ceps ) )
        this.cleanFields()
      },

      getDistance: function( addr ){
        if(this.locationLoaded){
          var geocoder = new google.maps.Geocoder();
          var $from = new google.maps.LatLng( {lat: this.currentLocation.lat, lng: this.currentLocation.lng} )
          geocoder.geocode( { 'address': addr}, function(results, status) { 
            if (status == 'OK') {
              var $to = results[0].geometry.location
              var $dst = google.maps.geometry.spherical.computeDistanceBetween( $from, $to )
              if($dst > 0){
                $dst = $dst / 10
              }
              return '- Distancia: ' + $dst + 'km'
            }
          });
        }
      }
    },

    watch: {
      ceps: function( val ) {
       this.ceps = this.$ceps
      }
    }, 

    mounted: function(){
      this.initCurrentLocation()
    }
  }

  /*var $from = new google.maps.LatLng( {lat: -22.9278165, lng: -43.3536968} )
  var $to = new google.maps.LatLng( {lat: -22.9201824, lng: -43.3368528} )
  google.maps.geometry.spherical.computeDistanceBetween( $from, $to )*/
</script>

<style>
  .error { font-weight: bold; color: red; vertical-align: middle; }
  .list { margin: 30px 0 0; padding: 30px 0 0; list-style: none; border-top: solid 1px #333; }
  .list li { margin: 0 0 10px; }
  .list li:before { margin: 0 0 10px; content:"-"; }
</style>