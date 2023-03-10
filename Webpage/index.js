
var message_out = 'M1000100010001000';
var m1='0000';
var m2='0000';
var m3='0000';
var m4='0000';


/* TODO add websocket communication stuff for each of the buttons*/
function forward() {
	m1='1100';
	m2='1100';
	m3='0100';
	m4='0100';

	document.getElementById('current-action').textContent = "forward()";
}

function stop() {
	m1='2000';
	m2='2000';
	m3='2000';
	m4='2000';
	document.getElementById('current-action').textContent = "stop()";
}

function reverse(){
	m1='0100';
	m2='0100';
	m3='1100';
	m4='1100';
	document.getElementById('current-action').textContent = "reverse()";
}

function turnRight() {
    m1='1100';
    m2='0100';
    m3='0100';
    m4='1100';
    document.getElementById('current-action').textContent = "turnRight()";
}

function turnLeft() {
    m1='0100';
    m2='1100';
    m3='1100';
    m4='0100';
    document.getElementById('current-action').textContent = "turnLeft()";
}












function updateMsg(){
		console.log(motor);
		message_out = 'M' + m1 + m2 + m3 + m4 + '\n';
		console.log(message_out);
		ws.send(message_out);
}

function connect() {
  console.log("connecting");
  if ("WebSocket" in window) {
  var socketURL = location.origin.replace(/^http/, 'ws') + ':1234';
  
               // Let us open a web socket
               ws = new WebSocket(socketURL);
				//ws = new WebSocket(url);	
				
               ws.onopen = function() {
					console.log("opened websocket");
                  	// Web Socket is connected, send data using send()
                  	ws.send("publish motors");
					button = document.getElementById("cbutton");
		  			button.innerText = "Disconnect";
					button.onclick = "disconnect()";
					button.style.backgroundColor = "#f44336"; // same colors in hex and rgba (red)
					button.style.boxShadow = "1px 5px 20px rgba(244,67,54,0.75)";
               };
				
               ws.onmessage = function (evt) { 
                  var received_msg = evt.data;
                  console.log(received_msg);
               };
				
               ws.onclose = function() { 
                  
                  // websocket is closed.
                 console.log("websocket connection closed!!");
               };
            } else {
              
               // The browser doesn't support WebSocket
               alert("WebSocket NOT supported by your Browser!");
            }
}

function disconnect() {
	ws.close();
	console.log("user inititated disconnection");

	button = document.getElementById("cbutton");
	button.innerText = "Connect";
	button.onclick = "connect()";
	button.style.backgroundColor = "#4CAF50"; // same colors in hex and rgba (green)
	button.style.boxShadow = "1px 5px 20px rgba(76,175,80,0.75)";
}

function styleButton(element) {
	element.style.boxShadow = "inset 0 0 40px rgba(44, 155, 186, 0.75)";
}

function removeStyleButton(element) {
	element.style.boxShadow = "none";
}

window.addEventListener("gamepadconnected", event => {
    console.log('Gamepad Connected...');
    console.log(event.gamepad);
	window.requestAnimationFrame(update);
});

window.addEventListener("gamepaddisconnected", event => {
    console.log('Gamepad Disonnected...');
});



function getGamepadState() {
	const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
        const gamepadState = {
            id: gamepads[0].id,
            axes: {
                leftX: gamepads[0].axes[0].toFixed(3),
                leftY: gamepads[0].axes[1].toFixed(3),
                rightX: gamepads[0].axes[2].toFixed(3),
                rightY: gamepads[0].axes[3].toFixed(3),
			},

			/*
            buttons: [{ 
                button0: gamepads[0].buttons[0].pressed,
                button1: gamepads[0].buttons[1].pressed,
                button2: gamepads[0].buttons[2].pressed,
                button3: gamepads[0].buttons[3].pressed,
                button4: gamepads[0].buttons[4].pressed,
                button5: gamepads[0].buttons[5].pressed,
                button6: gamepads[0].buttons[6].pressed,
                button7: gamepads[0].buttons[7].pressed,
                button8: gamepads[0].buttons[8].pressed,
                button9: gamepads[0].buttons[9].pressed,
                button10: gamepads[0].buttons[10].pressed,
                button11: gamepads[0].buttons[11].pressed,
                button12: gamepads[0].buttons[12].pressed,
                button13: gamepads[0].buttons[13].pressed,
                button14: gamepads[0].buttons[14].pressed,
                button15: gamepads[0].buttons[15].pressed,
                button16: gamepads[0].buttons[16].pressed,
                button17: gamepads[0].buttons[17].pressed,
            }],	*/

			usefulButtons: {
				X: gamepads[0].buttons[0].pressed,
                Circle: gamepads[0].buttons[1].pressed,
                Square: gamepads[0].buttons[2].pressed,
                Triangle: gamepads[0].buttons[3].pressed,
				dpadUp: gamepads[0].buttons[12].pressed,
                dpadDown: gamepads[0].buttons[13].pressed,
                dpadLeft: gamepads[0].buttons[14].pressed,
                dpadRight: gamepads[0].buttons[15].pressed,
				L1: gamepads[0].buttons[4].pressed,
				L2: gamepads[0].buttons[6].pressed,
                R1: gamepads[0].buttons[5].pressed,
                R2: gamepads[0].buttons[7].pressed,
				share: gamepads[0].buttons[8].pressed,
                options: gamepads[0].buttons[9].pressed,
                touchPad: gamepads[0].buttons[17].pressed,
			}
        };

		return gamepadState;
    }
	return null;
}



function driverControl(gamepadState) {
	if (gamepadState) {
		if (gamepadState.axes.rightY < -0.7 || gamepadState.usefulButtons.dpadUp) {
			forward();
		}
        else if (gamepadState.axes.rightY > 0.7 || gamepadState.usefulButtons.dpadDown) {
            reverse();
        }
        else if (gamepadState.axes.rightX > 0.7 || gamepadState.usefulButtons.dpadRight) {
            turnRight();
        }
        else if (gamepadState.axes.rightX < -0.7 || gamepadState.usefulButtons.dpadLeft) {
            turnLeft();
        }
		else {
			document.getElementById('current-action').textContent = "no-op";
		}
	}
}



function update() {
    let gamepadState = getGamepadState();
	document.getElementById('gamepad-text').textContent = JSON.stringify(gamepadState);


	driverControl(gamepadState);

    
    window.requestAnimationFrame(update);
}



