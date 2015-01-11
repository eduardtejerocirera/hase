var DBOps = {
  request: function(method, query){
      url = "http://api.hipermedia.local/query";
      var xhr = new XMLHttpRequest();
      xhr.open(method,url,false);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send(query);
      var response = xhr.responseText;
      var json_response = xhr.responseText;
      json = JSON.parse(json_response);
      return json;
  },
  updateReproduced: function(item){
    method = "PUT";
    var alb = this.noQuotes(item.album);
    var art = this.noQuotes(item.artist);
    var name = this.noQuotes(item.name);
    query = "SELECT reproduced FROM track where spotify_track_id = '"+item.spotify_track_id + "'";
        if (!this.existsInDB(query)){
          query = "INSERT INTO track (spotify_track_id, album, artist, name, reproduced, spotify_artist_id, spotify_album_id) VALUES ('"
            + item.spotify_track_id + "','" + alb + "','" + art + "','" + name + "',1,'" + item.spotify_artist_id + "','" +
            item.spotify_album_id +"')";
           j = this.request(method, query);
           console.log(j);
        }
        else{
          r = j.response[0].reproduced;
          rep = parseInt(r) + 1;
          query = "UPDATE track SET track.reproduced = "+rep+" WHERE track.spotify_track_id = '"+ item.spotify_track_id + "'";
          j = this.request(method,query);
        }
    },

  getRelatedArtists: function(){
    method = "PUT";
    query = "SELECT SUM(reproduced), spotify_artist_id FROM track GROUP BY spotify_artist_id ORDER BY SUM(reproduced) DESC";
    
    items = null;
    if(this.existsInDB(query)){
      j = this.request(method,query);
      artist_id = j.response[0].spotify_artist_id;
      items = APImanager.getRelatedArtists(artist_id);
    }
    return items;
  },

  createPlaylist: function(name, id){
    name = this.noQuotes(name);
    method = "PUT";
    query = "SELECT name FROM playlist WHERE name = '" + name + "'";
    if (!this.existsInDB(query)){
      query = "SELECT name FROM playlist";
      j = this.request(method,query);
      num = j.response.length;
      if (num < 6){
        query = "INSERT INTO playlist (name,playlist_id) VALUES ('" + name +"', " + id+ ")";
        j = this.request(method,query);
      }else{
        alert("only 5 playlists allowed!");
      }
    }
    else{
      alert("This playlist already exists!");
    }
  },

  addTrackToPlaylist: function(item, playlist){
    playlist = this.noQuotes(playlist);
    query1 = "SELECT track.track_id FROM track WHERE track.spotify_track_id = '" + item.spotify_track_id + "'";
    query2 = "SELECT playlist.playlist_id FROM playlist WHERE playlist.name = '" + playlist + "'";
    this.updateReproduced(item);
    //this.createPlaylist(playlist, DOMManager.playlist.length+1);
    j1 = this.request("PUT", query1);
    j2 = this.request("PUT", query2);
    console.log(j1);
    track_id = j1.response[0].track_id;
    playlist_id = j2.response[0].playlist_id;

    query3 = "INSERT INTO playlist_track (track_id, playlist_id) VALUES ('"+track_id+"','"+playlist_id+"')";
    j3 = this.request("PUT",query3);
    
  },

  existsInDB: function(query){
    method = "PUT";
    j = this.request(method,query);
    if (j.debug.affected_rows === 0){
      return false;
    }
    return true;
  },

  emptyDB: function(){
    this.truncateTable("track");
    this.truncateTable("playlist");
    this.truncateTable("playlist_track");
  },

  truncateTable: function(table){
    method = "PUT";
    query = "TRUNCATE TABLE hipermedia."+table;
    j = this.request(method,query);  
  },

  getPlaylists: function(){
    method = "PUT";
    query = "SELECT name from playlist";
    j = this.request(method,query);
    playlists = [];
    for (i = 0; i < j.response.length; i++){
      playlists[i] = j.response[i].name;
    }
    return playlists;
  },

  showPlaylistTracks: function(name){
    name = this.noQuotes(name);
    query = "SELECT playlist_id FROM playlist WHERE name = '"+name+"'";
    j = this.request("PUT",query);
    playlist_id = j.response[0].playlist_id;
    query = "SELECT track_id from playlist_track WHERE playlist_id = "+playlist_id;
    j = this.request("PUT",query);
    ids = j.response;
    songs = [];
    for (i = 0; i < ids.length; i++){
      query = "SELECT * FROM track WHERE track_id = "+ids[i].track_id;
      j = this.request("PUT", query);
      songs[i] = j.response[0];
    }
    return songs;
  },

  deletePlaylist: function(name){
    name = this.noQuotes(name);
    query = "SELECT playlist_id FROM playlist WHERE name= '"+name+"'";

    j = this.request("PUT",query);
    playlist_id = j.response[0].playlist_id;

    query = "DELETE FROM playlist_track WHERE playlist_id="+playlist_id;
    j = this.request("PUT",query);
    query = "DELETE FROM playlist WHERE playlist_id="+playlist_id;
    j = this.request("PUT", query);

  },

  noQuotes: function(str){
    str = str.replace(/'+/g,'');
    return str;
  }

};