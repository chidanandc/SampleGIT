var memoryGameApp = angular.module('colorMemoryGame', []);

memoryGameApp.factory('game', function() {
  var images=['colour1', 'colour2', 'colour3', 'colour4', 'colour5', 'colour6','colour7', 'colour8'];
  return new CreateGame(images);
});

memoryGameApp.controller('MemoryGameCtrl', function GameCtrl($scope, game) {
  $scope.game = game;
  $scope.selectedRow = 0;      
});

function CreateGame(images) {
	this.matchingImagesLeft =images.length;
    this.allImages = CreateDuplicate(images);
    this.matchedImages=0;
	this.totalAttempts=0;	
    this.flipTile = function(item) {	  
		if(item.flipped){
		return;
		}		
		item.flip();
		
		if(!this.firstImage || this.secondImage)
		{			
			if(this.secondImage)
			{
				this.firstImage.flip();
				this.secondImage.flip();
				this.firstImage = this.secondImage = undefined;
			}
			this.firstImage=item;
		}
		else{
			if(this.firstImage.imageName==item.imageName)
			{				
				this.matchedImages++;
				this.matchingImagesLeft--;
				if(this.matchingImagesLeft==0)
				{
					$("#myModal").modal();
				}
				this.firstImage=this.secondImage=undefined;
				this.totalAttempts++;
			}
			else{
				this.secondImage=item;
				this.totalAttempts++;
			}
		}
	}	
	this.resetForm=function(scope){	
	    window.location.reload(true);
	}
}

function TileImage(name) {	
  this.imageName = name;
  this.flipped = false;
  this.frontImgHide=true;
  this.backImgHide=false;
}

TileImage.prototype.flip = function() {
  this.flipped = !this.flipped;
  this.frontImgHide=!this.flipped;
  this.backImgHide=this.flipped;
}

function CreateDuplicate(images){
	var copyimages = [];
    images.forEach(function(name) {
    copyimages.push(new TileImage(name));
    copyimages.push(new TileImage(name));
  });
  return shuffle(copyimages);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

memoryGameApp.directive('arrowSelector',['$document',function($document){
	 return{
		 restrict:'A',
		 link:function(scope,elem,attrs,ctrl){
			 $document.bind('keydown',function(e){
				 switch(e.keyCode)
				 {
					 case 37:						
						 if(scope.selectedRow == 0){
							 scope.selectedRow = scope.game.allImages.length - 1;
							 }
							 else{
							 scope.selectedRow--;						 		
							 }
						break;						 
					case 39:					
						 if(scope.selectedRow == scope.game.allImages.length - 1){
							 scope.selectedRow = scope.game.allImages.length - scope.selectedRow - 1;
						 }
						 else{
							 scope.selectedRow++;
						 }						 
						 break;						 
					 case 38:					 
						if(scope.selectedRow-4 < 0)						{
						   scope.selectedRow=(scope.game.allImages.length + scope.selectedRow) - 4;						   
						 }
						 else{
							 scope.selectedRow=scope.selectedRow - 4;
						 }
						 break;						 
					 case 40:					 
						if(scope.selectedRow + 4 >= scope.game.allImages.length)	{						   
							scope.selectedRow=(scope.selectedRow + 4) - scope.game.allImages.length ;						   
						 }
						 else{							 	
							 scope.selectedRow=scope.selectedRow + 4;
						 }
						 break;						 
					case 13:	 					 
						 scope.game.flipTile(scope.game.allImages[scope.selectedRow])					 
						 break;						 
				  }
				  scope.$apply();
				  e.preventDefault();
			 });
		 }
	 };
 }]);
 
 
 







