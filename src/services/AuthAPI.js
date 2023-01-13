import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";

export default {
  login(username, password) {
    var autheticationData = {
      Username: username,
      Password: password
    };
    var authenticationDetails = new AuthenticationDetails(autheticationData);
    var poolData = {
      UserPoolId: "us-east-1_MYkuBdL4L",
      ClientId: "29jo8lq3jm7uhhjd5ei06r728u"
    };
    var userPool = new CognitoUserPool(poolData);
    var userData = {
      Username: username,
      Pool: userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        var accessToken = result.getAccessToken().getJwtToken();
        AWS.config.region = poolData.UserPoolId.split("_")[0];
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: "us-east-1:3bcebc42-5759-4f0e-a9e3-a36d549b770e",
          Logins: {
            "cognito-idp.us-east-1.amazonaws.com/us-east-1_MYkuBdL4L": result
              .getIdToken()
              .getJwtToken()
          }
        });
        AWS.config.credentials.refresh((error, result) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Successfully logged in");
          }
        });
      },
      onFailure: function(err) {
        alert(err.message || JSON.stringify(err));
      }
    });
    return cognitoUser;
  },
  logout(cognitoUser) {
    cognitoUser.signOut();
    console.log("Successfully logged out");
  },
  register(email, phone, username, password) {
    var poolData = {
      UserPoolId: "us-east-1_MYkuBdL4L",
      ClientId: "29jo8lq3jm7uhhjd5ei06r728u"
    };
    var userPool = new CognitoUserPool(poolData);
    var attributeList = [];
    var dataEmail = {
      Name: "email",
      Value: email
    };
    var dataPhoneNumber = {
      Name: "phone_number",
      Value: phone
    };
    var attributeEmail = new CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    userPool.signUp(username, password, attributeList, null, function(
      err,
      result
    ) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      var cognitoUser = result.user;
      console.log(
        "You have registered a new user as " + cognitoUser.getUsername()
      );
      return cognitoUser;
    });
  },
  checkIfLoggedIn(username, cognitoUser) {
    console.log("Checking login status of " + username);
    if (cognitoUser) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          console.log("You are logged out");
        } else {
          console.log(session);
        }
      });
    } else {
      console.log("Already logged out");
    }
  },
  retrieveUserInfo(cognitoUser) {
    if (cognitoUser) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        cognitoUser.getUserAttributes(function(err, result) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(result);
        });
      });
    }
  },
  confirmCode(code, cognitoUser) {
    if (cognitoUser) {
      cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        console.log("You have successfully confirmed the email");
      });
    }
  }
};
