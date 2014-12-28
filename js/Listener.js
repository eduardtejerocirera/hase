var Listener = {
  init: function(){
    this.addSearchListener();
  },

  searchListener: function(){
    DOMManager.resetPages();

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
    var i  = this.getIdFromEvent(event);
    if (i != -1){
      i = i + DOMManager.page*20;
      id = DOMManager.items[i].spotify_artist_id;
      artist = DOMManager.items[i].name;
      var items = [];
      items = APImanager.getAlbumsFromArtist(id, artist);
      console.log(items);
      DOMManager.setItems(items);
      DOMManager.type = "album";
      DOMManager.printItems("Albums from " + artist.artist);
    }
  },

  addAlbumListener: function(){
    console.log(DOMManager.nItem);
    for (i = 0; i < DOMManager.nItem; i++){
      console.log(i);
      var album = document.getElementById("item"+i);
      album.addEventListener("click",function(){
        Listener.albumListener();
      });
    }
  },

  albumListener: function(){
    var i = this.getIdFromEvent(event);
    if (i != -1){
      i = i + DOMManager.page*20;
      album = DOMManager.items[i];
      var items = [];
      items = APImanager.getTracksFromAlbum(album);
      console.log(items);
      DOMManager.setItems(items);
      DOMManager.type = "track";
      DOMManager.printItems("Tracks from " + album.name);
    }
  },

  getIdFromEvent: function(event){
    var i  = event.srcElement.parentElement.id;
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
    console.log("adios");
    button = document.getElementById("nextL");
    button.addEventListener("click", function(){
      Listener.previousPage();
    });
  },

  addNextButtonListener: function(){
    console.log("hola");
    button = document.getElementById("nextR");
    button.addEventListener("click", function(){
      Listener.nextPage();
    });
  },

  nextPage: function(){
    DOMManager.page ++;
    DOMManager.iVal += 20;
    DOMManager.fVal += 20;
    /*if (DOMManager.fVal > 100){
      DOMManager.iVal = 80;
      DOMManager.fVal = 100;
    }*/
    DOMManager.printItems("Most Popular Albums");

  },

  previousPage: function(){
    DOMManager.page --;
    DOMManager.iVal -= 20;
    DOMManager.fVal -= 20;
    if (DOMManager.iVal < 0){
      DOMManager.iVal = 0;
      DOMManager.fVal = 20;
      DOMManager.page = 0;
    }
    DOMManager.printItems("Most Popular Albums");
  }

  
 };
