TilesSequence = new Mongo.Collection('tiles');

Meteor.methods({
  updateTile: function(tileData) {
    //console.log(typeof callbackFn);
    //console.log('Updating collection...');
    //console.log(count++);
    //console.log('_id: ', tileData._id);
    //console.log('dataUrl: ', tileData.dataUrl);
    //console.log('===============');
    //console.log('Update method called...', tileData);
     TilesSequence.update(tileData._id, {
       $set: {'dataUrl': tileData.dataUrl}
     });
  }
});