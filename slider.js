var yearValues = {};
var currentYear, playInterval;
var slideDuration = 1000; // in milliseconds
var autoRewind = true;
var years, length;

$.when(
	$.getJSON( "./history.js", {})   
	.done (function( data ) {
		
		years = data;
		console.log(years);
		length = Object.keys(years).length;

	    //initialize slider
		$("#slider").slider({
			value: 0,
			min: 0,
			max: length-1,
			step: 1,
			/*change:function(event, ui){
				setYear(ui.value);
		    },*/
		    slide:function(event, ui){
		    	setYear(ui.value);
		    }
		});

		$(".ui-slider-handle").mousedown(function(event) {
			playdown = true;
		});

		$(".ui-slider-handle").click(function(event) {
			if (playdown && event.target == this) {
				if (playInterval != undefined) {
					//pause
		            clearInterval(playInterval);
		            playInterval = undefined;
		            $(this).removeClass("active");
		            return;
		        }

		        //play
				console.log("play slide every ms: "+slideDuration);
		        $(this).addClass("active");
		
		        playInterval = setInterval(function () {
		            currentYear++;
		            if (currentYear > length-1) {
		                if (autoRewind) {
		                    currentYear = 0;
		                }
		                else {
		                    clearInterval(playInterval);
		                    return;
		                }
		            }
		            setYear(currentYear);
		        }, slideDuration);
		    }
		});

		showLabels();
		setYear(0);
	})
	.error (function( data ) {
		console.log("error loading history.js!");
	})
).then(function() { 
	console.log("history.js loaded!");
});

/* set active slide */
function setYear(index) {
	currentYear = index;
	var yearString = getYearString(years[currentYear+1].date)
	console.log("set slide ["+index+"] "+yearString);

	//set slider value
	$("#slider").slider("value", index);

	//highlight label value
	$("div.year").removeClass("active");
	//$("div.year:contains('"+yearString+"')").addClass("active");
	$("div.year")
		.filter(function(){ 
			return $(this).data("year") === years[currentYear+1].date;
		})
		.addClass("active");

	//set text value
	$("#year").empty();
	$("#year").append(yearString+": "+years[currentYear+1].name.en);
}

/* add a.c. if necessary */
function getYearString(year) {
    if (year < 0) {
		year = year.toString().replace("-", "");
		return year+" a.c.";
	}
  	else { 
  		return year;
  	}
}

/* show timeline labels */
function showLabels(){
	for (key in years) {
		var pos = 97/(length-1)*(key-1);
		var yearString = getYearString(years[key].date);
		$("#dates").append("<div style='left:"+pos+"%' class='year rotate' data-pos='"+key+"' data-year='"+years[key].date+"' data-name='"+years[key].name.en+"'>"+yearString+"</div>");
	}

	$("div.year").on('click', function(e) {
		setYear($(this).data("pos")-1);
	});
}
