'use strict';
var socketio = require('socket.io');
var PubSub = require('PubSub');

class WebSocketsServer{

	constructor(httpServer) {
		
		/* Instancia un servidor de websockets */
		this.socketServer = new socketio(httpServer);
		this.pubsub = new PubSub();
		this.maxUserPerRoom = 2;
		console.log("Inicilializando el servidor de sockets...")
	}


	emmitMessageToSockets (eventType,msgObj){

		this.socketServer.sockets.emit(eventType,msgObj);

	}

	emmitMessageToSingleSocket (eventype,msgObj,room){

		console.log("WebSocketsServer L25: Despachando para room: "+room);
		this.socketServer.to(room).emit(eventype,msgObj);

	}


	subscribeToEvents (topic,callback){
		return this.pubsub.subscribe(topic,callback);
	}

	unSubscribeToEvents (reference){
		return this.pubsub.unsubscribe(reference);
	}

	startToListenSocketsEvents (){

		this.socketServer.sockets.on('connection', (socket)=>{

		    /* Registra el socket */
		    socket.emit('message',{
		    	type: 'connected',
				code: 200,
			});
		    console.log("Se ha conectado: "+socket.id);
		    this.pubsub.publish('connection',socket);
		    //console.log(socketServer.sockets);
		    //console.log(socket.client);

		    /* suscribe un socket a un room */
		    socket.on('subscribe', (data)=>{ 

		    	let msgObj = {}
		    	if (typeof this.socketServer.sockets.adapter.rooms[data.room] != 'undefined'){
		    		console.log("El room existe y tiene "+this.socketServer.sockets.adapter.rooms[data.room].length+" sockets conectados");
		    		if (this.socketServer.sockets.adapter.rooms[data.room].length < this.maxUserPerRoom){
		    			console.log("Registrando el socket "+socket.id+" al room "+data.room+".");
		    			socket.join(data.room); 
		    			msgObj = {
		    				code: 200,
		    				type: 'joined',
		    				members : this.socketServer.sockets.adapter.rooms[data.room].length,
		    				joined : true,
		    			}
		    			this.emmitMessageToSingleSocket ("message",msgObj,socket.id);
		    		}
		    		else{
		    			console.log("No es posible registrar el socket "+socket.id+" al room "+data.room+", room completo");
		    			msgObj.error = "El room está completo";
		    			msgObj.code = 412;//HTTP 412 Error, 412 Precondition Failed
		    			msgObj.type = 'no joined';
		    			this.emmitMessageToSingleSocket ("error",msgObj,socket.id);
		    		}
		    	}
		    	else{
		    		console.log("Creando el nuevo room "+data.room+" y registrando el socket "+socket.id+"...");
		    		socket.join(data.room); 
		    		msgObj = {
		    			code: 200,
		    			type: 'joined',
						members : this.socketServer.sockets.adapter.rooms[data.room].length,
						joined : true,
	    			}
	    			//Retorna la notificación al socket
		    		this.emmitMessageToSingleSocket ("message",msgObj,socket.id);
		    		//Emite el mensaje para los clientes que están conectados al PubSub de este metodo
		    		data.msgObj = msgObj;
		    		data.socketid = socket.id;
		    		this.pubsub.publish('subscribe',data);
		    	}
		    })

		    /* desuscribe a un socket de un room */
		    socket.on('unsubscribe', (data)=>{  
		        socket.leave(data.room); 
		        //Retorna la notificación al socket
		        let msgObj = {
		        	code: 200,
		        	msg: 'Ha salido del room '+data.room,
		        	type: 'leave'
		        }
	    		this.emmitMessageToSingleSocket ("message",msgObj,socket.id);
	    		//Emite el mensaje para los clientes que están conectados al PubSub de este metodo
	    		data.msgObj = msgObj;
	    		data.socketid = socket.id;
	    		this.pubsub.publish('subscribe',data);
		    })

		    socket.on('send', (data)=>{
		        socket.sockets.in(data.room).emit('message', data.message);
		    });

		    socket.on('message',(data)=>{
		    	console.log(data);
		        console.log("=======================\n");
				this.pubsub.publish(data.topic,data.info);
		    });
		});

	};

}


//Usando require();
module.exports = exports = WebSocketsServer;

//Usando Import
//export default WebSocketsServer;