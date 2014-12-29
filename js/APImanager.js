var APImanager = {
  
  request: function(method, url){
      var xhr = new XMLHttpRequest();
      xhr.open(method,url,false);
      xhr.send();
      //console.log(xhr.status);
      var json_response = xhr.responseText;
      json = JSON.parse(json_response);
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


  it: function(type,j){
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
    
    return it;
  },

  s_getData: function(j, type){

    it = this.it(type,j);
    items = [];
    console.log(j);

    for (i = 0; i < it.items.length; i++){
        //t = item();
        t=[];
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
    item.artist = j.artists[0].name;
    item.spotify_artist_id = j.artists[0].id;
  },

  getAlbumsFromArtist: function(id,artName){
    url = "https://api.spotify.com/v1/artists/" + id + "/albums";
    method = "GET";
    j = this.request(method, url);
    console.log("ID en API manager: " + id);
    albums = [];
    for (i = 0; i < j.items.length; i++){
      //a = item();
      a=[];
      a.artist = artName;
      a.spotify_album_id = j.items[i].id;
      a.name = j.items[i].name;
      a.type = "album";
      if(j.items[i].images.length != 0){
        a.img_url = j.items[i].images[0].url;
      }
      else{
        a.img_url = "./images/default.png";
      }
      a.spotify_artist_id = id;
      albums[i] = a;
    }
    return albums;
  },

  getTracksFromAlbum : function(album){
    url = "https://api.spotify.com/v1/albums/" + album.spotify_album_id + "/tracks";
    method = "GET";
    j = this.request(method,url);
    tracks = [];
    for (i = 0; i < j.items.length; i++){
        //t = item();
        t=[];
        t.name = j.items[i].name;
        t.spotify_track_id = j.items[i].id;
        t.spotify_album_id = album.spotify_album_id;
        t.spotify_artist_id = j.items[i].artists[0].id;
        t.artist = j.items[i].artists[0].name;
        t.album = album.name;
        t.img_url = album.img_url;
        if(t.img_url == ""){
          t.img_url = "./images/default.png";
        }
        t.type = "track";
        tracks[i] = t;
    }
    return tracks;

  },

  getRelatedArtists: function(id){
    console.log("artist_id: "+id);
    url = "https://api.spotify.com/v1/artists/"+id+"/related-artists";
    j = this.request("GET",url);
    items = [];

    for (i = 0; i < j.artists.length; i++){
      a = [];
       //var a = item();
       a.name = j.artists[i].name;
       if(j.artists[i].images.length != 0){
          a.img_url = j.artists[i].images[0].url;
        }
        else{
          a.img_url = "./images/default.png";
        }
       a.type = "artist";
       a.spotify_artist_id = j.artists[i].id;
       items[i] = a;
    }
    return items;
  },

  getMostPopular: function(){
    url = "http://ws.spotify.com/search/1/album.json?q=year:0-3000";
    method = "GET";
    jBig = this.request(method, url);
    albums = [];
    for (i = 0; i < 100; i++){
      length = jBig.albums[i].href.length;
      id = jBig.albums[i].href.substring(14,length);
      //a = item();
      a=[];
      a = this.getAlbumFromId(id);
      albums[i] = a;
    }
    return albums;
  },

  getAlbumFromId: function (id){
    url = "https://api.spotify.com/v1/albums/"+id;
    method = "GET";
    j = this.request(method, url);

    //a = item();
    a=[];
    a.name = j.name;
    a.spotify_album_id = j.id;
    a.artist = j.artists[0].name;
    a.spotify_artist_id = j.artists[0].id;
    if (j.artists[0].images != 0){
      a.img_url = j.images[0].url;
    }
    else{
      a.img_url = "./images/default.png";
    }
    a.type = "album";
    return a;
  },

  y_request: function(method, url){
      var xhr = new XMLHttpRequest();
      xhr.open(method,url,false);
      xhr.send();
      var xml_response = xhr.responseText;
      

      x2js = new X2JS();
      var jsonObj = x2js.xml_str2json(xml_response);

      return jsonObj;
  },

  noSpaces: function(str){
    str = str.replace(/\s+/g, '+');
    return str;
  },

  y_getVideo: function(artist, name){
      artist = this.noSpaces(artist);
      name = this.noSpaces(name);

      method = "GET";
      url = "http://gdata.youtube.com/feeds/api/videos?q="+artist+ "+" +name+ "+live&max-results=10&v=2";
      j = this.y_request(method,url);
      video = j.feed.entry[0].content._src;
      return video;
  }
};