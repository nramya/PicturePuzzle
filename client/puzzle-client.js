if (Meteor.isClient) {
  var sequence;
  Meteor.subscribe('tiles', function() {
  });

  Template.puzzleBoard.helpers({

  });

  /* DRAG AND DROP */
  // Credits: http://www.html5rocks.com/en/tutorials/dnd/basics/
  Template.puzzleBoard.events({
    'dragstart .tile': function (e) {
      e.target.style.opacity = '0.4';
      startTile = e.target;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
    },
    'dragenter .tile': function (e) {
      e.target.classList.add('over');
    },
    'dragover .tile': function (e) {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }
      e.dataTransfer.dropEffect = 'move';
      return false;
    },
    'dragleave .tile': function (e) {
      e.target.classList.remove('over');
    },
    'drop .tile': function (e) {
      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }
      if (startTile != e.target) {
        var endTile = e.target;
        var temp = document.createElement('div');
        startTile.parentNode.insertBefore(temp, startTile);
        endTile.parentNode.insertBefore(startTile, endTile);
        temp.parentNode.insertBefore(endTile, temp);
        startTile.style.opacity = '1';
        temp.parentNode.removeChild(temp);
      }
      return false;
    }
  });

  function displayGrid(tiles) {
    console.log('Displaying grid...');
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
      var canvas = document.querySelector('#canvas');
      var ctx = canvas.getContext("2d");
      var buffer = document.querySelector('#buffer');
      var bufferCtx = buffer.getContext('2d');
      var imageObj = new Image();
      imageObj.src = "assets/baby-tiger.jpg";

      var tiles = [];
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
          }
        }
        Meteor.apply('updateTile', tiles, function (err, res) {
          displayGrid(TilesSequence.find().fetch());
        });
      };
    });
  };
}