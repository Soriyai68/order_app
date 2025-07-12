import { Meteor } from 'meteor/meteor';

Meteor.publish('users.all', function () {
  if (!this.userId) return this.ready();
  return Meteor.users.find({}, { fields: { emails: 1 } });
});
