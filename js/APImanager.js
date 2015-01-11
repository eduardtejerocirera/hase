
/**
*El objeto APImanager sirve para comunicarnos con las APIs Spotify y Youtube 
*(realizar peticiones y parsear la información recibida para poderla usar convenientemente)
*/

var APImanager = {
  
  /**
  * Realiza la comunicacion con la API Spotify usando AJAX.
  * La comunicación con el servidor es síncrona, ya que no nos interesa que la aplicación siga funcionando si el servidor no responde.
  * 
  * @param method método de petición (GET, PUT, POST,...)
  * @param url dirección de la API a la que se le hace la petición
  * @return respuesta de la petición en formato JSON
  * 
  */

  request: function(method, url){
      var xhr = new XMLHttpRequest();
      xhr.open(method,url,false);
      xhr.send();
      var json_response = xhr.responseText;
      json = JSON.parse(json_response);
      return json
  },

  
  /**
  * Realiza una búsqueda en la base de datos de Spotify.
  * 
  * @param text texto de búsqueda
  * @param type tipo de búsqueda (artist, album, track)
  * @return respuesta de la petición en formato JSON
  * 
  */
  s_search: function(text,type,offset,limit){
      if(type === "artist" || type === "album" || type === "track"){
        url = "https://api.spotify.com/v1/search?query="+text+"&offset="+offset+"&limit="+limit+"&type="+type;
        method = "GET";
        j = this.request(method,url);
      }
      return j;
  },

  
  /**
  * Devuelve una parte del JSON entrado para que pueda ser tratado posteriormente de manera igual
  * sin importar que la respuesta provenga de un artista, álbum o canción.
  * 
  * @param type tipo de ítem (artist, album, track)
  * @param j    JSON a tratar
  * @return     parte del JSON adaptada para ser tratada de forma más fácil.
  * 
  */
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


/**
  * Obtiene la información deseada del JSON entrado, ya sea relativo a track, album o artista.
  * La guarda en un array de items.
  * 
  * @param j    JSON a parsear.
  * @param type tipo de item (track, album o artist) a almacenar
  * @return     array de items con la información extraida del JSON.
  * 
  */
  s_getData: function(j, type){

    it = this.it(type,j);
    things = [];

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
        
        things[i] = t;
    }
    return things;
  },


/**
  * Obtiene un artista dado su album
  * 
  * @param id   id del album de Spotify.
  * @param item objeto en el que se guardará el artista
  * 
  */

  getArtistFromAlbum: function(id, item){
    url = "https://api.spotify.com/v1/albums/" + id;
    method = "GET";
    j = this.request(method, url);
    item.artist = j.artists[0].name;
    item.spotify_artist_id = j.artists[0].id;
  },


/**
  * Obtiene los álbumes de un artista.
  * 
  * @param id       id de Spotify del Artista.
  * @param artName  nombre del artista
  * @return         array de items con la información extraida del JSON.
  * 
  */
  getAlbumsFromArtist: function(id,artName){
    url = "https://api.spotify.com/v1/artists/" + id + "/albums";
    method = "GET";
    j = this.request(method, url);
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


/**
  * Obtiene las canciones de un álbum.
  * 
  * @param album    objeto con los datos del album
  * @return         array de items con la información extraida del JSON.
  * 
  */
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


/**
  * Obtiene los artistas relacionados dado un artista
  * 
  * @param id       id de Spotify del Artista.
  * @return         array de items con la información extraida del JSON.
  * 
  */
  getRelatedArtists: function(id){
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


/**
  * Obtiene los álbumes más populares de Spotify.
  * 
  * @return  array de items con la información extraida del JSON.
  * 
  */
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


/**
  * Obtine un álbum dado su ID
  * 
  * @param id       id de Spotify del álbum.
  * @return         array de items con la información extraida del JSON.
  * 
  */
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


/**
  * Realiza la comunicacion con la API Youtube v2 usando AJAX.
  * La comunicación con el servidor es síncrona, ya que no nos interesa que la aplicación siga funcionando si el servidor no responde.
  * 
  * @param method método de petición (GET, PUT, POST,...)
  * @param url dirección de la API a la que se le hace la petición
  * @return respuesta de la petición en formato JSON
  * 
  */

  y_request: function(method, url){
      var xhr = new XMLHttpRequest();
      xhr.open(method,url,false);
      xhr.send();
      var xml_response = xhr.responseText;
      

      x2js = new X2JS();
      var jsonObj = x2js.xml_str2json(xml_response);

      return jsonObj;
  },


/**
  * Extrae los espacios de un string
  * 
  * @param  str string a tratar
  * @return string sin espacios
  * 
  */
  noSpaces: function(str){
    str = str.replace(/\s+/g, '+');
    return str;
  },


/**
  * Obtiene la url de un video de Youtube
  * 
  * @param  artist nombre del artista de la canción
  * @param  name   nombre de la canción
  * @return url del video
  * 
  */
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