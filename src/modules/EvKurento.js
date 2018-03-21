let kurento = require('kurento-client');
let evKurentoClt = ((kurento)=>{

	let _kurentoClt = null;
	let _argv = {};
	let _pipeLines = [];


	function _getKurentoClient(){

		let kc = kurento.KurentoClient(argv.ws_uri);
		kc = kc.then((kurentoCliente)=>{

			console.log(kurentoCliente);
			_kurentoClt = kurentoCliente;
			return kurentoCliente;

		},(error)=>{
				// Connection error
				console.log("Error generando el cliente de kurento");
			return error;
		});
	}


	function _createPipeLine(){

		if (kurentoClt == null){

			return false;
		}

		kurentoClt.create("MediaPipeLine",(error,pl)=>{
			if (error){
				return error;
			}
			console.log(pl);
			pipeLines.push(pl);

		});

	}

	return ({

		kurentoClt: _kurentoClt,
		setParameters: (extArgv)=>{
			argv = extArgv;
		},
		getParameters(){

			return argv;

		},
		setKurentoCliente: ()=>{

			_getKurentoClient();
		},
		createPipeLine: ()=>{

			_createPipeLine();

		}


	})

})(kurento);

evKurentoClt.setParameters()

module.exports = exports = evKurentoClt;