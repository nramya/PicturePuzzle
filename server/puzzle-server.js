if (Meteor.isServer) {
  var sequence = [];
  Meteor.startup(function () {
    //console.log('Non-empty? ', TilesSequence.findOne());
    if (!TilesSequence.findOne()) {
      for (var i = 0; i < 100; ++i) {
        sequence[i] = i + 1;
      }
      sequence = Meteor.call('shuffle', sequence);
      //console.log('seq: ', sequence);
      for (var index = 0; index < sequence.length; index++) {
        TilesSequence.insert({'tileId': sequence[index]});
        //console.log("Inserted at i: ", TilesSequence.findOne({'tileId': sequence[index]}));
      }
    }

  });
  Meteor.methods({
    shuffle: function (array) {
      //console.log("Inside shuffle method");
      // Credits: http://stackoverflow.com/questions/962802#962890
      var tmp, current, top = array.length;
      if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
      return array;
    },
    getSequence: function () {
      return sequence;
    }
  });
  Meteor.publish('tiles', function () {
    //console.log('tiles123: ', TilesSequence.find().fetch());
    return TilesSequence.find();
  });
}
