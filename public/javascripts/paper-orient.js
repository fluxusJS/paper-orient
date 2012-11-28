
$(document).ready(function() {

  var socket = io.connect();

  // Im wondering if connection is deprecated? Yup, its connect.

  socket.on('connect', function (data) {
    console.log("client connect EVENT FIRED");
  });

  socket.on('message', function (data) {
    console.dir(data);
    console.dir(JSON.parse(data));
    var json = JSON.parse(data);    

    	if (json.gamma) {
          console.log('gamma: ' + json.gamma);
          console.log('beta: ' + json.beta);
          console.log('alpha: ' + json.alpha);
          console.log("CLIENT MESSAGE");

    		paper.setup('myCanvas');
      		with (paper) {
      		    var path = new Path.Rectangle([75, 75], [100, 100]);
      		    path.strokeColor = 'black';
      		    path.fillColor = 'red';
      		    view.onFrame = function(event) {
      		      	path.rotate(json.gamma);
      		    }
      		}
      }
    });
});