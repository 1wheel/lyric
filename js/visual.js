jQuery.ajaxSettings.traditional = true;  

var sp = getSpotifyApi(1);
var models = sp.require("sp://import/scripts/api/models");
var player = models.player;

var cur_analysis;
var getCurrentSeg;
var drawLoudness;
var currentSeg;
var context = "";
var lyrics;
var lastTrack;

var Xmax = 600;
var Ymax = 600;
var MousePressed = false;

var PI;  //proccessing instance

var lyricsReady = false;

var zzz;
function init() {
	info("trouble getting results");		
	fetchLyrics(player.track.data);
	zzz= player.track.data;
	updateFrame();
}

function updateFrame() {
	if (PI){
		displayLyrics();
	}
	else {
		PI = Processing.getInstanceById('sketch');
	}
	setTimeout("updateFrame()",20);
}

$(window).bind('keypress', function(e) {
	saveKey = e;
    var code = (e.keyCode ? e.keyCode : e.which);
	document.getElementById('hi').innerHTML = String.fromCharCode(e.charCode);
	compareToNext(String.fromCharCode(e.charCode));
});

player.observe(models.EVENT.CHANGE, function (event) {
	if (event.data.curtrack == true) {
		fetchLyrics(player.track.data);
		lyricsReady = false;
		//alert("song change");
	}
}); 


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