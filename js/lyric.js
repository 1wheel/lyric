function createSongLyrics(passedLyrics){
	this.lyrics = passedLyrics;								//object returned from tunewiki
	this.songID = player.track.uri;							//saves spotify URI to look up and save high score
	this.validScore = true;									//set to false if song is rewond
	this.HighScore = localStorage.getItem(this.songID);		//loads local high score
	if (!this.HighScore) {
		this.HighScore = 0;
	}
	this.lyricsReady = false;								//song loaded correctly and can be displayed
	this.clear = Object;
	this.clear.yCord = .1*yMax;
	this.clear.height = 0;

	//if tunewiki data has timings, modifys data structure and formating
	if (this.lyrics.response.lyric.line){
		this.lyricA = this.lyrics.response.lyric.line;
		//alert("changed!");
		this.CK = 0;					//currently key
		this.CL = 0;					//current line - line of lyrics currently being displayed
		this.CPM = .06;					//Chars per milisecound
		this.offset = 0;				//how much of a buffer to give 
		this.lineSpeed = [];			//array of WPM rate at each typed line
		this.lineSpeed[0] = 0;			//score starts at 0
		this.linesTyped = 0;			//number of lines typed so far	
		this.lineFinished = false;		//if the currently displayed line has been completely typed
		CC.font = "30pt Calibri";

		this.lyricLines =[];			//song lyrics, by line
		this.lyricTiming = [];			//time when line is played
		for (var i = 0; i < this.lyricA.length; i++) {
			this.lyricTiming.push(getTiming(this.lyricA[i]["@timing"]));		
			this.lyricLines.push(this.lyricA[i].value);
			this.lyricLines[i] = this.lyricLines[i][0].toUpperCase() 
			+ this.lyricLines[i].slice(1).toLowerCase();
		}
		this.lyricTiming.push(sp.trackPlayer.getNowPlayingTrack().length);

		if (this.lyricTiming) {
			this.lyricsReady = true;	//program ready to display lyrics only if lyrics exist
		}
		else {
			info("no lyrics avalible for this song");
		}
	}
	else {
		info("no lyrics for this song avabilble");
	}

	//called when a key is pressed
	this.compareToNext = function(key){
		if (!this.lineFinished && key == this.lyricLines[this.CL][this.CK]) {
			if (this.CK == this.lyricLines[this.CL].length || !this.lyricLines[this.CL][this.CK+1]) {
				this.CPM = this.findCPM();
				this.drawScore();
				this.CK = this.lyricLines[this.CL].length;
				this.lineFinished = true;
			}
			else {
				this.CK++;
			}
		}
	}
	
	//finds typing speed. called when a line is completed, either by typing all the letter or time expiring
	 this.findCPM = function() {
		timePosition = sp.trackPlayer.getNowPlayingTrack().position;
		this.linesTyped++;
		this.lineSpeed[this.linesTyped] = Math.min(this.CPM*3600*5.5,200);
		return (this.CK/(timePosition - this.lyricTiming[this.CL]));
	}

	//called when a line time ends. finds how many lines need to be skipped to match typing speed
	this.findNewOffset = function (nextCL) {
		if (!this.lineFinished) {
			this.CPM = Math.max(this.findCPM(),.003);
			this.drawScore();
		}	
		if (nextCL <this.lyricTiming.length+1) {
			this.CL = nextCL;
		}
		var i = 0;
		while (i + this.CL < this.lyricLines.length -1 && this.lyricLines[this.CL].length/(this.lyricTiming[this.CL + i + 1] - this.lyricTiming[this.CL] ) > this.CPM ) {
			i++;
		}
		this.offset = i;
		this.CK = 0;
		this.lineFinished = false;
	}
	
	//clears board and draws scores on the top
	this.drawScore = function() {
		CC.clearRect(0, 0, xMax, yMax);

		CC.fillStyle = "black";
		var scoreString = "";
		
		scoreString += "High Score " + this.HighScore;
		scoreString += "    " + "Score " + Math.round(this.lineSpeed.sum());
		scoreString += "      "  +"WPM " + Math.round(this.CPM*3600*5.5);
		CC.fillText(scoreString,.05*xMax,.05*yMax);
	}


	// writes updated line positions and scores to it every 20 ms
	this.displayLyrics = function() {
		CC.clearRect(0, this.clear.yCord, xMax, this.clear.height);

		timePosition = sp.trackPlayer.getNowPlayingTrack().position;		
		//using current position, finds line currently being played
		var temp;
		for (var i = 0; this.lyricTiming[i] <= timePosition; i++)
		{
			temp = i;
		}
		if (!(this.CL <= temp && temp <= this.CL + this.offset)) {
			this.findNewOffset(temp);
		}
		
		//percentage of current line's length that has been completed 
		var scale = (timePosition-this.lyricTiming[this.CL])/(this.lyricTiming[this.CL+1+this.offset] - this.lyricTiming[this.CL]);

		var letter;
		var lineLength = .05*xMax;
		var lineNum = 1;
		for (var i = 0; i <this.lyricLines[this.CL].length; i++){
			CC.fillStyle = "green"
			if (i + 1 > this.CK){
				CC.fillStyle = "red";
			}
			letter = this.lyricLines[this.CL][i];
			CC.fillText(letter, lineLength, .8*yMax*scale + .05*yMax*lineNum + .07*yMax);

			//disable clearing for cool effect
			//CC.fillStyle = "black"
			//CC.fillText(letter, lineLength, .8*yMax*scale + .05*yMax*lineNum + .05*yMax + 3);

			lineLength += CC.measureText(letter).width;
			if (lineLength>.95*xMax){
				lineLength = .05*xMax;
				lineNum++;
			}
		}
		this.clear.yCord =  .8*yMax*scale + .05*yMax*0 + .07*yMax;
		this.clear.height = .05*yMax*(lineNum+1);

		info(this.linesTyped);		
	}
	
	this.correctLineWarp = function(displayText, CurrentLineText) {
		i = 0;
		displayText = displayText.split("");
		while (CurrentLineText[i] && CurrentLineText[i] != " ") {
			displayText[i] = ("/n");
			i = i + 1;
		}
		
		displayText = displayText.join("");
		displayText = "a" + "/n" + "s";
		ST = displayText;
		return displayText;
	}
	
	//decrypts tunewiki timing values
	function getTiming(a){var c=function(c){for(var b="",a=c.length-1;a>=0;a--)b+=c.charAt(a);return b};if(a=="")return"0";var b;a=c(a);b=parseInt(a.substring(a.length-1,a.length));a=a.substring(0,a.length-1);a=a.substring(0,b)+c(a.substring(b+b,a.length));a=parseInt(a)/b+"";if(a=="NaN")a="0";return a}
	
	//draws score first time song is loaded
		this.drawScore();

}