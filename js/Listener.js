/**
* Listener es una clase que gestiona los Listeners y captura eventos para lanzar triggers.
**/
var Listener = {
  lastPlayed: -1,

  /**
  * Es la encargada de inicializar el buscador, el de añadir nueva playlist y el header que hace de main page
  */
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



  /**
  * Función que captura el texto escrito del textbox, pide los itens relacionados con la búsqueda y los printa por pantalla
  */
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



  /**
  * Asigna el listener al searchButton
  */
  addSearchListener: function(){
    var button = document.getElementById("searchButton");
    button.addEventListener("click",function(){
      Listener.searchListener("album");
    });
  },


  /**
  * Asigna el listener a todos los artistas mostrados por pantalla
  */
  addArtistListener: function(){
    for (i = 0; i < DOMManager.nItem; i++){
      var artist = document.getElementById("item"+i);
      artist.addEventListener("click",function(){
        Listener.artistListener();
      });
    }
  },


  /**
  * Captura el id del artista clicado, buscamos sus albums y los printamos. También hacemos una pequeña animación al clicar.
  */
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


  /**
  * Asigna el listener a todos los albums mostrados por pantalla
  */
  addAlbumListener: function(){
    for (i = 0; i < DOMManager.nItem; i++){
      var album = document.getElementById("item"+i);
      album.addEventListener("click",function(){
        Listener.albumListener();
      });
    }
  },


  /**
  * Captura el id del album clicado, buscamos sus tracks y las mostramos. También hacemos una pequeña animación al clicar.
  */
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


  /**
  * Recibe un identificador de tipo string, elimina los 4 primeros caracteres y devuelve un entero.
  * @param  id identificador con el formato de 4 letras y 1 número (siempre)
  * @return i número entero
  */
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


  /**
  * En función de la entrada scamos un equivalente que nos servirá más adelante
  * @param type string que indica el tipo de búsqueda a realizar
  * @return devuelve una string equivalente
  */
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


  /**
  * Añadimos el Listener al botón previous page
  */
  addPreviousButtonListener: function(){
    button = document.getElementById("nextL");
    button.addEventListener("click", function(){
      Listener.previousPage();
    });
  },


  /**
  * Añadimos el Listener al botón next page
  */
  addNextButtonListener: function(){
    button = document.getElementById("nextR");
    button.addEventListener("click", function(){
      Listener.nextPage();
    });
  },


  /**
  * Función que pinta más items del array (avanza página). La transición es tipo Slide (Animacion)
  */
  nextPage: function(){
    DOMManager.page ++;
    DOMManager.iVal += INCREMENT;
    DOMManager.fVal += INCREMENT;
   
    Animations.slideToLeft('Bigcontainer',2000);

    //Tenemos que añadir un delay para que la animación haga su efecto
    var delay=300;
    setTimeout(function(){
        DOMManager.printItems("Most Popular Albums");
    },delay); 

  },



  /**
  * Función que pinta más items del array (retrocede página). La transición es tipo Slide (Animacion)
  */
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


  /**
  * Añade el listener de reproducir canción al icono.
  */
  addPlaySongListener: function(){

    this.lastPlayed = -1;

    for (i = 0; i < DOMManager.nItem; i++){
      var play = document.getElementById("play"+i);
      play.addEventListener("click",function(){
        Listener.PlaySongListener();
      });
    }
  },


  /**
  * Captura evento, úsca ek id, recopila la información y embeve un video de youtube de la canción en directo
  */
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


  /**
  * Añade el listener de favoritos al icono verde del pulgar
  */
  addFavSongListener: function(){
    for (i = 0; i < DOMManager.nItem; i++){
      var thumb = document.getElementById("favo"+i);
      thumb.addEventListener("click",function(){
        Listener.favSongListener();
      });
    }
  },


  /**
  * Captura cual es la canción que queremos añadir a favoritos y la añade.
  */
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


  /**
  * Añade el listener al botón de new playlist
  */
  addNewPlaylistListener: function(){
    button = document.getElementById("newplaylist");
    button.addEventListener("click", function(){
      Listener.newPlaylistListtener();
    });
  },


  /**
  * Captura el contenido del textbox y crea una nueva playlist con el nombre del textbox
  */
  newPlaylistListtener: function(){
    txt = document.getElementById("textboxN").value;
    DBOps.createPlaylist(txt,DOMManager.playlist.length+1);
    DOMManager.setPlaylistButtons();
    Listener.addOpenPlaylistListener();
    Listener.addDeletePlaylistListener();  
  },


  /**
  * Añade el listener al botón "Add to playlist"
  */
  addTrackToPlaylistListener: function(){
    button= document.getElementsByClassName("Add")[0];
    button.addEventListener("click",function(){
      Listener.trackToPlaylistListner();
    });
  },
  

  /**
  * Captura el evento, coge la imformación y añade esa canción a la playlist seleccionada en el desplegable
  */
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


  /**
  * Añade el listener al boton de la playlist
  */
  addOpenPlaylistListener: function(){

    for(i = 1; i < DOMManager.playlist.length; i++){
      button = document.getElementById("list"+i);
      button.addEventListener("click", function(){
        Listener.openPlaylistListener();
      });
    }
  },


  /**
  * Escucha ue playlist estás clicando y te la abre con todas las tracks que has añadido en ella
  */
  openPlaylistListener: function(){
    var i = event.srcElement.id;
    i = this.getIdFromEvent(i);
    name = DOMManager.playlist[i];
    songs = DBOps.showPlaylistTracks(name);
    DOMManager.items = songs;
    DOMManager.type = "track";
    DOMManager.printItems("Playlist: "+ name);
  },


  /**
  * Añade el listener al botón de eliminar playlist
  */
  addDeletePlaylistListener: function(){
    for(i = 2; i < DOMManager.playlist.length; i++){
      button = document.getElementById("dele"+i);
      button.addEventListener("click", function(){
        Listener.deletePlaylistListener();
      });
    }
  },


  /**
  * Captura el evento y elimina la playlist, tanto de la pantalla (DOM) como en la base de datos (DBOps)
  */
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
