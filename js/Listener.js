var Listener = {
  lastPlayed: -1,

  init: function(){
    this.addSearchListener();
    this.addMainPageListener();
    this.addNewPlaylistListener();
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
      id = DOMManager.items[i].spotify_artist_id;
      artist = DOMManager.items[i].name;
      var items = [];
      items = APImanager.getAlbumsFromArtist(id, artist);
      DOMManager.items = items;
      DOMManager.type = "album";
      DOMManager.resetPages();

      Animations.pulse(event.srcElement.parentElement.id,1.5)
    //Afegim un delay per a poder fer l'animació
     var delay=300;//2 seconds
     setTimeout(function(){
        DOMManager.printItems("Albums from " + artist);
    },delay); 
      
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

      Animations.pulse(event.srcElement.parentElement.id,1.5)
    //Afegim un delay per a poder fer l'animació
     var delay=300;//2 seconds
     setTimeout(function(){
        DOMManager.printItems("Tracks from " + album.name);
    },delay); 
      

    }
  },

  getIdFromEvent: function(id){
    var i  = id;
    console.log(i);
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

    this.lastPlayed = -1;

    for (i = 0; i < DOMManager.nItem; i++){
      var play = document.getElementById("play"+i);
      play.addEventListener("click",function(){
        Listener.PlaySongListener();
      });
    }
  },

  PlaySongListener:function(){
    var i = this.getIdFromEvent(event.srcElement.id);

     
      if (i != -1){
        i = i + DOMManager.page*INCREMENT;
        item = DOMManager.items[i];
        artist = DOMManager.items[i].artist;
        track = DOMManager.items[i].name;
        video = APImanager.y_getVideo(artist,track);

        
    
          if (this.lastPlayed != -1){
            DOMManager.destroyVideos(this.lastPlayed);
          }

          DOMManager.embedVideo(video,i);
          this.lastPlayed = i;
          DBOps.addTrackToPlaylist(item,"default");
       

      }
      
  },

  addFavSongListener: function(){
    for (i = 0; i < DOMManager.nItem; i++){
      var thumb = document.getElementById("favo"+i);
      thumb.addEventListener("click",function(){
        Listener.favSongListener();
      });
    }
  },

  favSongListener: function(){
    var i = this.getIdFromEvent(event.srcElement.id);

    Animations.pulse(event.srcElement.id,2.5);
     //Afegim un delay per a poder fer l'animació
    var delay=300;//2 seconds
    setTimeout(function(){
      if (i != -1){
      i = i + DOMManager.page*INCREMENT;
      item = DOMManager.items[i];
      DBOps.addTrackToPlaylist(item,"favoritos");
    }
    },delay); 
    
  },

  addNewPlaylistListener: function(){
    button = document.getElementById("newplaylist");
    button.addEventListener("click", function(){
      Listener.newPlaylistListtener();
    });
  },

  newPlaylistListtener: function(){
    txt = document.getElementById("textboxN").value;
    DBOps.createPlaylist(txt,DOMManager.playlist.length+1);
    DOMManager.setPlaylistButtons();
    Listener.addOpenPlaylistListener();
    Listener.addDeletePlaylistListener();  
  },

  addTrackToPlaylistListener: function(){
    button= document.getElementsByClassName("Add")[0];
    button.addEventListener("click",function(){
      Listener.trackToPlaylistListner();
    });
  },
  
  trackToPlaylistListner: function(){
    var i = event.srcElement.parentElement.id;
    i = this.getIdFromEvent(i);
    if (i != -1){
      item = DOMManager.items[i];
      console.log(i);
      console.log(DOMManager.items);

      var obj = document.getElementById("addButton");
      var playlist = obj.options[obj.selectedIndex].text;
      DBOps.addTrackToPlaylist(item,playlist);
    }
  },

  addOpenPlaylistListener: function(){

    for(i = 1; i < DOMManager.playlist.length; i++){
      button = document.getElementById("list"+i);
      button.addEventListener("click", function(){
        Listener.openPlaylistListener();
      });
    }
  },

  openPlaylistListener: function(){
    var i = event.srcElement.id;
    i = this.getIdFromEvent(i);
    name = DOMManager.playlist[i];
    songs = DBOps.showPlaylistTracks(name);
    DOMManager.items = songs;
    DOMManager.type = "track";
    DOMManager.printItems("Playlist: "+ name);
  },

  addDeletePlaylistListener: function(){
    for(i = 2; i < DOMManager.playlist.length; i++){
      button = document.getElementById("dele"+i);
      button.addEventListener("click", function(){
        Listener.deletePlaylistListener();
      });
    }
  },

  deletePlaylistListener: function(){
    var i = event.srcElement.id;
    i = this.getIdFromEvent(i);
    if (i == -1){
      i = event.srcElement.parentNode.id;
      i = this.getIdFromEvent(i);
    }
    
    name = DOMManager.playlist[i];
    DBOps.deletePlaylist(name);
    DOMManager.setPlaylistButtons();
    this.addOpenPlaylistListener();
    this.addDeletePlaylistListener();

  }
  
 };
