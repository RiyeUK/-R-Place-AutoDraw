Riye = {
	getColorOfTile: function(x, y){
		var cntx = document.getElementById("place-canvasse").getContext('2d');
		var col = cntx.getImageData(x,y,1,1).data;
		return this.convertColor(("#" + ((1 << 24) + (col[0] << 16) + (col[1] << 8) + col[2]).toString(16).slice(1)).toUpperCase());
	},
	convertColor: function( color ){
		return r.place.palette.indexOf(color);
	},
	paintTile: function(){
		if (!this.none){
			r.place.setColor(this.next[2]);
			r.place.drawTile(this.next[0],this.next[1]);
		}
	},
	offset: function(x,y){
		this.offsetX = x;
		this.offsetY = y;
	},
	image: function(url){
		this.image = url;
	},

	loadGuide: function(){
		this.guideCanvas = document.createElement("canvas");
		this.guideContext = this.guideCanvas.getContext('2d');
		var img = new Image;
		img.src = this.image;
		img.onload = function(){
			Riye.guideCanvas.width = this.width;
			Riye.guideCanvas.height= this.height;
			Riye.guideContext.drawImage(this,0,0);
		}
	},
	getGuideColorOfTile: function(x,y){
		var col = this.guideContext.getImageData(x-this.offsetX,y-this.offsetY,1,1).data;
		return this.convertColor(("#" + ((1 << 24) + (col[0] << 16) + (col[1] << 8) + col[2]).toString(16).slice(1)).toUpperCase());
	},
	findNextTile: function(){
		for(x = 0; x <= this.guideCanvas.width - 1; x++){
			for(y = 0; y <= this.guideCanvas.height -1; y++){
				var current = this.getColorOfTile(this.offsetX + x, this.offsetY + y);
				var guide   = this.getGuideColorOfTile(this.offsetX + x, this.offsetY + y);
				if (current != guide){
					this.next = [this.offsetX + x, this.offsetY + y, guide];
					this.none = false;
					return this.next;
				}
			}
		}
		return "Nowhere. Drawing completed";
		this.none = true;
	},
	start: function(){
		this.none = false;
		Riye.loadGuide(452,281);
		Riye.findNextTile();
		this.pid = setInterval(function() {

			if (r.place.getCooldownTimeRemaining() <= 0){
				console.log('Drawing at ' + Riye.findNextTile());
				Riye.paintTile();
			}
		}, 5000);
	},
	stop: function(){
		console.log('Stopped')
		clearInterval(this.pid);
	}
}

Riye.offset(452,281);   //The offset for the pixel art
Riye.Image("data url"); //DataURL of Pixel art
Riye.start();			//Start
