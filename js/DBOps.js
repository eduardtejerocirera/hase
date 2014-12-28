var DBOps = {
  request: function(method, query){
      url = "http://api.hipermedia.local/query";
      var xhr = new XMLHttpRequest();
      xhr.open(method,url,false);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send(query);
      var response = xhr.responseText;
      //console.log(xhr.status);
      var json_response = xhr.responseText;
      json = JSON.parse(json_response);
      //console.log(json);
      return json;
  },
  updateReproduced: function(item){
    method = "PUT";
    query = "SELECT reproduced FROM track where spotify_track_id = '"+item.spotify_track_id + "'";

        if (!this.existsInDB(query)){
          query = "INSERT INTO track (spotify_track_id, album, artist, name, reproduced, spotify_artist_id, spotify_album_id) VALUES ('"
            + item.spotify_track_id + "','" + item.album + "','" + item.artist + "','" + item.name + "',1,'" + item.spotify_artist_id + "','" +
            item.spotify_album_id +"')";
          console.log(query);
           j = this.request(method, query);
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
    query = "SELECT MAX(reproduced), spotify_artist_id FROM track";
    j = this.request(method,query);
    artist_id = j.response[0].spotify_artist_id;
    items = [];
    items = APImanager.getRelatedArtists(artist_id);
    //console.log(items);
    return items;
  },

  createPlaylist: function(name){
    method = "PUT";
    query = "SELECT name FROM playlist WHERE name = '" + name + "'";
    if (!this.existsInDB(query)){
      query = "INSERT INTO playlist (name) VALUES ('" + name +"')";
      j = this.request(method,query); 
      //console.log(j);
    }
    else{
      //console.log("Already exists!!");
    }
  },

  addTrackToPlaylist: function(item, playlist){
    //console.log(item);
    query = "SELECT track.track_id, playlist.playlist_id FROM track, playlist " + 
    "WHERE track.spotify_track_id = '" + item.spotify_track_id + "' AND playlist.name = '" + playlist + "'";
    this.updateReproduced(item);
    this.createPlaylist(playlist);
    j = this.request("PUT", query);
    //console.log('hola');
    //console.log(j);
    //j.response
    
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
    console.log(j);  
  }

};