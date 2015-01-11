
//ELEMENTOS MÁXIMOS POR PÁGINA
var INCREMENT = 20;

/**
  * Este objeto se encarga de modificar el DOM durante todo el trayecto del usuario, para adaptarlo a cada pantalla de la aplicación.
  */
var DOMManager = {
  nItemBox: 0,
  nItem: 0,
  type: null,
  iVal: 0,
  fVal: INCREMENT,
  items: [],
  page: 0,
  playlist : [],
  

  /**
  * Genera la página principal de la aplicación.
  * Si el usuario no ha reproducido ninguna canción, se muestran los álbumes más populares de Spotify
  * Si es el caso contrario, se muestran los artistas relacionados que puedan importar al ususario.
  */
  mainPage: function(){
    mP = [];
    mP = DBOps.getRelatedArtists();
    
    if (mP == null){
      mP = APImanager.getMostPopular();
      DOMManager.items = mP;
      DOMManager.type = "album";
      DOMManager.printItems("Most Popular Albums");
    }

    else{
      DOMManager.items = mP;
      DOMManager.type = "artist";
      DOMManager.printItems("Related Artists");
    }
    
  },
  

  /**
  * Crea un elemento div
  *@param id        id del div
  *@param classname clase del div
  *@return          div generado
  */
  createDiv:function(id,className){
    div = document.createElement('div');
    div.setAttribute("id",id);
    div.setAttribute("class",className);
    return div;
  },


/**
  * Crea el div principal del DOM: BigContainer.
  * En big container irán todos los items (tracks, álbumes, canciones) a mostrar.
  */
  createBigContainer: function(){
    this.resetCounters();
    document.getElementById('Bigcontainer').remove();
    div = this.createDiv("Bigcontainer","Bigcontainer");
    document.getElementById('Content').appendChild(div);
  },

  /**
  *Crea un div itemBox: un conjunto de 4 items. Lo añade al BigContainer.
  */
  createItemBoxDiv: function(){
    div = this.createDiv("itembox"+this.nItemBox,"itembox");
    document.getElementById("Bigcontainer").appendChild(div);
  },
  

  /**
  *Crea un div item, que contendrá una canción, álbum o artista. Lo añade a un itembox.
  *@param itemBox id del itembox al cual se añadirá el item.
  */
  createItemDiv: function(itembox){
    div = this.createDiv("item"+this.nItem, "item");
    document.getElementById("itembox" + itembox).appendChild(div);
  },


  /**
  * Crea el BigContainer, los botones de desplazamiento entre páginas, el titulo y
  * todos los items del array de items del DOMManager según el apartado en que se encuentre el usuario
  *
  *@param text Titulo del apartado. 
  */
  printItems: function(text){
    this.createBigContainer();
    this.createNexPreviousButtons();
    this.setTitle(text);
    for (i = this.iVal; i < this.items.length && i < this.fVal; i++){
      if (i % 4 == 0){
        this.createItemBoxDiv();
        this.nItemBox++;
      }
      if (this.type === "album"){
        this.renderAlbum(this.items[i], i - this.page*INCREMENT);
      }
      if (this.type === "artist"){
        this.renderArtist(this.items[i],i - this.page*INCREMENT);
      }
      if (this.type === "track"){
        this.printTracks(this.items[i], i - this.page*INCREMENT);
      }
    }

    if (this.type == "artist"){
      Listener.addArtistListener();
    }
    if (this.type == "album"){
      Listener.addAlbumListener();
    }
    if (this.type == "track"){
      Listener.addPlaySongListener();
      Listener.addFavSongListener();
    }
  },


  /**
  * genera una imagen para el DOM (img)
  *
  *@param url   url de la imagen.
  *@param i     id de la imagen
  *@return      imagen generada.
  */
  createImage: function(url,i){
    //figure = document.createElement("figure");
    img = document.createElement('img');
    img.setAttribute("src",url);
    img.setAttribute("alt","image");
    img.setAttribute("id","imag"+i);
    //figcaption = document.createElement("figcaption");
    //figcaption.setAttribute("id","figc"+i);
    //figure.appendChild(img);
    //figure.appendChild(figcaption);
    //figure.setAttribute("id","figu"+i);
    return img;
  },

  
  /**
  *Genera un album: imagen de portada, nombre del mismo y artista.
  *
  *@param element objeto album con todos sus atributos necesarios para generarlo
  *@param album   id del album
  */
  renderAlbum: function(element, album){
    this.createItemDiv(this.nItemBox - 1);
    img = this.createImage(element.img_url,album);
    //document.getElementById("item" + album).appendChild(img);

    div = this.createDiv("info"+album,"info");
    this.insertText(div, element.artist + " - ", "nomartista");
    this.insertText(div, element.name, "nomalbum");
    //img.getElementsByTagName("figcaption")[0].appendChild(div);

    document.getElementById("item" + album).appendChild(img);
    document.getElementById("item" + album).appendChild(div);

    this.nItem++;
  },


/**
  *Genera un artista: imagen del mismo y nombre.
  *
  *@param element objeto artista con todos sus atributos necesarios para generarlo.
  *@param album   id del artista
  */
  renderArtist: function(element, artist){
    this.createItemDiv(this.nItemBox - 1);
    img = this.createImage(element.img_url);
    //document.getElementById("item" + artist).appendChild(img);
    
    div = this.createDiv("info"+artist,"info");
    this.insertText(div, element.name, "nomartista");
    //img.getElementsByTagName("figcaption")[0].appendChild(div);
    
    document.getElementById("item" + artist).appendChild(img);
    document.getElementById("item" + artist).appendChild(div);


    this.nItem++;
  },

  
  /**
  *Inserta texto en forma de tag <p> en un elemento
  *
  *@param parent      elemento padre donde se añadirá el texto
  *@param text        .exto a añadir,
  *@param className   clase del tag <p>
  */
  insertText: function(parent,text,className){
    node = document.createElement('p');
    node.setAttribute("class",className);
    node.innerHTML = text;
    parent.appendChild(node);
  },

  /**
  *Genera un titulo para añadir al BigContainer
  *
  *@param text texto del titulo
  */
  setTitle: function(text){
    var title = document.createElement('h3');
    title.setAttribute("id","title");
    title.innerHTML = text;
    document.getElementById('Bigcontainer').appendChild(title);
  },
  
  
  /**
  *Resetea los contadores de items e ItemBoxes del objeto.
  */
  resetCounters:function(){
    this.nItem = 0;
    this.nItemBox = 0;
  },


/**
  *Extrae la opción seleccionada del Combo Box con id "mySelect"
  *
  *@return la opción marcada del combobox
  */
  getOptionComboBox: function(){
    var obj = document.getElementById("mySelect");
    var txt = obj.options[obj.selectedIndex].text;
    return txt;
  },


/**
  *Crea la flecha de avance entre páginas
  *
  *@param parentid elemento padre donde se añadirá el botón
  */
  createNextPageButton: function(parentid){
    i = document.createElement('i');
    i.setAttribute("id","nextR");
    i.setAttribute("class","fa fa-chevron-circle-right");
    document.getElementById(parentid).appendChild(i);
  },


  /**
  *Crea la flecha de retroceso entre páginas
  *
  *@param parentid elemento padre donde se añadirá el botón
  */
  createPreviousPageButton: function(parentid){
    i = document.createElement('i');
    i.setAttribute("id","nextL");
    i.setAttribute("class","fa fa-chevron-circle-left");
    document.getElementById(parentid).appendChild(i);
  },
  
  
  /**
  *Crea las flechas de desplazamiento entre páginas de elementos.
  *Si hay más elementos hacia delante, crea la flecha de avance.
  *Si hay más elementos hacia atrás, crea la flecha de retroceso.
  */
  createNexPreviousButtons: function(){
    div = document.getElementById("arrows");
    
    if (div != null){
      div.remove();
    }

    div = this.createDiv("arrows","arrows");
    document.getElementById('Content').appendChild(div);
    if (this.page != 0){
      this.createPreviousPageButton("arrows");
      Listener.addPreviousButtonListener();
    }
    if(this.items.length > this.fVal){
      this.createNextPageButton("arrows");
      Listener.addNextButtonListener();
    }
  },

  
  /**
  *Resetea el contador de Páginas del objeto DOMManager
  *
  */
  resetPages: function(){
    this.page = 0;
    this.iVal = 0;
    this.fVal = INCREMENT;
  },

  
/**
  *Printa una nueva fila en la tabla de canciones.
  *
  *@param element propia canción con toda la información necesaria para printarla
  *@i     id de la canción.
  */
  printTracks: function(element, i){
    
    if (i ==  0){
      div = this.createDiv("repr","repr");
      document.getElementById("Bigcontainer").appendChild(div);
      this.createTable();
    }
    
    cell1 = this.NewCell(element.name);
    cell2 = this.NewCell(element.album);
    cell3 = this.NewCell(element.artist);
    cellnum = this.NewCell(i+1 + this.iVal);
    cellplay = this.NewPlayCell(i);
    cellList = this.NewCell(" ");
    cellList.setAttribute("id","td-playlist"+i);
    cellFav = this.NewFavCell(i);
    row = this.NewRow(cell1, cell2, cell3, cellnum, cellplay,cellList, cellFav);
    document.getElementById("table-body").appendChild(row);
    this.nItem++;
  },
  

  /**
  *Crea la tabla donde se añadirán las canciones
  */
  createTable: function(){ 
    t = document.createElement("table");
    t.setAttribute("class", "table table-hover");
    t = this.createTableHeader(t);
    t = this.createTableBody(t);
    document.getElementById("Bigcontainer").appendChild(t);
  },
  
  
  /**
  *Crea la cabecera de la tabla de canciones
  *
  *@param parent elemento padre al que se añade la cabecera
  *@return elemento padre con la cabecera añadida.
  */
  createTableHeader: function(parent){
    head = document.createElement("thead");
    hnum = this.NewHeader("#");
    h1 = this.NewHeader("Track");
    h2 = this.NewHeader("Album");
    h3 = this.NewHeader("Artist");
    hplay = this.NewHeader(" ");
    hlist = this.NewHeader(" ");
    hf = this.NewHeader(" ");
    row = this.NewRow(h1,h2,h3,hnum,hplay,hlist,hf);
    head.appendChild(row);
    parent.appendChild(head);
    return parent;
  },


  /**
  *Crea el tag <tbody> donde irá el cuepo de la tabla
  *
  *@param parent elemento padre al que se añade el tbody
  *@return elemento padre con el tbody añadido.
  */
  createTableBody: function(parent){
    body = document.createElement("tbody");
    body.setAttribute("id","table-body");
    parent.appendChild(body);
    return parent;
  },


  /**
  *Crea una nuevo elemento de cabecera (columna)
  *
  *@param name innerHTML del elemento de cabecera (texto de titulo)
  *@return elemento de cabecera
  */
  NewHeader: function(name){
    column = document.createElement("th");
    column.innerHTML = name;
    return column;
  },


  /**
  *Genera una nueva fila en la tabla.
  *Cada fila contiene el número de la canción, icono de play e información de la canción 
  *
  *@param e1    celda nombre de la cancion
  *@param e2    celda álbum
  *@param e3    celda artista
  *@param num   celda número de canción
  *@param play  celda icono de play
  *@param fav   celda icono de favoritos
  *
  *@return      fila generada
  */
  NewRow: function(e1, e2, e3, num, play, playlist, fav){
    row = document.createElement("tr");
    row.appendChild(num);
    row.appendChild(play);
    row.appendChild(playlist);
    row.appendChild(e1);
    row.appendChild(e2);
    row.appendChild(e3);
    row.appendChild(fav);
    return row;
  },


  /**
  *Crea una celda con un texto en su interior
  *
  *@param text texto a insertar en la celda
  *@return celda generada.
  */
  NewCell: function(text){
    cell = document.createElement("td");
    cell.innerHTML = text;
    return cell;
  },
  

  /**
  *Crea una celda con el icono play
  *
  *@param i id del icono
  *@return celda generada.
  */
  NewPlayCell: function(i){
    cell = document.createElement("td");
    cell.setAttribute("class", "play");
    cell.setAttribute("id","td-play"+i);
    play = document.createElement("i");
    play.setAttribute("class","fa fa-play");
    play.setAttribute("id","play"+i);
    cell.appendChild(play);
    return cell;
  },
  

  /**
  *Crea una celda con el icono de favoritos
  *
  *@param i id del icono
  *@return celda generada.
  */
  NewFavCell: function(i){
    cell = document.createElement("td");
    cell.setAttribute("class","fav");
    cell.setAttribute("id","td-fav"+i);
    thumb = document.createElement("i");
    thumb.setAttribute("id", "favo"+i);
    thumb.setAttribute("class", "fa fa-thumbs-up");
    cell.appendChild(thumb);
    return cell;
  },


  /**
  *Crea un tag <form> con el listado de playlists (combobox) y el botón de añadir canción a playlist
  *@return formulario generado.
  */
  NewPlaylistCell: function(){
    form = document.createElement("form");
    select = document.createElement("select");
    select.setAttribute("id","addButton");
    for (i = 1; i < this.playlist.length; i++){
      option = document.createElement("option");
      option.innerHTML = this.playlist[i];
      select.appendChild(option);
    }
    form.appendChild(select);
    return form;
  },

  /**
  *Crea el botón de añadir canción a Playlist.
  *
  *@param i id del botón
  *@return  botón generado.
  */
  NewAddButton: function(i){
    button = document.createElement("button");
      button.innerHTML = "Add to Playlist";
      button.setAttribute("class","Add")
      button.setAttribute("id","Addd"+i);
    return button;  
  },


  /**
  *Crea un embed del vídeo a reproducir
  *
  *@param url del video a reproducir 
  *@param i id del video
  */
  embedVideo: function(url,i){
      var video = document.createElement("embed");
      video.setAttribute("src", url+"?rel=0&autoplay=1");
      video.setAttribute("id", "song"+i);
      video.setAttribute("class","song");
      
      document.getElementById("repr").setAttribute("id","repr"+i);
      
      document.getElementById("repr"+i).appendChild(video);
      var button = this.NewPlaylistCell();
      //document.getElementById("td-playlist"+i).appendChild(button);
      document.getElementById("repr"+i).appendChild(button);
      var button2 = this.NewAddButton(i);
      //document.getElementById("td-playlist"+i).appendChild(button2);
      document.getElementById("repr"+i).appendChild(button2);
      Listener.addTrackToPlaylistListener();

      //document.getElementById("td-play"+i).appendChild(video);


      document.getElementById("play"+i).style.display = "none";
  },


/**
  *elimina el vvideo con id i del DOM
  *
  *@param i id del video
  */
  destroyVideos: function(i){
    /*var videos = document.getElementsByClassName("song");
    for(i = 0; i < videos.length; i++){
      id = videos[i].getAttribute("id");
      document.getElementById(id).remove();
      document.getElementById("Add").remove();
      document.getElementById("addButton").remove();

      document.getElementById("play"+i).style.display = "inline";
      //cell = document.getElementById("td-play"+i);
    }*/

    document.getElementById("song"+i).remove();
    document.getElementById("Addd"+i).remove();
    document.getElementById("addButton").remove();
    document.getElementById("play"+i).style.display = "inline";
    document.getElementById("repr"+i).setAttribute("id","repr");


  },


  /**
  *Crea el una playlist del combo box
  *
  *@param name nombre de la laylist
  *@param i id de la playlist.
  */
  newPlaylistButton: function(name, i){
    /*<div id = "playlistbuttons">  
                     <div class="btn-group" id = "btn-group">
                        <button type="button" class="btn btn-default">LIST 1</button>
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                          <span class="caret"></span>
                          <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu" role="menu">
                          <li><a href="#">DELETE LIST</a></li> 
                        </ul>
                    </div>
                  </div>*/

    div = this.createDiv("btn-group", "btn-group"+i);
    
    button1 = document.createElement("button");
    button1.setAttribute("type","button");
    button1.setAttribute("class", "btn btn-default");
    button1.setAttribute("id", "list"+i);
    button1.innerHTML = name;
    
    if (i != 1){
      button2 = document.createElement("button");
      button2.setAttribute("class", "btn btn-default dropdown-toggle");
      button2.setAttribute("id","dele"+i);

      i = document.createElement("i");
      i.setAttribute("class", "fa fa-times");

      button2.appendChild(i);
    }
    //button2.setAttribute("data-toggle", "dropdown");
    //button2.setAttribute("aria-expanded","false");

    /*span1 = document.createElement("span");
    span1.setAttribute("class", "caret");*/

    /*span2 = document.createElement("span");
    span2.setAttribute("class", "sr-only");
    span2.innerHTML = "Toggle Dropdown";*/

    /*button2.appendChild(span1);
    button2.appendChild(span2);*/

    /*ul = document.createElement("ul");
    ul.setAttribute("class","dropdown-menu");
    ul.setAttribute("role", "menu");*/

    /*li = document.createElement("li");
    li.setAttribute("id","dele"+i)
    li.innerHTML = "DELETE LIST";*/

    //ul.appendChild(li);

    div.appendChild(button1);
    
    if (i != 1){
      div.appendChild(button2);
    }
    //div.appendChild(ul);



    /*button = document.createElement("button");
    button.innerHTML = name;*/
    document.getElementById("playlistbuttons").appendChild(div);
  },


  /**
  *Crea el comboBox con las playlists del momento
  */
  setPlaylistButtons: function(){
    div = document.getElementById("playlistbuttons").remove();
    div = this.createDiv("playlistbuttons", "playlistbuttons");
    document.getElementById("playlistcell").appendChild(div)
    p = DBOps.getPlaylists();
    this.playlist = p;
    for(i = 1; i < p.length; i++){
      this.newPlaylistButton(p[i], i);
    }
  }



 }; 