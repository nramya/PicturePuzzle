if (Meteor.isClient) {
  var sequence;
  Meteor.subscribe('tiles', function() {
    console.log(TilesSequence.find().fetch());
  });

  //console.log('data: ', TilesSequence.find().fetch());


  Template.puzzleBoard.helpers({

  });

  Template.puzzleBoard.events({

  });

  function displayGrid(tiles) {
    console.log('Displaying grid...');
    console.log(tiles);
    var grid = document.createElement('div');
    grid.classList.add('grid');
    document.querySelector('#puzzle').appendChild(grid);
    for(var index = 0; index < 100; index++) {
      var tileElement = document.createElement('div');
      tileElement.classList.add('tile');
      grid.appendChild(tileElement);
      tileElement.style.backgroundImage = ('url(' + tiles[index].dataUrl + ')');
      tileElement.setAttribute('data-tile-id', tiles[index].tileId);
      tileElement.setAttribute('draggable','true');
    }
  }

  Template.puzzleBoard.rendered = function () {
    Meteor.subscribe('tiles', function() {
      sequence = TilesSequence.find().fetch();
      console.log('sequence before update: ', sequence);
      var canvas = document.querySelector('#canvas');
      var ctx = canvas.getContext("2d");
      var buffer = document.querySelector('#buffer');
      var bufferCtx = buffer.getContext('2d');
      var imageObj = new Image();
      imageObj.src = "assets/baby-tiger.jpg";

      var tiles = [];
      //var tilesCollection;
      var tileCounter = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      imageObj.onload = function() {
        ctx.drawImage(imageObj, 0, 0);
        console.log('Splitting image into tiles...');

        for (var i = 1; i <= 10; i++) { // across rows
          for (var j = 1; j <= 10; j++) { // across columns
            var tile = {};
            var imageData = ctx.getImageData(j * 60, i * 60, 60, 60);
            bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
            bufferCtx.putImageData(imageData, 0, 0, 0, 0, 60, 60);
            tile = {
              'tileId': ++tileCounter,
              'dataUrl': buffer.toDataURL()
            };
            for (var x = 0; x < sequence.length; x++) {
              if (sequence[x].tileId === tile.tileId) {
                tile._id = sequence[x]._id;
                break;
              }
            }
            tiles.push(tile);
            //console.log('Before update: ', tiles);

            Meteor.apply('updateTile', tiles, function (err, res) {
              console.log('error? ', err, 'result? ', res);
              console.log(TilesSequence.find().fetch());
            });
          }
        }
      };
    });



    //var tiles = Template.puzzleBoard.__helpers.get('tiles');

  };
}