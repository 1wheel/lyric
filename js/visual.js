jQuery.ajaxSettings.traditional = true;  

var sp = getSpotifyApi(1);
var models = sp.require("sp://import/scripts/api/models");
var player = models.player;
var CurrentLyrics;

var cur_analysis;
var getCurrentSeg;
var drawLoudness;
var currentSeg;
var context = "";
var lyrics;
var lastTrack;
var resetCurrentLyrics = false;

var Xmax = window.innerWidth*.8;
var Ymax = window.innerHeight*.8;
var MousePressed = false;

var PI;  //proccessing instance

var lyricsReady = false;

function init() {
	info("trouble getting results");		
	fetchLyrics(player.track.data);
	updateFrame();
}	

function updateFrame() {
	if (resetCurrentLyrics) {
		CurrentLyrics = null;
		resetCurrentLyrics = false;
	}
	if (PI) {
		if (CurrentLyrics) {	
			CurrentLyrics.displayLyrics();
			document.getElementById('xcord').innerHTML = player.position;

		}
		else {
			if (lyrics) {
				savelyrics = lyrics;
				CurrentLyrics = new createSongLyrics(lyrics);
			}
		}
	}
		
	else {
		PI = Processing.getInstanceById('sketch');
	}
	
	setTimeout("updateFrame()",20);
}

//event listener for keypress. sends them to CurrentLyrics if it exists
$(window).bind('keypress', function(e) {
	saveKey = e;
    var code = (e.keyCode ? e.keyCode : e.which);
	document.getElementById('hi').innerHTML = String.fromCharCode(e.charCode);
	if(CurrentLyrics){
		CurrentLyrics.compareToNext(String.fromCharCode(e.charCode));
	}
});

player.observe(models.EVENT.CHANGE, function (event) {
	if (event.data.curtrack == true) {
		lyrics = null;
		resetCurrentLyrics = true;
		fetchLyrics(player.track.data);
		if (CurrentLyrics && CurrentLyrics.validScore) {
			info("saved score");
			localStorage.setItem(CurrentLyrics.songID, Math.round(CurrentLyrics.lineSpeed.sum()));
		}
}});


Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};
Array.prototype.sum = function(){
	for(var i=0,sum=0;i<this.length;sum+=this[i++]);
	return sum;
}
Array.prototype.setAll = function(v) {
    var i, n = this.length;
    for (i = 0; i < n; ++i) {
        this[i] = v;
	}
};

init();