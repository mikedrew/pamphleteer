'use strict';

const Hapi = require('hapi')
const server = new Hapi.Server()

var os = require('os');
var exec = require('child_process').execFile;
var spawn = require('child_process').spawn;
var child_process = require('child_process');
var fs = require('fs');
var inert = require('inert');

server.connection({
	port: 8000,
	routes: {
		cors:true
	}
});

server.register(inert,() => {});

server.route({
	method:'GET',
	path:'/{param*}',
	handler:{
		directory:{
			path:'./site',
			redirectToSlash: true,
			index: true
		}
	}


});

server.route({
	method:'GET',
	path:'/hello',
	handler: function(request,reply){
		return reply(Date());
	}
		
});

server.route({
	method:'POST',
	path:'/start',
	handler: function(request,reply){
		var ssidStr = request.payload.ssid;
		ssidStr = ssidStr.replace(/,/g,'\r\n');
		
		fs.writeFile('ssidList',ssidStr,function(err){

		});

		var child = spawn(__dirname + '/beaconStart');
                
		child.stdout.on('data',function(d){
                	console.log(d.toString());
                });

                child.stderr.on('data',function(d){
	        	console.log(d.toString()); 		

		});

	}

});

server.route({
	method: 'POST',
	path:'/stop',
	handler: function(request,reply){
		 var child = spawn(__dirname + '/beaconStop');

		child.stdout.on('data',function(d){
			console.log(d.toString());
		});

		child.stderr.on('data',function(d){
			console.log(d.toString());
		});

	}
});


server.start((err) => {

	if(err){
		throw err;
	}

	console.log('Server running at:', server.info.uri);

})
