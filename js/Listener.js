var Listener = {
  init: function(){
    this.addSearchListener();
    this.addMainPageListener();
  },

  addMainPageListener: function(){
    var section = document.getElementById("sound");
    section.addEventListener("click", function(){
      Listener.mainPageListener();
    });
  },

  mainPageListener: function(){
    DOMManager.resetPages();
    DOMManager.mainPage();
  },

  searchListener: function(){
    DOMManager.resetPages();
    type = DOMManager.getOptionComboBox();
    DOMManager.type = this.setType(type);
    txt = document.getElementById('textbox').value;
    console.log(txt);
    j = APImanager.s_search(txt,DOMManager.type,0,50);
    var items = [];
    
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
      console.log(DOMManager.items);
      console.log(i);
      id = DOMManager.items[i].spotify_artist_id;
      artist = DOMManager.items[i].name;
      console.log("ID en listener:" + id);
      var items = [];
      items = APImanager.getAlbumsFromArtist(id, artist);
      DOMManager.items = items;
      DOMManager.type = "album";
      DOMManager.resetPages();
      DOMManager.printItems("Albums from " + artist);
    }
  },

  addAlbumListener: function(){
    for (i = 0; i < DOMManager.nItem; i++){
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
      DOMManager.items = items;
      DOMManager.type = "track";
      DOMManager.resetPages();
      DOMManager.printItems("Tracks from " + album.name);

    }
  },

  getIdFromEvent: function(id){
    var i  = id;
    i = i.substring(4);
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
    button = document.getElementById("nextL");
    button.addEventListener("click", function(){
      Listener.previousPage();
    });
  },

  addNextButtonListener: function(){
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
    Animations.slideToLeft('Bigcontainer',2000);
    //Afegim un delay per a poder fer l'animació
    var delay=300;//2 seconds
    setTimeout(function(){
        DOMManager.printItems("Most Popular Albums");
        //Animations.slideToLeft('Bigcontainer',1000);
    //your code to be executed after 1 seconds
    },delay); 

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
    Animations.slideToRight('Bigcontainer',2000);
     //Afegim un delay per a poder fer l'animació
    var delay=200;//2 seconds
    setTimeout(function(){
        DOMManager.printItems("Most Popular Albums");
        
        //Animations.slideToLeft('Bigcontainer',1000);
    //your code to be executed after 1 seconds
    },delay); 
  },

  addPlaySongListener: function(){
    for (i = 0; i < DOMManager.nItem; i++){
      var play = document.getElementById("play"+i);
      play.addEventListener("click",function(){
        Listener.PlaySongListener();
      });
    }
  },

  PlaySongListener:function    (){

    var i = this.getIdFromEvent(event.srcElement.id);
    if (i != -1){
      i = i + DOMManager.page*INCREMENT;
      item = DOMManager.items[i];
      artist = DOMManager.items[i].artist;
      track = DOMManager.items[i].name;
      video = APImanager.y_getVideo(artist,track);
      console.log(video);
      DOMManager.destroyVideos();
      DOMManager.embedVideo(video,i);
      DBOps.addTrackToPlaylist(item,"default");
      //DBOps.updateReproduced(item);
      //DOMManager.resetPages();
      //DOMManager.printItems("Albums from " + artist.artist);
    }
  }

  
 };
