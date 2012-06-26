var lyricA;
var position;
var lyricLines = [];
var lyricTiming = [];
var offset; 			//how much of a buffer to give 
var CL; 				//current line - line of lyrics currently being displayed
var CK; 				//currently key

var savelog;
var lineFinished = false;

function makeLyrics() {	
	if (lyrics) {
		if (lyrics.response.lyric.line){
			lyricA = lyrics.response.lyric.line;
			//alert("changed!");
			lyricTiming = [];
			lyricLines =[];
			CK = 0;
			CL = 0;
			CPM = 100;
			offset = 0;
			for (var i = 0; i < lyricA.length; i++) {
				lyricTiming.push(getTiming(lyricA[i]["@timing"]));		
				lyricLines.push(lyricA[i].value);
				lyricLines[i] = lyricLines[i][0].toUpperCase() + lyricLines[i].slice(1).toLowerCase();
			}
			lyricTiming.push(sp.trackPlayer.getNowPlayingTrack().length);
			PI.textFont(PI.loadFont("Meta-Bold.ttf"), 24);
			PI.fill(1);
			//PI.textMode("SCREEN");
			lyricsReady = true;
			lineFinished = false;

		}
		else {
			info("no lyrics for this song avabilble");
		}
	}
	
	else {	
		info("still waiting on lyrics");
	}
}

function getTiming(a){var c=function(c){for(var b="",a=c.length-1;a>=0;a--)b+=c.charAt(a);return b};if(a=="")return"0";var b;a=c(a);b=parseInt(a.substring(a.length-1,a.length));a=a.substring(0,a.length-1);a=a.substring(0,b)+c(a.substring(b+b,a.length));a=parseInt(a)/b+"";if(a=="NaN")a="0";return a}

function compareToNext(key) {
	if (!lineFinished && key == lyricLines[CL][CK]) {
		//alert("match! the " + CK);
		if (CK == lyricLines[CL].length || !lyricLines[CL][CK+1]) {
			CPM = findCPM();
			CK = lyricLines[CL].length;
			lineFinished = true;
		}
		else {
			CK++;
		}
	}
}

function findCPM() {
	position = sp.trackPlayer.getNowPlayingTrack().position;
	return (CK/(position - lyricTiming[CL]));
}

function findNewOffset(nextCL) {
	if (!lineFinished) {
		CPM = Math.max(findCPM(),.003);
	}	
	if (nextCL <lyricTiming.length+1) {
		CL = nextCL;
	}
	var i = 0;
	while (i + CL < lyricLines.length -1 && lyricLines[CL].length/(lyricTiming[CL + i + 1] - lyricTiming[CL] ) > CPM ) {
		i++;
	}
	offset = i;
	
	CK = 0;
	lineFinished = false;
}

function displayLyrics() {
	PI.background(255);
	PI.fill(1);
	position = sp.trackPlayer.getNowPlayingTrack().position;
	info('trying to show lyrics');
	scroll = position/1000;
	if (lyricsReady) {
		var temp;
		for (var i = 0; lyricTiming[i] < position; i++)
		{
			temp = i;
		}
		if (!(CL <= temp && temp <= CL + offset)) {
			findNewOffset(temp);
		}
		var scale = (position-lyricTiming[CL])/(lyricTiming[CL+1+offset] - lyricTiming[CL]);
		PI.fill(255,10,10);
		PI.text(lyricLines[CL],50,500*scale,400,100) ;
		if (CK > 0)
		{
			PI.fill(10,255,10);
			PI.text(lyricLines[CL].slice(0,CK),50,500*scale,400,100) ;
		}
		PI.fill(1,1,1);
		PI.text(CPM*3600*6,500,100);
		info(scale);
		
	}
	else {
		makeLyrics();
	}
}

function oldFineNewOffset() {
	
	savelog = lyricLines;
	if (lyricLines && lyricLines[CL].length == CK) {
		if (offset > 0) {
			offset--;
		}
	}
	else {
		offset++;
	}	
	if (temp && temp <lyricTiming.length+1) {
		CL = temp;
	}
	CK = 0;
	offset = Math.min(offset,lyricLines.length-CL); 		//near the end of the song, don't jump ahead too far
	
}

