var DOMManager = {
  nItemBox: 0,
  nItem: 0,
  type: null,
  iVal: 0,
  fVal: 20,
  items: [],
  page: 0,
  

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
    //console.log(albumbox);
    div = this.createDiv("item"+this.nItem, "item");
    document.getElementById("itembox" + itembox).appendChild(div);
  },

  setItems: function(items){
    this.items = items;
  },

  printItems: function(text){
    this.createBigContainer();
    this.createNexPreviousButtons();
    this.setTitle(text);
    console.log("page ="+ this.page);
    console.log("iVal ="+ this.iVal);
    console.log("fVal ="+ this.fVal);
    console.log("length de items = "+ this.items.length);
    for (i = this.iVal; i < this.items.length && i < this.fVal; i++){
      console.log(i);
      if (i % 4 == 0){
        this.createItemBoxDiv();
        this.nItemBox++;
      }
      if (this.type === "album"){
        this.renderAlbum(this.items[i], i - this.page*20);
      }
      if (this.type === "artist"){
        this.renderArtist(this.items[i],i - this.page*20);
      }
    }

    if (this.type == "artist"){
      Listener.addArtistListener();
    }
    if (this.type == "album"){
      Listener.addAlbumListener();
    }
  },

  createImage: function(url){
    img = document.createElement('img');
    img.setAttribute("src",url);
    img.setAttribute("alt","image");
    return img;
  },

  renderAlbum: function(element, album){
    //console.log(element);
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
    //console.log(this.items.length);
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
    //console.log(text);
    //console.log(title);
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
      console.log("Prev");
      this.createPreviousPageButton("arrows");
      Listener.addPreviousButtonListener();
    }
    if(this.items.length > this.fVal){
      console.log("Next");
      this.createNextPageButton("arrows");
      Listener.addNextButtonListener();
    }
  },

  resetPages: function(){
    console.log("Reset!");
    this.page = 0;
    this.iVal = 0;
    this.fVal = 20;
  }



 }; 