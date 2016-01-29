TilesSequence = new Mongo.Collection('tiles');

Meteor.methods({
  updateTile: function(tileData) {
    var tileId = TilesSequence.update({tileId: tileData.tileId}, {dataUrl: tileData.dataUrl});
    return tileId;
  }
});