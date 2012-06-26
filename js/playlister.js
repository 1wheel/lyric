function makePlaylistFromNowPlaying() {
	var track = models.player.track;
	if (track == null) {
		info("Start playing something and I'll make a playlist of good songs based on that song");
		} else {
		fetchPlaylist(models.player.track.artists[0], 25);
	}
}

function createPlayButton(song) {
	var span = $("<span>");
	var button = $("<img src='play.png'>");
	var song_name = ' ' + song.title + " by " + song.artist_name;
	
	button.click(function() {
		var uri = getSpotifyID(song);
		models.player.play(uri);
	});
	span.append(button);
	span.append(song_name);
	return span;
}

function getSpotifyID(song) {
	var uri = song.tracks[0].foreign_id;
	return uri.replace('spotify-WW', 'spotify');
}

function fetchPlaylist(artist, size) {
	info('Getting playlist for ' + artist.name);
	var artist_id = artist.uri.replace('spotify', 'spotify-WW');
	var url = 'http://developer.echonest.com/api/v4/playlist/basic?api_key=N6E4NIOVYMTHNDM8J&callback=?';
	
	$.getJSON(url, { 'artist_id': artist_id, 'format':'jsonp', limit: true,
		'results': size, 'type':'artist-radio', bucket : ['id:spotify-WW', 'tracks']}, function(data) {
		if (checkResponse(data)) {
			info("");
			document.getElementById('reset-able').innerHTML = "<h2 id='playlist-name'> Playlist Name</h2><div id='all-results'><ul id=\"results\"> </ul></div>";
			$('#playlist-name').text('Playlist seed: ' + artist.name);
			$("#results").empty();
			var curTracks = []
			for (var i = 0; i < data.response.songs.length; i++) {
				var li = $("<li>");
				li.append(createPlayButton(data.response.songs[i]));
				$("#results").append(li);
			}
			li.append("<p><button id='save-button'> Save playlist</button>");
			
			$("#save-button").unbind();
			$("#save-button").click( function() {
				savePlaylist(artist.name + ' playlist', data.response.songs);
			});
			} else {
			info("trouble getting results");
		}
	});
}

function savePlaylist(title, songs) {
	var thePlaylist = new models.Playlist(title);
	for (var i = 0; i < songs.length; i++) {
		thePlaylist.add(getSpotifyID(songs[i]));
	}
}


function info(s) {
	$("#info").text(s);
}

function error(s) {
	info(s);
}

function checkResponse(data) {
	if (data.response) {
		if (data.response.status.code != 0) {
			error("Whoops... Unexpected error from server. " + data.response.status.message);
			console.log(JSON.stringify(data.response));
			} else {
			return true;
		}
		} else {
		error("Unexpected response from server");
	}
	return false;
}

//$(document).ready(function() {
//	makePlaylistFromNowPlaying();
//});
