
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



 var Principal = {
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