import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import bowser from 'bowser';

Accounts.onLogin(({ connection, user }) => {
  const currentHashedToken = Accounts._getLoginToken(connection.id);
  const device = bowser._detect(connection.httpHeaders['user-agent']);
  const deviceType = device.mobile || device.tablet ? 'mobile' : 'desktop';
  Meteor.users.update(
    {
      _id: user._id,
      'services.resume.loginTokens.hashedToken': currentHashedToken,
    },
    {
      $set: {
        'services.resume.loginTokens.$.deviceType': deviceType,
      },
    }
  );
  Meteor.users.update(user._id, {
    $pull: {
      'services.resume.loginTokens': {
        hashedToken: { $ne: currentHashedToken },
        deviceType: { $eq: deviceType },
      },
    },
  });
});
