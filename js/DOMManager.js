

var INCREMENT = 20;

var DOMManager = {
  nItemBox: 0,
  nItem: 0,
  type: null,
  iVal: 0,
  fVal: INCREMENT,
  items: [],
  page: 0,
  playlist : [],
  
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
    div = this.createDiv("item"+this.nItem, "item");
    document.getElementById("itembox" + itembox).appendChild(div);
  },

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

  createImage: function(url){
    img = document.createElement('img');
    img.setAttribute("src",url);
    img.setAttribute("alt","image");
    return img;
  },

  renderAlbum: function(element, album){
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
  },

  createNextPageButton: function(parentid){
    i = document.createElement('i');
    i.setAttribute("id","nextR");
    i.setAttribute("class","fa fa-chevron-circle-right");
    document.getElementById(parentid).appendChild(i);
  },
  createPreviousPageButton: function(parentid){
    i = document.createElement('i');
    i.setAttribute("id","nextL");
    i.setAttribute("class","fa fa-chevron-circle-left");
    document.getElementById(parentid).appendChild(i);
  },
  
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

  resetPages: function(){
    this.page = 0;
    this.iVal = 0;
    this.fVal = INCREMENT;
  },

  printTracks: function(element, i){
    
    if (i ==  0){
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
  
  createTable: function(){ 
    t = document.createElement("table");
    t.setAttribute("class", "table table-hover");
    t = this.createTableHeader(t);
    t = this.createTableBody(t);
    document.getElementById("Bigcontainer").appendChild(t);
  },
  
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

  createTableBody: function(parent){
    body = document.createElement("tbody");
    body.setAttribute("id","table-body");
    parent.appendChild(body);
    return parent;
  },

  NewHeader: function(name){
    column = document.createElement("th");
    column.innerHTML = name;
    return column;
  },

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

  NewCell: function(text){
    cell = document.createElement("td");
    cell.innerHTML = text;
    return cell;
  },

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

  NewAddButton: function(){
    button = document.createElement("button");
      button.innerHTML = "Add to Playlist";
      button.setAttribute("id","Add");
    return button;  
  },


  embedVideo: function(url,i){
      var video = document.createElement("embed");
      video.setAttribute("src", url+"?rel=0&autoplay=1");
      video.setAttribute("id", "song"+i);
      video.setAttribute("class","song");

      var button = this.NewPlaylistCell();
      document.getElementById("td-playlist"+i).appendChild(button);
      var button2 = this.NewAddButton();
      document.getElementById("td-playlist"+i).appendChild(button2);
      Listener.addTrackToPlaylistListener();

      document.getElementById("td-play"+i).appendChild(video);
  },

  destroyVideos: function(){
    var videos = document.getElementsByClassName("song");
    for(i = 0; i < videos.length; i++){
      id = videos[i].getAttribute("id");
      document.getElementById(id).remove();
      document.getElementById("Add").remove();
      document.getElementById("addButton").remove();
      //cell = document.getElementById("td-play"+i);
    }
  },

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