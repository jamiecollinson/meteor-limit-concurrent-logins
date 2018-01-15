# Meteor limit concurrent logins

This is a simple test to limit the number of logins a single user account can make.

Each time a login happens we stamp that `resume` token according to the device type as detected by `bowser` from the user-agent string, and we revoke all other tokens for that user with the same device type.

Meteor reactively watches the login tokens and automatically logs out any session which loses it's token.

# Warnings

This uses the private `Accounts._getLoginToken` method, which could presumably change in the future.
