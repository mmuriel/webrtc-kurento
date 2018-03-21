let kurento = require('kurento-client');


class EvKurentoCliente{

	constructor(argv){

		this.argv = argv;
		this.kurentoClt = {};
		this.pipelines = [];
		this.fulfillCreateKurentoCliente = this.fulfillCreateKurentoCliente.bind(this);
		this.fulfillmentCreatePipeLine = this.fulfillmentCreatePipeLine.bind(this);
		this.createPipeLine = this.createPipeLine.bind(this);	
		this.createKurentoCliente = this.createKurentoCliente.bind(this);	


	}
	/**
	* Esta función se pasa como fulfillment (éxito) a la promesa 
	* de generación del cliente Kurento
	*
	* @param {kurento-client} kc - El objeto kurento-client
	* 
	*/
	fulfillCreateKurentoCliente(kc){
		if (error){
			console.log ("Error generando el Kurento Cliente");
			return error;
		}


		this.kurentoClt = kc;
		console.log(this.kurentoClt);
		return kc;
	}


	/**
	* Esta función se pasa como fulfillment (éxito) a la promesa
	* de generación de un Kurento MediaPipeLine
	*
	* @param {Error} Error - El error arrojado en caso de error.
	* @param {MediaPipeLine} pl - El MediaPipeLine generado
	*
	*/
	fulfillmentCreatePipeLine(error,pl){
		if (error){
			console.log("No se pudo generar el nuevo pipeline");
			return error;
		}
		this.pipelines.push(pl);
	}


	createKurentoCliente(){

		let kc = kurento.KurentoClient(this.argv.ws_uri);
		kc = kc.then(this.fulfillCreateKurentoCliente,(error)=>{
  			// Connection error
  			console.log("Error generando el cliente de kurento");
			return error;
		});

	}

	createPipeLine(){
		console.log(this.kurentoClt);
		this.kurentoClt.create("MediaPipeLine",this.fulfillmentCreatePipeLine);
	}

}

module.exports = exports = EvKurentoCliente;