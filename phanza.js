// Define charts variables (global)
var positionsInTime;
var velocitiesInTime;

function calculateCarPosition(initialPosition, initialVelocity, time, acceleration) {
    // To perform the simulation, the formula we need to use is:
    // S = So + V0*t + at2/2
    // This will gave us the position of the car in a determinated time or velocity.
    
    return (initialPosition + (initialVelocity*time) + roundFloat((acceleration*Math.pow(time, 2)), 5)/2.0);
}

function calculateCarVelocity(initialVelocity, acceleration, time) {
    // To calculate the velocity in a determinated point with a
    // determinated acceleration we use the following formula:
    // V = V0 + a*t
    
    return (initialVelocity + (acceleration*time));
}

function roundFloat(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function simulateMovement() {
    // Declare all variables to get fast access from Javascript
    var initialPosition = parseFloat($("#inputs #initial_position").val());
    var finalPosition = parseFloat($("#inputs #final_position").val());
    var initialVelocity = parseFloat($("#inputs #initial_velocity").val());
    var acceleration = parseFloat($("#inputs #acceleration").val());
    
    // Place demonstration values
    $("#math #initial_velocity").text(initialVelocity);
    $("#math #acceleration").text(acceleration);
    $("#math #ap_1").text(initialPosition);
    
    if(acceleration == 0) {
        $("#math #ap_2").text(initialPosition + initialVelocity);
        $("#math #ap_3").text(initialPosition + (2*initialVelocity));
    } else {
        var geometryInitialPosition = initialPosition;
        if(initialPosition == 0) {
            geometryInitialPosition = 1;
        }
        
        $("#math #ap_2").text(roundFloat(geometryInitialPosition * (initialVelocity*acceleration), 3));
        $("#math #ap_3").text(roundFloat(geometryInitialPosition * 2 * (initialVelocity*acceleration), 3));
    }
    
    $("#physics #initial_position").text(initialPosition);
    $("#physics #initial_velocity").text(initialVelocity);
    $("#physics #acceleration").text(acceleration);
    
    $("#calculations").show();
    $("#charts").show();
    
    // Configure the values of the initial point and the final point in the highway marks
    $("#highway_marks #initial_position").text(initialPosition + "m");
    $("#highway_marks #final_position").text(finalPosition + "m");
    
    // Declare movement loop variables
    var i = 0;
    var position = 0;
    var positionInPixels = 0;
    var lastPosition = 0;
    var shouldBreak = false;
    var graphicCounter = 0;
    positionsInTime = new Array();
    velocitiesInTime = new Array();
    
    // The second 0 will not be added using the loop logic
    positionsInTime.push(roundFloat(initialPosition, 2));
    velocitiesInTime.push(roundFloat(initialVelocity, 2));
    
    while(position <= finalPosition) {
        
        if(shouldBreak) {
            break;
        }
        
        i += 0.1;
        graphicCounter += 1;
        
        position = calculateCarPosition(initialPosition, initialVelocity, i, acceleration);
        
        if(graphicCounter == 10) {
            graphicCounter = 0;
            positionsInTime.push(roundFloat(position, 2));
            velocitiesInTime.push(roundFloat(calculateCarVelocity(initialVelocity, acceleration, i), 2))
        }
        
        if(lastPosition = 0) {
            lastPosition = position;
        }   
        
        positionInPixels = (position*875)/finalPosition;
        
        if(positionInPixels >= 870 || positionInPixels < 0) {
            shouldBreak = true;
        }
        
        var counter = 0;
        
        $("#car_object").animate({
            marginLeft: positionInPixels
        }, {
            duration: 100,
            step: function(now, fx) {
                var currentPosition = roundFloat(((now)*finalPosition)/875, 1);
                $("#car_object #object_values").html(currentPosition + " m")
            }
        });
        lastPosition = position;
    }
    
    // if(graphicCounter != 0) {
    //     // If the movement is irregular, the last second will be lost in the chart
    //     positionsInTime.push(roundFloat(finalPosition, 2));
    //     velocitiesInTime.push(roundFloat(calculateCarVelocity(initialVelocity, acceleration, i), 2));
    // }
    
    renderPositionGraphic(positionsInTime);
    renderVelocityGraphic(velocitiesInTime);
}

function renderPositionGraphic(positionData) {
    chart = new Highcharts.Chart({
    	chart: {
    		renderTo: 'position_over_time',
    		defaultSeriesType: 'line',
    		marginRight: 0,
    		marginBottom: 35
    	},
    	title: {
    		text: 'Tempo x Distância',
    		x: -20 //center
    	},
    	xAxis: {
    	    title: {
    	        text: 'Distância (metros)'
    	    }
    	},
    	yAxis: {
    		title: {
    			text: 'Tempo (segundos)'
    		},
    		plotLines: [{
    			value: 0,
    			width: 1,
    			color: '#808080'
    		}]
    	},
    	tooltip: {
    		formatter: function() {
                    return '<b>Instante ' + this.x +'s:</b> ' + this.y + 'm'
    		}
    	},
    	legend: {
    		layout: 'vertical',
    		align: 'right',
    		verticalAlign: 'top',
    		x: -10,
    		y: 400,
    		borderWidth: 0
    	},
    	series: [{
    		data: positionData
    	}]
    });
}

function renderVelocityGraphic(velocityData) {
    chart = new Highcharts.Chart({
    	chart: {
    		renderTo: 'velocity_over_time',
    		defaultSeriesType: 'line',
    		marginRight: 0,
    		marginBottom: 35
    	},
    	title: {
    		text: 'Tempo x Velocidade',
    		x: -20 //center
    	},
    	xAxis: {
    	    title: {
    	        text: 'Velocidade (metros por segundo)'
    	    }
    	},
    	yAxis: {
    		title: {
    			text: 'Tempo (segundos)'
    		},
    		plotLines: [{
    			value: 0,
    			width: 1,
    			color: '#808080'
    		}]
    	},
    	tooltip: {
    		formatter: function() {
                    return '<b>Instante ' + this.x +'s:</b> ' + this.y + 'm/s'
    		}
    	},
    	legend: {
    		layout: 'vertical',
    		align: 'right',
    		verticalAlign: 'top',
    		x: -10,
    		y: 400,
    		borderWidth: 0
    	},
    	series: [{
    		data: velocityData
    	}]
    });
}

function toggleGraphics() {
    renderPositionGraphic(positionsInTime);
    renderVelocityGraphic(velocitiesInTime);
    $('#charts_toggle').toggle();
}