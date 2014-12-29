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
      return json;
  },
  updateReproduced: function(item){
    method = "PUT";
    query = "SELECT reproduced FROM track where spotify_track_id = '"+item.spotify_track_id + "'";

        if (!this.existsInDB(query)){
          query = "INSERT INTO track (spotify_track_id, album, artist, name, reproduced, spotify_artist_id, spotify_album_id) VALUES ('"
            + item.spotify_track_id + "','" + item.album + "','" + item.artist + "','" + item.name + "',1,'" + item.spotify_artist_id + "','" +
            item.spotify_album_id +"')";
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
    query = "SELECT SUM(reproduced), spotify_artist_id FROM track GROUP BY spotify_artist_id ORDER BY SUM(reproduced) DESC";
    
    items = null;
    if(this.existsInDB){
      j = this.request(method,query);
      artist_id = j.response[0].spotify_artist_id;
      items = APImanager.getRelatedArtists(artist_id);
    }
    return items;
  },

  createPlaylist: function(name){
    method = "PUT";
    query = "SELECT name FROM playlist WHERE name = '" + name + "'";
    if (!this.existsInDB(query)){
      query = "INSERT INTO playlist (name) VALUES ('" + name +"')";
      j = this.request(method,query); 
    }
    else{
      console.log("Already exists!!");
    }
  },

  addTrackToPlaylist: function(item, playlist){
    query1 = "SELECT track.track_id FROM track WHERE track.spotify_track_id = '" + item.spotify_track_id + "'";
    query2 = "SELECT playlist.playlist_id FROM playlist WHERE playlist.name = '" + playlist + "'";
    this.updateReproduced(item);
    this.createPlaylist(playlist);
    j1 = this.request("PUT", query1);
    j2 = this.request("PUT", query2);
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
  }

};