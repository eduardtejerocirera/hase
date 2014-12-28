// Clase que gestiona les animacions de la aplicació
var Animations = {

  	//Funció que aumenta i disminueix la mida (scale) d'un element (id)
	pulse: function(id, scale){
		move("#"+id)
			.scale(scale)
			.set('opacity', .5)
			.scale(1/scale)
			.set('opacity', 1)
  			.end();
  	},

  	// Funcio que fa desapareixer l'element (id) progresivament fins a una (opacity)
  	dispel: function(id,opacity){
		move("#"+id)
			.set('opacity', opacity)
    		.end();
  	},

  	// Funcins que desplacen un element (id) en un sentit. End es el paramtre que indica fins on.
  	slideToRight: function(id,end){
  		move("#"+id)
  			.add('margin-left', 0.1)
  			.end();
  		move("#"+id)
			.add('margin-left', end)
 			.end();
  	},
  	slideToLeft: function(id,end){
  		move("#"+id)
  			.add('margin-left', 0.1)
  			.end();
  		move("#"+id)
			.sub('margin-left', end)
  			.end();

  	},
    translate: function(id,posX,posY){
      move("#"+id)
        .translate(posX,posY)
        .end;
    }


}