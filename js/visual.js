//jQuery.ajaxSettings.traditional = true;  

//spotify API objects
//var sp = getSpotifyApi(1);
//var models = sp.require("sp://import/scripts/api/models");
//var player = models.player;

// var lyrics;							//JSON data from tunewiki
// var CurrentLyrics = null;			//object created for each song. contains lyric info and method to write to screen during updateFrame
// var lyricsReady = false;			//

// var xMax = window.innerWidth*.9;		//size of 
// var yMax = window.innerHeight*.75;
// var xOffSet = .08*xMax;				//space alone sides of xOffset not written over
// var canvas = document.getElementById("canvas");
// canvas.width = xMax;
// canvas.height = yMax;
// var CC = canvas.getContext("2d"); 

// var MousePressed = false;

// function init() {
// 	//fetchLyrics(player.track.data);
// 	setInterval("updateFrame()",50);
// }	
//quary tunewiki
// function fetchLyrics(track) {
// 	info('Getting lyrics for ' + track.title + ' by ' + track.artist);
// 	var url ='http://api.tunewiki.com/smp/v2/getLyric?device=900&spotifytok=3a09d705db235ba7b8b708876132ce3b';
//     $.getJSON(url, {
//         'json':'true',
//         'artist':track.artists[0].name.decodeForText(),
//         'album':track.album.name.decodeForText(),
// 		'title':track.name.decodeForText()}, 
//         function (ldata) {
//             info("Got the lyrics");
//             lyrics = ldata;
//     });
// }
var startTime = new Date().getTime();
var oldTime = new Date().getTime();
console.log("started");

function updateFrame() {
	var delta;
	var newTime;
	var oldTimeLoop = new Date().getTime();
	var runTime = new Date().getTime();
	for (var i = 0; oldTimeLoop < runTime + 100; i++)
	{
		newTimeLoop = new Date().getTime();
		delta = newTime - oldTimeLoop;
		if (delta>500 ) {
			console.log("loop lag of " + delta + " milliseconds@ " + 
				Math.round((newTime-startTime)/1000) + " seconds");
		}				
		oldTimeLoop = newTime;
	}

	delta = newTime - oldTime;
    	if (delta>500 ) {
			console.log("setTimeout lag of " + delta + " milliseconds@ " + 
				Math.round((newTime-startTime)/1000) + " seconds");
	    }
	    oldTime = newTime;

	setTimeout("updateFrame()",100);
}

updateFrame();




	/*if (CurrentLyrics) {	
		if (CurrentLyrics.lyricsReady) {
			CurrentLyrics.displayLyrics();
		}
		if (CurrentLyrics.songID != player.track.uri) {
			trackChanged();
		}
	}
	else {	
		if (lyrics) {
			savelyrics = lyrics;
			CurrentLyrics = new createSongLyrics(lyrics);
		}
		else {
			info("waiting on tunewiki");
		}
	}
}*/



// //event listener for keypress. sends them to CurrentLyrics if it exists
// $(window).bind('keypress', function(e) {
// 	saveKey = e;
//     var code = (e.keyCode ? e.keyCode : e.which);
// 	if(CurrentLyrics && CurrentLyrics.lyricsReady){
// 		CurrentLyrics.compareToNext(String.fromCharCode(e.charCode));
// 	}
// });

// //called when track changes
// function trackChanged() {
// 	if (CurrentLyrics && CurrentLyrics.validScore && CurrentLyrics.lineSpeed) {
// 		var score = Math.round(CurrentLyrics.lineSpeed.sum());
// 		var scoreText;
// 		if (CurrentLyrics.highScore < score ) {
// 			scoreText = "High Score of " + score + " beacts the previous High Score  of " + 
// 			CurrentLyrics.highScore + " on " + CurrentLyrics.songName +"!";
// 			localStorage.setItem(CurrentLyrics.songID, score);
// 		}
// 		else {
// 			scoreText = "Score of " + score + " fails to beat the current High Score of " + 
// 			CurrentLyrics.highScore + " on " + CurrentLyrics.songName +".";
// 		}				
// 		document.getElementById("highScore").innerHTML = scoreText.decodeForHTML();

// 	}		
// 	lyrics = null;
// 	CurrentLyrics = null;
// 	fetchLyrics(player.track.data);
// }


// Array.max = function( array ){
//     return Math.max.apply( Math, array );
// };
// Array.min = function( array ){
//     return Math.min.apply( Math, array );
// };
// Array.prototype.sum = function(){
// 	for(var i=0,sum=0;i<this.length;sum+=this[i++]);
// 	return sum;
// }
// Array.prototype.setAll = function(v) {
//     var i, n = this.length;
//     for (i = 0; i < n; ++i) {
//         this[i] = v;
// 	}
// };

// function info(s) {
// 	$("#info").text(s);
// }

//init();