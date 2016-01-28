if (Meteor.isServer) {
  var sequence = [];
  Meteor.startup(function () {
    for (var i = 0; i < 100; ++i) {
      sequence[i] = i;
    }
    sequence = Meteor.call('shuffle', sequence);
  });
  Meteor.methods({
    shuffle: function (array) {
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
  Meteor.publish('sequence', function () {
    return sequence;
  });
}
