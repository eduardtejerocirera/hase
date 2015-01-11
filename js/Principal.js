

/**
*Objeto item. Guarda informacion de un item, ya sea track, album o artist.
*/
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


/**
* Objeto youtube Song. Solo contiene la url del video a reproducir
*/ 
function ySong(){
  return{
    url: ""
  }
}


/**
* Listado de items
*/
function searchList (){
    return{
      items: []
    }
}



/**
*Objeto desde el que se inicializa la aplicación.
*/

 var Principal = {

  /**
  * funcion principal, donde se inicializa la aplicacion
  * Las primeras sentencias permiten resetear la BD.
  * El resto inicializa el DOM i Listeners correspondientes
  */
  main: function(){
    
    //RESET DB------------------------------
    DBOps.emptyDB();
    DBOps.createPlaylist("default",1);
    DBOps.createPlaylist("favoritos",2);
    //-----------------------------------------
    


    DOMManager.playlist = DBOps.getPlaylists();
    Listener.init();

    DOMManager.mainPage();
    DOMManager.setPlaylistButtons();
    Listener.addOpenPlaylistListener();
    Listener.addDeletePlaylistListener();

  }
 }

  document.addEventListener("DOMContentLoaded", Principal.main(),false);