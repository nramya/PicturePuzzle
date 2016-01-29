TilesSequence = new Mongo.Collection('tiles');

Meteor.methods({
  updateTile: function(tileData) {
    //console.log('Update method called...', tileData);
     TilesSequence.update(tileData._id, {
       $set: {'dataUrl': tileData.dataUrl}
     });
    //console.log('updated tile in database: ', tileData._id);
  }
});