function createSongLyrics(passedLyrics){
	this.lyrics = passedLyrics;
	
	//if tunewiki data has timings, modifys data structure and formating
	
	if (this.lyrics.response.lyric.line){
		this.lyricA = this.lyrics.response.lyric.line;
		//alert("changed!");
		this.lyricTiming = [];
		this.lyricLines =[];
		this.CK = 0;					//currently key
		this.CL = 0;					//current line - line of lyrics currently being displayed
		this.CPM = .06;					//Chars per milisecound
		this.offset = 0;				//how much of a buffer to give 
		this.lineSpeed = [];			//array of WPM rate at each typed line
		this.lineSpeed[0] = 0;			//score starts at 0
		this.linesTyped = 0;			//number of lines typed so far	
		this.lineFinished = false;		//if the currently displayed line has been completely typed
		
		for (var i = 0; i < this.lyricA.length; i++) {
			this.lyricTiming.push(getTiming(this.lyricA[i]["@timing"]));		
			this.lyricLines.push(this.lyricA[i].value);
			this.lyricLines[i] = this.lyricLines[i][0].toUpperCase() 
			+ this.lyricLines[i].slice(1).toLowerCase();
		}
		this.lyricTiming.push(sp.trackPlayer.getNowPlayingTrack().length);
		PI.textFont(PI.loadFont("Meta-Bold.ttf"), 24);
		PI.fill(1);
		//PI.textMode("SCREEN");
		this.lyricsReady = true;
		this.lineFinished = false;
	}
	else {
		info("no lyrics for this song avabilble");
	}
		
	//called when a key is pressed
	this.compareToNext = function(key){
		if (!this.lineFinished && key == this.lyricLines[this.CL][this.CK]) {
			if (this.CK == this.lyricLines[this.CL].length || !this.lyricLines[this.CL][this.CK+1]) {
				this.CPM = this.findCPM();
				this.CK = this.lyricLines[this.CL].length;
				this.lineFinished = true;
			}
			else {
				this.CK++;
			}
		}
	}
	
	//finds typing speed
	 this.findCPM = function() {
		position = sp.trackPlayer.getNowPlayingTrack().position;
		this.linesTyped++;
		this.lineSpeed[this.linesTyped] = Math.min(this.CPM*3600*5.5,200);
		return (this.CK/(position - this.lyricTiming[this.CL]));
	}
	
	//called when a line time ends. finds how many lines need to be skipped to match typing speed
	this.findNewOffset = function (nextCL) {
		if (!this.lineFinished) {
			this.CPM = Math.max(this.findCPM(),.003);
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
	
	this.displayLyrics = function() {
		PI.background(255);
		PI.fill(1);
		position = sp.trackPlayer.getNowPlayingTrack().position;
		var scroll = position/1000;
		
		var temp;
		for (var i = 0; this.lyricTiming[i] < position; i++)
		{
			temp = i;
		}
		if (!(this.CL <= temp && temp <= this.CL + this.offset)) {
			this.findNewOffset(temp);
		}
		
		var scale = (position-this.lyricTiming[this.CL])/(this.lyricTiming[this.CL+1+this.offset] - this.lyricTiming[this.CL]);
		PI.fill(255,10,10);
		PI.text(this.lyricLines[this.CL],.05*Xmax,.8*Ymax*scale + .1*Ymax,.8*Xmax,100) ;
		if (this.CK > 0)
		{
			PI.fill(10,255,10);
			PI.text(this.lyricLines[this.CL].slice(0,this.CK),.05*Xmax,.8*Ymax*scale + .1*Ymax,.8*Xmax,100) ;
		}
		PI.fill(1,1,1);
		PI.text("WPM " + Math.round(this.CPM*3600*5.5),.05*Xmax,.05*Ymax);
		PI.text("Score " + Math.round(this.lineSpeed.sum()),.65*Xmax,.05*Ymax)
		info(this.linesTyped);		
	}
	
	//decrypts tunewiki timing values
	function getTiming(a){var c=function(c){for(var b="",a=c.length-1;a>=0;a--)b+=c.charAt(a);return b};if(a=="")return"0";var b;a=c(a);b=parseInt(a.substring(a.length-1,a.length));a=a.substring(0,a.length-1);a=a.substring(0,b)+c(a.substring(b+b,a.length));a=parseInt(a)/b+"";if(a=="NaN")a="0";return a}
	
}