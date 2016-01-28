if (Meteor.isClient) {

  Template.puzzleBoard.helpers({
    sequence: function () {
      return Session.get('randomSequence');
    },

    drawCanvas: function (canvas, ctx, imageObj) {
      console.log('Drawing image on canvas...');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageObj, 0, 0);
    },

    splitImage: function (ctx, buffer, bufferCtx, tiles) {
      console.log('Splitting image into tiles...');
      var tile = {};
      for (var i = 0; i < 10; i++) { // across rows
        for (var j = 0; j < 10; j++) { // across columns
          var imageData = ctx.getImageData(j * 60, i * 60, 60, 60);
          bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
          bufferCtx.putImageData(imageData, 0, 0, 0, 0, 60, 60);
          tile = {
            'id': (i+1) * (j+1),
            'dataUrl': buffer.toDataURL()
          };
          tiles.push(tile);
          tile = {};
        }
      }
    },

    displayGrid: function (tiles) {
      console.log('Displaying grid...');
      var grid = document.createElement('div');
      grid.classList.add('grid');
      document.querySelector('#puzzle').appendChild(grid);
      console.log(sequence);
      for(var index = 0; index < 100; index++) {
        var tile = document.createElement('div');
        tile.classList.add('tile');
        grid.appendChild(tile);
        tile.style.backgroundImage = ('url(' + tiles[index].dataUrl + ')');
        tile.setAttribute('draggable','true');
        tile.setAttribute('data-tile-id', tiles[index].id.toString());
      }
    }
  });

  Template.puzzleBoard.rendered = function () {
    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext("2d");
    var buffer = document.querySelector('#buffer');
    var bufferCtx = buffer.getContext('2d');
    var imageObj = new Image();
    imageObj.src = "assets/baby-tiger.jpg";
    var tiles = [];
    Template.puzzleBoard.__helpers.get('drawCanvas', canvas, ctx, imageObj);

    Meteor.call('getSequence', function (err, res) {
      Session.set('randomSequence', res);
    });

    Template.puzzleBoard.__helpers.get('splitImage', ctx, buffer, bufferCtx, tiles);
    Template.puzzleBoard.__helpers.get('displayGrid', tiles);
  };

  Meteor.subscribe('sequence');
}