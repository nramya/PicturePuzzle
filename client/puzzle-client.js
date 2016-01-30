if (Meteor.isClient) {
  Meteor.subscribe('tiles');

  //console.log('data: ', TilesSequence.find().fetch());


  Template.puzzleBoard.helpers({
    //tiles: function () {
    //  return TilesSequence.find();
    //},
    //sequence: function () {
    //  return Session.get('randomSequence');
    //},

    //drawCanvas: function (canvas, ctx, imageObj) {
    //  console.log('Drawing image on canvas...');
    //  ctx.clearRect(0, 0, canvas.width, canvas.height);
    //  ctx.drawImage(imageObj, 0, 0);
    //},

    //splitImage: function (ctx, buffer, bufferCtx, tiles) {
    //  console.log('Splitting image into tiles...');
    //  var tile = {};
    //  for (var i = 0; i < 10; i++) { // across rows
    //    for (var j = 0; j < 10; j++) { // across columns
    //      var imageData = ctx.getImageData(j * 60, i * 60, 60, 60);
    //      bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
    //      bufferCtx.putImageData(imageData, 0, 0, 0, 0, 60, 60);
    //      tile = {
    //        'id': (i+1) * (j+1),
    //        'dataUrl': buffer.toDataURL()
    //      };
    //      //tiles.push(tile);
    //      Meteor.call('updateTile', tile);
    //      tile = {};
    //    }
    //  }
    //  console.log('after update: ', TilesSequence.find().fetch());
    //},

    //displayGrid: function (tiles) {
    //  console.log('Displaying grid...');
    //  var grid = document.createElement('div');
    //  grid.classList.add('grid');
    //  document.querySelector('#puzzle').appendChild(grid);
    //  for(var index = 0; index < 100; index++) {
    //    var tileElement = document.createElement('div');
    //    tileElement.classList.add('tile');
    //    grid.appendChild(tileElement);
    //    tileElement.style.backgroundImage = ('url(' + tiles[index].dataUrl + ')');
    //    tileElement.setAttribute('draggable','true');
    //    tileElement.setAttribute('data-tile-id', tiles[index].id.toString());
    //  }
    //}
  });

  Template.puzzleBoard.events({

  });

  function displayGrid(tiles) {
    console.log('Displaying grid...');
    //console.log(tiles);
    var grid = document.createElement('div');
    grid.classList.add('grid');
    document.querySelector('#puzzle').appendChild(grid);
    for(var index = 0; index < 100; index++) {
      var tileElement = document.createElement('div');
      tileElement.classList.add('tile');
      grid.appendChild(tileElement);
      tileElement.style.backgroundImage = ('url(' + tiles[index].dataUrl + ')');
      tileElement.setAttribute('data-tile-id', tiles[index].tileId);

      //for (var seqIndex = 0; seqIndex < tiles.length; seqIndex ++) {
      //  if (tiles[seqIndex].tileId === index) {
      //    tileElement.style.backgroundImage = ('url(' + tiles[seqIndex].dataUrl + ')');
      //    tileElement.setAttribute('data-tile-id', tiles[seqIndex].tileId);
      //  }
      //}
      tileElement.setAttribute('draggable','true');
    }
  }

  Template.puzzleBoard.rendered = function () {
    sequence = TilesSequence.find().fetch();
    //console.log('sequence before update: ', sequence);
    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext("2d");
    var buffer = document.querySelector('#buffer');
    var bufferCtx = buffer.getContext('2d');
    var imageObj = new Image();
    imageObj.src = "assets/baby-tiger.jpg";

    var tiles = [];
    var tilesCollection;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageObj, 0, 0);

    console.log('Splitting image into tiles...');

    var tileCounter = 0;
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
            //console.log(tile);
            break;
          }
        }
        tiles.push(tile);
        //console.log('calling updateTile for: ', tile.tileId);
      }
    }

    Meteor.apply('updateTile', tiles, function () {
      //console.log('returned tileId', tileId);
      tilesCollection = TilesSequence.find({}).fetch();
      //console.log(tilesCollection);
      displayGrid(tilesCollection);
    });

    //var tiles = Template.puzzleBoard.__helpers.get('tiles');

  };
}