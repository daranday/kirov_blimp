function init_socket() {
	//------ Define your variables here
	var ws;
	if("WebSocket" in window) {
		var host = window.location.host;
		// alert(host)
		// var host = "blimp.local:8888"
		ws = new WebSocket("ws://" + host + "/control_signal");
		

		function check_ws() {
			if (ws.readyState === 1) {
				alert('Connection successful');
			} else {
				alert('Connection failed')
			}
		}
		// window.setTimeout(check_ws,1000);
	} else {
		alert('WebSocket NOT supported')
	}
	var nIntervId;
	 
	//steering min and max pwm cmds
	var maxbeta = .175; //r limit
	var minbeta = .105; //l limit

	//throttle min and max pwm cmds
	var mingamma = .105; //backwards limit
	var maxgamma = .175; //forward limit

	// This function is called when the page 1st loads on your phone
	//
	$(function()
	{
		//send data to the pi at 20Hz
		nIntervId = setInterval(SendToPi ,50);
		window.controller = 'Ready'
	});


	// This fuction is called @ 20Hz
	function SendToPi()
	{
		if (window.controller == 'Ready') {
			window.controller = 'NotReady';
			var data = { l : { y : Number((leftStickY * 1.0 / leftRange).toFixed(1)), 
								x : Number(((leftStickX - leftStickOriginX) * 1.0 / leftRange).toFixed(1))}, 
								r: Number(((rightStickY * 1.0 / rightRange + 1) / 2).toFixed(1)) }
			try {
				ws.send(JSON.stringify(data));
			} 
			catch(err){}
			window.controller = 'Ready'
		}		    
	}
}


init_socket();