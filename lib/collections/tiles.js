TilesSequence = new Mongo.Collection('tiles');

Meteor.methods({
  updateTile: function(tileData) {
    console.log('Update method called...', tileData);
    //console.log('Check: ', TilesSequence.find({'tileId': tileData.tileId}).fetch());
    return TilesSequence.update(tileData._id, {
        $set: {dataUrl: tileData.dataUrl}
      });

    //console.log('updated tile in database: ', tileId);
    //return tileId;
  }
});