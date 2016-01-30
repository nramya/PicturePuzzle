if (Meteor.isServer) {
  var sequence = [];
  Meteor.startup(function () {
    //console.log('Non-empty? ', TilesSequence.findOne());
    if (!TilesSequence.findOne()) {
      for (var seqIndex = 0; seqIndex < 100; ++seqIndex) {
        sequence[seqIndex] = seqIndex + 1;
      }
      sequence = Meteor.call('shuffle', sequence);
      //console.log('seq length: ', sequence.length);
      for (var shuffledIndex = 0; shuffledIndex < sequence.length; shuffledIndex++) {
        TilesSequence.insert({'tileId': sequence[shuffledIndex], 'dataUrl': ''});
      }
    }
    //console.log(TilesSequence.find().fetch());
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
      console.log(array);
      return array;
    }
  });
  Meteor.publish('tiles', function () {
    //console.log('tiles123: ', TilesSequence.find().fetch());
    return TilesSequence.find();
  });
}
