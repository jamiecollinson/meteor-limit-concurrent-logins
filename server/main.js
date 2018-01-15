import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import bowser from 'bowser';

const detectDeviceFromUserAgent = userAgent => {
  const device = bowser._detect(userAgent);
  if (device.tablet) return 'tablet';
  if (device.mobile) return 'mobile';
  return 'desktop';
};

Accounts.onLogin(({ connection, user }) => {
  const currentHashedToken = Accounts._getLoginToken(connection.id);
  const deviceType = detectDeviceFromUserAgent(connection.httpHeaders['user-agent']);
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
