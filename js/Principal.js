 
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
    mP = [];
    mP = APImanager.getMostPopular();
    DOMManager.items = mP;
    DOMManager.type = "album";
    DOMManager.printItems("Most Popular Albums");

  }
 }

  document.addEventListener("DOMContentLoaded", Principal.main(),false);