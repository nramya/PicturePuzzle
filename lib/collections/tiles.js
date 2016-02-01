TilesSequence = new Meteor.Collection('tiles');

Meteor.methods({
  updateTile: function(tileData) {
    console.log('Updating collection...');
     TilesSequence.update(tileData._id, {
       $set: {'dataUrl': tileData.dataUrl}
     });
  }
});