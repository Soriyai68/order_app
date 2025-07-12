import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  async 'users.list'() {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Meteor.users.find({}, { fields: { emails: 1 } }).fetch();
  },
  async 'users.updateEmail'({ userId, email }) {
    check(userId, String);
    check(email, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');
    await Meteor.users.updateAsync(userId, { $set: { 'emails.0.address': email } });
    return true;
  },
  async 'users.remove'({ userId }) {
    check(userId, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');
    if (userId === this.userId) throw new Meteor.Error('cannot-delete-self');
    await Meteor.users.removeAsync(userId);
    return true;
  },
  async 'users.changePassword'({ userId, newPassword }) {
    check(userId, String);
    check(newPassword, String);
    if (!this.userId) throw new Meteor.Error('not-authorized');
    if (newPassword.length < 6) throw new Meteor.Error('weak-password', 'Password must be at least 6 characters.');
    await Accounts.setPasswordAsync(userId, newPassword, { logout: false });
    return true;
  }
});
