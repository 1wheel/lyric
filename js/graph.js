//function makeGraphFunction(){
	
	var maxM;
	var minM;
	var maxT;
	var minT;
	var maxB;
	var minB;
			var alpha = 600/30;

	var mx;
	
	var loud;
	var magA = [];			//loudness magnitude 
	var timeA = [];			//time
	var bpmA = [];			//bmi
	var bpmAC = [];			//confidence of bpm
	var magAm = [];			//same as above, scaled to dimensions of canvas for graph
	var timeAm = [];
	var bpmAm = [];
	var magAmS = [];		//smoothed
	var bpmAmS = [];
	var arrayLength;
		
	function makeLoudness(){	
		magA = [];
		if (cur_analysis) {
			var segmentArrary = cur_analysis.segments;
			arrayLength = segmentArrary.length;
			
			var bi = 0;
			var tempbeat = cur_analysis.beats[bi];
			for (var i = 0; i < arrayLength; i++) {		
				if (cur_analysis.track.end_of_fade_in < segmentArrary[i].start && segmentArrary[i].start < cur_analysis.track.start_of_fade_out){
					magA[magA.length] = segmentArrary[i].loudness_max; 
					timeA[timeA.length] = segmentArrary[i].start;
					console.log = cur_analysis;
					while (i > 0 && bi < cur_analysis.beats.length && tempbeat.start < segmentArrary[i].start){
						console.log = i;
						tempbeat = cur_analysis.beats[bi++];
					}
					bpmA[bpmA.length] = 60/tempbeat.duration;
					bpmAC[bpmAC.length] = tempbeat.confidence;
				}
			}
			
			maxM = Math.max.apply(Math, magA);
			minM = Math.min.apply(Math, magA);
			maxT = Math.max.apply(Math, timeA);
			minT = Math.min.apply(Math, timeA);
			maxB = bpmA.sum()/arrayLength + 10;
			minB = bpmA.sum()/arrayLength - 10;

			arrayLength = magA.length;
			for (var i = 0; i < arrayLength; i++) {		
				magAm[i] = Xmax-(magA[i]-minM)*(Ymax-0)/(maxM-minM); 
				timeAm[i] = (timeA[i]-minT)*(Xmax-0)/(maxT-minT); 
				bpmAm[i] = Xmax-(bpmA[i]-minB)*(Ymax-0)/(maxB-minB)
			}

			smoothCurves();
			MousePressed = false;
		}
	}
		
	function drawLoudness(){
		while (magA.length==0){
			makeLoudness();
		}
			
		processingInstance = Processing.getInstanceById('sketch');
		processingInstance.background(100);
		
		processingInstance.fill(255,0,0);
		processingInstance.noStroke();
		for (var i = 0; i < arrayLength; i++) {	
			processingInstance.ellipse(timeAm[i],magAm[i], 2, 2);
		}			
		drawCurve(magAmS, 255, 0, 0);

		processingInstance.fill(0,255,0);
		for (var i = 0; i < arrayLength; i++) {	
			processingInstance.ellipse(timeAm[i],bpmAm[i], 2, 2);
		}
		drawCurve(bpmAmS, 0,255,0);	
		
		var track = sp.trackPlayer.getNowPlayingTrack();
		tx = Math.round(track.position/track.length*Xmax);

		mx = processingInstance.mouseX;
		//mi = 0;
		//while (timeAm[mi] < mx) {
		//	mi++;
		//}
		processingInstance.strokeWeight(1);
		processingInstance.stroke(255);
		processingInstance.line(0,magAmS[mx],mx,magAmS[mx]);
		processingInstance.line(mx,magAmS[mx],mx,Ymax);
		
		//tx = track.position/1000;
		//ti = 0;
		//while (timeA[ti] < tx) {
		//	ti++;
		//}	
		processingInstance.stroke(1);
		processingInstance.line(0,magAmS[tx],tx,magAmS[tx]);
		processingInstance.line(tx,magAmS[tx],tx,Ymax);
		
		//document.getElementById('xcord').innerHTML = "xcord " + timeA[mi]  ;
		//document.getElementById('ycord').innerHTML = "timeAm[mi] " + timeAm[mi] + " mi " + mi + " tx " + tx + " ti " + ti;
		
		if (MousePressed) {
			sp.trackPlayer.seek(Math.round(track.length*mx/600));
			MousePressed = false;
		}
	}
	
	function drawCurve(Array, r, g, b) {
				
		processingInstance.noFill();
		processingInstance.beginShape();
		processingInstance.stroke(r, g, b)
		processingInstance.strokeWeight(3);
		processingInstance.strokeJoin("MITER");
		for (var i = 0; i < Ymax; i++){
			processingInstance.vertex(i,Array[i]);
		}
		processingInstance.endShape();
		processingInstance.noStroke();
	}
	
	function smoothCurves() {
		var outA = [];
		var sumPostionsM = [];
		var sumWeightsM = [];
		var sumPositionsB = [];
		var sumWeightsB = [];
		var lastValue;
		var w;
		for (var i = 0; i < Ymax; i++){
			sumWeightsM.setAll= 0;
			sumWeightsB.setAll= 0;
			sumPostionsM.setAll= 0;
			sumPositionsB.setAll= 0;
			for (var j = 0; timeAm[j] < arrayLength; j++){
				if (-alpha + i <= timeAm[j] && timeAm[j] < alpha + i) {
					w = ((1-(timeAm[j]-i)/Ymax)^2)^3;
					sumPostionsM[j] = w*magAm[j];
					sumWeightsM[j] = w;
					sumPositionsB[j]= w*bpmAC[j]*bpmAm[j];
					sumWeightsB[j]= w*bpmAC[j];
				}
			}
			magAmS[i] = sumPostionsM.sum()/sumWeightsM.sum();
			bpmAmS[i] = sumPositionsB.sum()/sumWeightsB.sum();
		}
	}
//	return drawLoudness;
//}





