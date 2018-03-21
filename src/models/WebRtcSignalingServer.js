/* WebRtcSiganlingServer */
let os = require('os');


class WebRtcSignalingServer{

	//let wss = {};

	constructor(webSocketServer) {
		this.wss = webSocketServer;
		this.dispatchIpAddr = this.dispatchIpAddr.bind(this);
		this.notifyNewConnection = this.notifyNewConnection.bind(this);
		this.getAllConnectedUsers = this.getAllConnectedUsers.bind(this);
	}

	dispatchIpAddr(data){

		let ifaces = os.networkInterfaces();
		for (let dev in ifaces) {
			ifaces[dev].forEach((details) => {
				if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
					//socket.emit('ipaddr', details.address);
					console.log("Despachando la IP del servidor al socket...");
					this.wss.emmitMessageToSingleSocket ('ipaddr',
						{'ip': details.address},
						data.room);
				}
		  });
		}

	}


	notifyNewConnection(socket){

		console.log("Se ha conectado un nuevo cliente al servicio: "+socket.id);
		//this.wss.emmitMessageToSingleSocket ('message',data.msg,data.room);
		let msgObj = {
	    	type: 'new connection',
			code: 200,
			id: socket.id
		};
		this.wss.emmitMessageToSockets ('message',msgObj);

	}


	getAllConnectedUsers(idSocketToResponse){

		let msgObj ={
			type: 'all clients',
			code: 200,
			clients: [],
		}
		//console.log(this.wss.socketServer.sockets);
		for (let client in this.wss.socketServer.sockets.connected){

			console.log(client);
			msgObj.clients.push(client);
		}

		console.log(msgObj)
		this.wss.emmitMessageToSingleSocket ('message',msgObj,idSocketToResponse);
		
	}

}


module.exports = exports = WebRtcSignalingServer;