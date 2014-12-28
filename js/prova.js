
//(function (){

/*function start(){
  
  var Video = {
    links : [],
    getVideos : function(){
      var xhr = new XMLHttpRequest();
      xhr.open("GET","http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json",false);
      xhr.send();
      console.log(xhr.status);
      var json_response = xhr.responseText;
      json = JSON.parse(json_response);
      return json
    },
    renderVideos: function(videos){
        var list = document.createElement('ul');
        list.setAttribute("id","list");
        document.body.appendChild(list);

        for(i = 0; i < videos.feed.entry.length; i++){
          this.constructVideo(videos.feed.entry[i], i);
        }
    },
    constructVideo: function(video, i){
        
        //creamos titulo---------------------------
        var title = document.createElement('p');
        //truncamos titulo
        var text = video.title.$t;
        if (text.length > 35 ){
          text = text.substring(35,0);
          text = text + "...";
        }
        console.log(text);
        title.innerHTML = text;
        //----------------------------------------
        
        
        //img mqdefault
        var img = document.createElement('img');
        img.setAttribute("src",video.media$group.media$thumbnail[1].url);
        img.setAttribute("alt","image not loaded");
        img.setAttribute("class","mqdefault");

        //boton play
        var play = document.createElement('img');
        play.setAttribute("src","images/play.png");
        play.setAttribute("alt","image not loaded");
        play.setAttribute("class","play");
        play.setAttribute("id","play" + i);
        

        this.links[i] = video.content.src;
        //Link
        //var a = document.createElement('a');
        //a.setAttribute("href",video.content.src);
        //a.appendChild(play);

        //creamos elemento de la lista y añadimos subelementos-------------------
        var list_element = document.createElement('li');
        list_element.appendChild(title);
        list_element.appendChild(img);
        //list_element.appendChild(a);
        list_element.appendChild(play);
        list_element.setAttribute("id","li"+i);
        //------------------------------------------------------------------------
        
        //añadimos elemento de la lista li a la lista ul
        document.getElementById("list").appendChild(list_element);
        //document.appendChild(list_element);
        

        //NOTA
          //Para ver los videos en la misma pagina usaremos los tags embed e iframe.
        


    },

    getLinks : function(){
      return this.links;
    },

    replaceElement : function(){
      
      var i  = event.target.id;
      i = i.substring(4);

      var list_element = document.createElement('li');
      list_element.setAttribute("id", "li"+i);

      var video = document.createElement("embed");
      video.setAttribute("src", this.links[parseInt(i)]+"?rel=0&autoplay=1");
      //console.log(this.links[parseInt(i)]+"?rel=0&autoplay=1");
      video.setAttribute("id", "vid"+i);

      list_element.appendChild(video);

      document.getElementById("li"+i).parentNode.replaceChild(list_element,document.getElementById("li"+i));
    }
  }


  var PlayVideosListener = {
    init: function(links){
      for (i= 0; i < links.length; i++){
        var button = document.getElementById("play"+i);
        var id = button.getAttribute("id").substring(4);
        button.addEventListener("click",function(){
            Video.replaceElement();
        });
      }
    }

  }

  var json = Video.getVideos();
  Video.renderVideos(json);
  PlayVideosListener.init(Video.getLinks());
}

  document.addEventListener("DOMContentLoaded", start(), false);


function Sum(){
    return{
      result: 0,
      add: function(number){
        this.result = this.result + number;
      },
      getCurrentSum: function(){
          return this.result;
      },
      Sum: function(){
        return{ Sum:Sum};
      }
    }
  };


//SPOTIFY
var xhr = new XMLHttpRequest();
xhr.open("GET","https://api.spotify.com/v1/search?query=Muse&type=track",false);
xhr.send();
       console.log(xhr.status);
        var json_response = xhr.responseText;
        json = JSON.parse(json_response);


//YOUTUBE
      var xhr = new XMLHttpRequest();
      xhr.open("GET","http://gdata.youtube.com/feeds/api/videos?q=Muse&max-results=10&v=2",false);
      xhr.send();
      console.log(xhr.status);
      var json_response = xhr.responseText;
      json = JSON.parse(json_response);

  */



//-------------------------------------------------------------------------------------------------


function item (){
  return{
    album: "",
    artist: "",
    name: "",
    spotify_track_id:"",
    spotify_artist_id:"",
    spotify_album_id:"",
    img_url: null,
    type: ""
  }
}

function ySong(){
  return{
    url: ""
  }
}

function searchList (){
    return{
      items: []
    }
}



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
    //console.log(jBig);
    albums = [];
    for (i = 0; i < 20; i++){
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
}








var DOMManager = {
  nItemBox: 0,
  nItem: 0,
  type: null,
  iVal: 0,
  fVal: 20,
  items: [],
  

  createDiv:function(id,className){
    div = document.createElement('div');
    div.setAttribute("id",id);
    div.setAttribute("class",className);
    return div;
  },

  createBigContainer: function(){
    this.resetCounters();
    document.getElementById('Bigcontainer').remove();
    div = this.createDiv("Bigcontainer","Bigcontainer");
    document.getElementById('Content').appendChild(div);
  },


  createItemBoxDiv: function(){
    div = this.createDiv("itembox"+this.nItemBox,"itembox");
    document.getElementById("Bigcontainer").appendChild(div);
  },
  
  createItemDiv: function(itembox){
    //console.log(albumbox);
    div = this.createDiv("item"+this.nItem, "item");
    document.getElementById("itembox" + itembox).appendChild(div);
  },

  setItems: function(items){
    this.items = items;
  },

  printItems: function(text, iVal, fVal){
    this.createBigContainer();
    this.setTitle(text);
    console.log(this.items.length);
    for (i = iVal; i < this.items.length && i < fVal; i++){
      if (i % 4 == 0){
        this.createItemBoxDiv();
        this.nItemBox++;
      }
      if (this.type === "album"){
        this.renderAlbum(this.items[i], i);
      }
      if (this.type === "artist"){
        this.renderArtist(this.items[i],i);
      }
    }

    if (this.type == "artist"){
      Listener.addArtistListener();
    }
    if (this.type == "album"){
      Listener.addAlbumListener();
    }



  },

  createImage: function(url){
    img = document.createElement('img');
    img.setAttribute("src",url);
    img.setAttribute("alt","image");
    return img;
  },

  renderAlbum: function(element, album){
    console.log(element);
    this.createItemDiv(this.nItemBox - 1);
    img = this.createImage(element.img_url);
    document.getElementById("item" + album).appendChild(img);

    div = this.createDiv("info"+album,"info");
    this.insertText(div, element.artist + " - ", "nomartista");
    this.insertText(div, element.name, "nomalbum");
    document.getElementById("item" + album).appendChild(div);

    this.nItem++;
  },

  renderArtist: function(element, artist){
    //console.log(this.items.length);
    this.createItemDiv(this.nItemBox - 1);
    img = this.createImage(element.img_url);
    document.getElementById("item" + artist).appendChild(img);
    div = this.createDiv("info"+artist,"info");
    this.insertText(div, element.name, "nomartista");
    document.getElementById("item" + artist).appendChild(div);

    this.nItem++;
  },

  insertText: function(parent,text,className){
    node = document.createElement('p');
    node.setAttribute("class",className);
    node.innerHTML = text;
    parent.appendChild(node);
  },

  setTitle: function(text){
    var title = document.createElement('h3');
    title.setAttribute("id","title");
    //console.log(text);
    //console.log(title);
    title.innerHTML = text;
    document.getElementById('Bigcontainer').appendChild(title);
  },
  resetCounters:function(){
    this.nItem = 0;
    this.nItemBox = 0;
  },

  getOptionComboBox: function(){
    var obj = document.getElementById("mySelect");
    var txt = obj.options[obj.selectedIndex].text;
    return txt;
  }



 } 


 


 var Listener = {
  init: function(){
    this.addSearchListener();
  },

  searchListener: function(){
    

    type = DOMManager.getOptionComboBox();
    DOMManager.type = this.setType(type);

    txt = document.getElementById('textbox').value;
    j = APImanager.s_search(txt,DOMManager.type,0,20);
    var items = [];
    
    if (DOMManager.type === "album"){
      items = APImanager.s_getData(j,DOMManager.type); 
    }
    if(DOMManager.type === "artist"){
      items = APImanager.s_getData(j, DOMManager.type);
    }
    if(DOMManager.type === "track"){
      console.log("Tracks!!!!!!!");
    }
    //console.log(items);
    DOMManager.setItems(items);
    DOMManager.printItems("Searching "+ DOMManager.type + "s as " + txt,0,20);
    
  },

  addSearchListener: function(){
    var button = document.getElementById("searchButton");
    button.addEventListener("click",function(){
      Listener.searchListener("album");
    });
  },

  addArtistListener: function(){
    //console.log(DOMManager.items.length);
    for (i = 0; i < DOMManager.items.length; i++){
      var artist = document.getElementById("item"+i);
      artist.addEventListener("click",function(){
        Listener.artistListener();
      });
    }
  },

  artistListener: function(){
    var i  = event.srcElement.parentElement.id;
    i = i.substring(4);
    if (i.length == 1){
      console.log(i);
      i = parseInt(i);
      id = DOMManager.items[i].spotify_artist_id;
      artist = DOMManager.items[i].name;
      var items = [];
      items = APImanager.getAlbumsFromArtist(id, artist);
      console.log(items);
      DOMManager.setItems(items);
      DOMManager.type = "album";
      DOMManager.printItems("Albums from " + items[i].artist,0,20);
    }
  },

  addAlbumListener: function(){
    for (i = 0; i < DOMManager.items.length; i++){
      var album = document.getElementById("item"+i);
      album.addEventListener("click",function(){
        Listener.albumListener();
      });
    }
  },

  albumListener: function(){
    var i  = event.srcElement.parentElement.id;
    i = i.substring(4);
    if (i.length == 1){
      console.log(i);
      i = parseInt(i);
      album = DOMManager.items[i];
      var items = [];
      items = APImanager.getTracksFromAlbum(album);
      console.log(items);
      DOMManager.setItems(items);
      DOMManager.type = "track";
      DOMManager.printItems("Tracks from " + items[i].album,0,20);
    }
  },

  setType: function(type){
    if (type === "Albums"){
      return "album";
    }
    if(type === "Artists"){
      return "artist";
    }
    if(type === "Tracks"){
      return "track";
    }
  }
  
 }

/*var PlayVideosListener = {
    init: function(links){
      for (i= 0; i < links.length; i++){
        var button = document.getElementById("play"+i);
        var id = button.getAttribute("id").substring(4);
        button.addEventListener("click",function(){
            Video.replaceElement();
        });
      }
    }

  }*/



 var Principal = {
  main: function(){
    //console.log('hola');
    
   /* 

    //TRACK-------------------------------
    j = APImanager.s_search('Muse','track',0,20);
    //console.log(j);
    var sL = searchList();
    sL.items = APImanager.s_getData(j,'track');   
    console.log(sL.items);
    //FITRACK-------------------------------


    //ALBUM-------------------------------
    j = APImanager.s_search('Muse','album',0,20);
    //console.log(j);
    var sL = searchList();
    sL.items = APImanager.s_getData(j,'album');   
    console.log(sL.items);
    //FIALBUM-------------------------------


    //ARTIST-------------------------------
    j = APImanager.s_search('Muse','artist',0,20);
    //console.log(j);
    var sL = searchList();
    sL.items = APImanager.s_getData(j,'artist');   
    //console.log(sL.items);
    //ARTIST-------------------------------

    //GETVIDEO-------------------------------
    ys = ySong();
    ys.url = APImanager.y_getVideo("Creedence Clearwater Revival", "Bad Moon Rising");
    console.log(ys.url);
    //FIGETVIDEO------------------------------

    //RELATED ARTISTS---------------------------
    rA = searchList();
    rA.items = APImanager.getRelatedArtists('12Chz98pHFMPJEknJQMWvI');
    console.log(rA.items);
    //FIRELATED
    

    //BD----------------------
    method = "PUT"
    url = "http://api.hipermedia.local/query";
    query = "INSERT INTO track (track_id) VALUE (254)";
    DBOps.request(method,url,query);

    //------------------------
    */


    //DBOps.updateReproduced(sL.items[0]);
    //DBOps.getRelatedArtists();
    //APImanager.getAlbumsFromArtist("12Chz98pHFMPJEknJQMWvI");
    //APImanager.getTracksFromAlbum(sL.items[0]);
    

    //APImanager.getAlbumFromId("1xn54DMo2qIqBuMqHtUsFd");
    //APImanager.getMostPopular();
    
    //DBOps.createPlaylist("Hola");
    //DBOps.addTrackToPlaylist(sL.items[0],"PENE");
    Listener.init();
    mP = searchList();
    mP.items = APImanager.getMostPopular();
    DOMManager.setItems(mP.items);
    DOMManager.type = "album";
    DOMManager.printItems("Most Popular Albums", 0,20);

  }
 }


  document.addEventListener("DOMContentLoaded", Principal.main(), false);
