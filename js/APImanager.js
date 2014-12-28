var APImanager = {
  
  request: function(method, url){
      var xhr = new XMLHttpRequest();
      xhr.open(method,url,false);
      xhr.send();
      //console.log(xhr.status);
      var json_response = xhr.responseText;
      json = JSON.parse(json_response);
      //console.log(json);
      return json
  },

  s_search: function(text,type,offset,limit){
      if(type === "artist" || type === "album" || type === "track"){
        url = "https://api.spotify.com/v1/search?query="+text+"&offset="+offset+"&limit="+limit+"&type="+type;
        method = "GET";
        j = this.request(method,url);
      }
      else{
        //console.log("Invalid search!!");
      }
      return j;
  },


  it: function(type){
    var it = null;

    if (type === 'track'){
      it = j.tracks;
    }
    if (type === 'artist'){
      it = j.artists;
    }
    if(type === 'album'){
      it = j.albums;
    }

    //console.log(it);
    
    return it;
  },

  s_getData: function(j, type){

    it = this.it(type);
    items = [];

    //console.log(j);
    for (i = 0; i < it.items.length; i++){
        t = item();
        t.type = type;
        t.name = it.items[i].name;
        
        
        if (type === 'track'){
          t.album = it.items[i].album.name;
          t.artist = it.items[i].artists[0].name;
          

          //Si no trobem imatge al JSON (length = 0), posem imatge per defecte
          if (it.items[i].album.images.length === 0){
            t.img_url = "./images/default.png";
          }
          else{
            t.img_url = it.items[i].album.images[0].url;
          }
          
          t.spotify_track_id = it.items[i].id;
          t.spotify_album_id = it.items[i].album.id;
          t.spotify_artist_id = it.items[i].artists[0].id;
        }

        if (type === 'album'){
          if (it.items[i].images.length === 0){
            t.img_url = "./images/default.png";
          }
          else{
            t.img_url = it.items[i].images[0].url;
          }
          t.spotify_album_id = it.items[i].id;
          this.getArtistFromAlbum(t.spotify_album_id, t);
        }

        if (type === 'artist'){
          if (it.items[i].images.length === 0){
            t.img_url = "./images/default.png";
          }
          else{
            t.img_url = it.items[i].images[0].url;
          }
          t.spotify_artist_id = it.items[i].id;
        }
        
        items[i] = t;
    }
    return items;
  },

  getArtistFromAlbum: function(id, item){
    url = "https://api.spotify.com/v1/albums/" + id;
    method = "GET";
    j = this.request(method, url);
    //console.log('hola');
    //console.log(j);
    item.artist = j.artists[0].name;
    item.spotify_artist_id = j.artists[0].id;
  },

  getAlbumsFromArtist: function(id,artName){
    url = "https://api.spotify.com/v1/artists/" + id + "/albums";
    method = "GET";
    j = this.request(method, url);
    //console.log(j);
    albums = [];
    for (i = 0; i < j.items.length; i++){
      a = item();
      a.artist = artName;
      a.spotify_album_id = j.items[i].id;
      a.name = j.items[i].name;
      a.type = "album";
      a.img_url = j.items[i].images[0].url;
      a.spotify_artist_id = id;
      albums[i] = a;
    }
    //console.log(albums);
    return albums;
  },

  getTracksFromAlbum : function(album){
    url = "https://api.spotify.com/v1/albums/" + album.spotify_album_id + "/tracks";
    method = "GET";
    j = this.request(method,url);
    //console.log(j);
    tracks = [];
    for (i = 0; i < j.items.length; i++){
        t = item();
        t.name = j.items[i].name;
        t.spotify_track_id = j.items[i].id;
        t.spotify_album_id = album.spotify_album_id;
        t.spotify_artist_id = j.items[i].artists[0].id;
        t.artist = j.items[i].artists[0].name;
        t.album = album.name;
        t.img_url = album.img_url;
        t.type = "track";
        tracks[i] = t;
    }
    //console.log(tracks);
    return tracks;

  },

  getRelatedArtists: function(id){
    method = "GET";
    url = "https://api.spotify.com/v1/artists/"+id+"/related-artists";
    j = this.request(method,url);
    //console.log(j);
    items = [];

    for (i = 0; i < j.artists.length; i++){
       a = item();
       a.name = j.artists[i].name;
       a.img_url = j.artists[i].images[0].url;
       a.type = "artist";
       a.spotify_id = j.artists[i].id;
       items[i] = a;
    }
    return items;
  },

  getMostPopular: function(){
    url = "http://ws.spotify.com/search/1/album.json?q=year:0-3000";
    method = "GET";
    jBig = this.request(method, url);
    console.log(jBig);
    albums = [];
    for (i = 0; i < 100; i++){
      length = jBig.albums[i].href.length;
      id = jBig.albums[i].href.substring(14,length);
      a = item();
      a = this.getAlbumFromId(id);
      albums[i] = a;
    }
    //console.log(albums);
    return albums;
  },

  getAlbumFromId: function (id){
    url = "https://api.spotify.com/v1/albums/"+id;
    method = "GET";
    j = this.request(method, url);
    //console.log(j);

    a = item();
    a.name = j.name;
    a.spotify_album_id = j.id;
    a.artist = j.artists[0].name;
    a.spotify_artist_id = j.artists[0].id;
    a.img_url = j.images[0].url;
    a.type = "album";
    //console.log("return");
    return a;
  },

  y_request: function(method, url){
      var xhr = new XMLHttpRequest();
      xhr.open(method,url,false);
      xhr.send();
      //console.log(xhr.status);
      var xml_response = xhr.responseText;
      

      x2js = new X2JS();
      var jsonObj = x2js.xml_str2json(xml_response);

      return jsonObj;
     
      //json = JSON.parse(json_response);
      //return json
  },

  noSpaces: function(str){
    str = str.replace(/\s+/g, '+');
    return str;
  },

  y_getVideo: function(artist, name){
      artist = this.noSpaces(artist);
      //console.log(artist);
      name = this.noSpaces(name);
      //console.log(name);

      method = "GET";
      url = "http://gdata.youtube.com/feeds/api/videos?q="+artist+ "+" +name+ "&max-results=10&v=2";
      j = this.y_request(method,url);
      //console.log(j);
      video = j.feed.entry[0].content._src;
      return video;
  }
};