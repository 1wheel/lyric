jQuery.ajaxSettings.traditional = true;  

//spotify API objects
var sp = getSpotifyApi(1);
var models = sp.require("sp://import/scripts/api/models");
var player = models.player;

var lyrics;							//JSON data from tunewiki
var CurrentLyrics;					//object created for each song. contains lyric info and method to write to screen during updateFrame
var resetCurrentLyrics = false;		//event listener sets to false when track changes. if true, updateFrame will create a new CurrentLyrics object
var lyricsReady = false;			//

var canvas;
var CC;								//canvas context
var xMax = window.innerWidth;		//size of 
var yMax = window.innerHeight*.75;
var xOffSet = .08*xMax;				//space alone sides of xOffset not written over

var MousePressed = false;

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
	if (CC) {
		if (CurrentLyrics) {	
			if (CurrentLyrics.lyricsReady) {
				CurrentLyrics.displayLyrics();
			}
		}
		else {
			if (lyrics) {
				savelyrics = lyrics;
				CurrentLyrics = new createSongLyrics(lyrics);
			}
		}
	}
	else {
		canvas = document.getElementById("canvas");
		canvas.width = xMax;
		canvas.height = yMax;
		CC = canvas.getContext("2d"); 
	}
	
	setTimeout("updateFrame()",50);
}

//event listener for keypress. sends them to CurrentLyrics if it exists
$(window).bind('keypress', function(e) {
	saveKey = e;
    var code = (e.keyCode ? e.keyCode : e.which);
	if(CurrentLyrics && CurrentLyrics.lyricsReady){
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