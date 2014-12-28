var Listener = {
  init: function(){
    this.addSearchListener();
  },

  searchListener: function(){
    DOMManager.resetPages();

    type = DOMManager.getOptionComboBox();
    DOMManager.type = this.setType(type);

    txt = document.getElementById('textbox').value;
    j = APImanager.s_search(txt,DOMManager.type,0,INCREMENT);
    var items = [];
    
    /*if (DOMManager.type === "album"){
      items = APImanager.s_getData(j,DOMManager.type); 
    }
    if(DOMManager.type === "artist"){
      items = APImanager.s_getData(j, DOMManager.type);
    }
    if(DOMManager.type === "track"){
      items = APImanager.s_getData(j, DOMManager.type);
    }*/

    //console.log(items);
    //DOMManager.items = items;
    DOMManager.items = APImanager.s_getData(j, DOMManager.type);
    DOMManager.printItems("Searching "+ DOMManager.type + "s as " + txt);
    
  },

  addSearchListener: function(){
    var button = document.getElementById("searchButton");
    button.addEventListener("click",function(){
      Listener.searchListener("album");
    });
  },

  addArtistListener: function(){
    //console.log(DOMManager.nItem);
    for (i = 0; i < DOMManager.nItem; i++){
      var artist = document.getElementById("item"+i);
      artist.addEventListener("click",function(){
        Listener.artistListener();
      });
    }
  },

  artistListener: function(){
    var i  = this.getIdFromEvent(event.srcElement.parentElement.id);
    if (i != -1){
      i = i + DOMManager.page*INCREMENT;
      id = DOMManager.items[i].spotify_artist_id;
      artist = DOMManager.items[i].name;
      var items = [];
      items = APImanager.getAlbumsFromArtist(id, artist);
      //console.log(items);
      DOMManager.items = items;
      DOMManager.type = "album";
      DOMManager.resetPages();
      DOMManager.printItems("Albums from " + artist.artist);
    }
  },

  addAlbumListener: function(){
    console.log(DOMManager.nItem);
    for (i = 0; i < DOMManager.nItem; i++){
      //console.log(i);
      var album = document.getElementById("item"+i);
      album.addEventListener("click",function(){
        Listener.albumListener();
      });
    }
  },

  albumListener: function(){
    var i = this.getIdFromEvent(event.srcElement.parentElement.id);
    if (i != -1){
      i = i + DOMManager.page*INCREMENT;
      album = DOMManager.items[i];
      var items = [];
      items = APImanager.getTracksFromAlbum(album);
      //console.log(items);
      DOMManager.items = items;
      DOMManager.type = "track";
      DOMManager.resetPages();
      DOMManager.printItems("Tracks from " + album.name);

    }
  },

  getIdFromEvent: function(id){
    var i  = id;
    i = i.substring(4);
    //console.log(i);
    if (i.length == 1 || i.length == 2){
      i = parseInt(i);
    }else{
      i = -1;
    }
    return i;
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
  },

  addPreviousButtonListener: function(){
    //console.log("adios");
    button = document.getElementById("nextL");
    button.addEventListener("click", function(){
      Listener.previousPage();
    });
  },

  addNextButtonListener: function(){
    //console.log("hola");
    button = document.getElementById("nextR");
    button.addEventListener("click", function(){
      Listener.nextPage();
    });
  },

  nextPage: function(){
    DOMManager.page ++;
    DOMManager.iVal += INCREMENT;
    DOMManager.fVal += INCREMENT;
    /*if (DOMManager.fVal > 100){
      DOMManager.iVal = 80;
      DOMManager.fVal = 100;
    }*/
    DOMManager.printItems("Most Popular Albums");

  },

  previousPage: function(){
    DOMManager.page --;
    DOMManager.iVal -= INCREMENT;
    DOMManager.fVal -= INCREMENT;
    if (DOMManager.iVal < 0){
      DOMManager.iVal = 0;
      DOMManager.fVal = INCREMENT;
      DOMManager.page = 0;
    }
    DOMManager.printItems("Most Popular Albums");
  },

  addPlaySongListener: function(){
    console.log(DOMManager.nItem);
    console.log("adding!");
    for (i = 0; i < DOMManager.nItem; i++){
      //console.log(i);
      var play = document.getElementById("play"+i);
      play.addEventListener("click",function(){
        Listener.PlaySongListener();
      });
    }
  },

  PlaySongListener:function(){
    
    var i = this.getIdFromEvent(event.srcElement.id);
    //console.log(i);
    if (i != -1){
      i = i + DOMManager.page*INCREMENT;
      artist = DOMManager.items[i].artist;
      track = DOMManager.items[i].name;
      //console.log(track+" "+artist);
      video = APImanager.y_getVideo(artist,track);
      console.log(video);
      DOMManager.destroyVideos();
      DOMManager.embedVideo(video,i);
      //DOMManager.resetPages();
      //DOMManager.printItems("Albums from " + artist.artist);
    }
  }

  
 };
