<template>
  <div>
    <button @click="checkIfLoggedIn">Logged In?</button>
    <br /><br />
    <label>Username</label>
    <input type="text" v-model="signupUsername" class="input" />
    <br /><br />
    <label>Password</label>
    <input type="text" v-model="signupPassword" class="input" />
    <br /><br />
    <label>Email</label>
    <input type="text" v-model="signupEmail" class="input" />
    <br /><br />
    <label>Phone Number</label>
    <input type="text" v-model="signupPhone" class="input" />
    <br /><br />
    <button @click="register">Register</button>
    <br /><br />
    <label>Enter your confirmation</label>
    <input type="text" v-model="confirmation" class="input" />
    <button @click="confirmCode">Confirm</button>
    <br /><br />
    <label>Login Username</label>
    <input type="text" v-model="loginUsername" class="input" />
    <label>Login Password</label>
    <input type="text" v-model="loginPassword" class="input" />
    <button @click="login">Login</button>
    <br /><br />
    <label>Retrieve user info</label>
    <button @click="retrieveUserInfo">Retrieve</button>
    <br /><br />
    <label>Logout </label>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";

export default {
  name: "Login",
  data() {
    return {
      signupUsername: "",
      signupPassword: "",
      signupEmail: "",
      signupPhone: "",
      confirmation: "",
      loginUsername: "",
      loginPassword: "",
    };
  },
  methods: {
    login() {
      var autheticationData = {
        Username: this.loginUsername,
        Password: this.loginPassword,
      };
      var authenticationDetails = new AuthenticationDetails(autheticationData);
      var poolData = {
        UserPoolId: "us-east-1_MYkuBdL4L",
        ClientId: "29jo8lq3jm7uhhjd5ei06r728u",
      };
      var userPool = new CognitoUserPool(poolData);
      var userData = {
        Username: this.loginUsername,
        Pool: userPool,
      };
      var cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          var accessToken = result.getAccessToken().getJwtToken();
          AWS.config.region = poolData.UserPoolId.split("_")[0];
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: "us-east-1:3bcebc42-5759-4f0e-a9e3-a36d549b770e",
            Logins: {
              "cognito-idp.us-east-1.amazonaws.com/us-east-1_MYkuBdL4L": result
                .getIdToken()
                .getJwtToken(),
            },
          });
          AWS.config.credentials.refresh((error, result) => {
            if (error) {
              console.error(error);
            } else {
              console.log("Successfully logged in");
            }
          });
        },
        onFailure: function (err) {
          alert(err.message || JSON.stringify(err));
        },
      });
    },
    logout() {
      var poolData = {
        UserPoolId: "us-east-1_MYkuBdL4L",
        ClientId: "29jo8lq3jm7uhhjd5ei06r728u",
      };
      var userPool = new CognitoUserPool(poolData);
      var userData = {
        Username: this.loginUsername,
        Pool: userPool,
      };
      var cognitoUser = new CognitoUser(userData);
      cognitoUser.signOut();
      console.log("Successfully logged out");
    },
    register() {
      var poolData = {
        UserPoolId: "us-east-1_MYkuBdL4L",
        ClientId: "29jo8lq3jm7uhhjd5ei06r728u",
      };
      var userPool = new CognitoUserPool(poolData);
      var attributeList = [];
      var dataEmail = {
        Name: "email",
        Value: this.signupEmail,
      };
      var dataPhoneNumber = {
        Name: "phone_number",
        Value: this.signupPhone,
      };
      var attributeEmail = new CognitoUserAttribute(dataEmail);
      var attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);

      attributeList.push(attributeEmail);
      attributeList.push(attributePhoneNumber);
      userPool.signUp(
        this.signupUsername,
        this.signupPassword,
        attributeList,
        null,
        function (err, result) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          var cognitoUser = result.user;
          console.log(
            "You have registered a new user as " + cognitoUser.getUsername()
          );
        }
      );
    },
    checkIfLoggedIn() {
      console.log("Checking login status of " + this.loginUsername);
      var poolData = {
        UserPoolId: "us-east-1_MYkuBdL4L",
        ClientId: "29jo8lq3jm7uhhjd5ei06r728u",
      };
      var userPool = new CognitoUserPool(poolData);
      var userData = {
        Username: this.loginUsername,
        Pool: userPool,
      };
      var cognitoUser = new CognitoUser(userData);

      cognitoUser.getSession(function (err, session) {
        if (err) {
          console.log("You are logged out");
        } else {
          console.log(session);
        }
      });
    },
    retrieveUserInfo() {
      console.log("Retrieving userinfo for " + this.loginUsername);
      var poolData = {
        UserPoolId: "us-east-1_MYkuBdL4L",
        ClientId: "29jo8lq3jm7uhhjd5ei06r728u",
      };
      var userPool = new CognitoUserPool(poolData);
      var userData = {
        Username: this.loginUsername,
        Pool: userPool,
      };
      var cognitoUser = new CognitoUser(userData);

      cognitoUser.getSession(function (err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        cognitoUser.getUserAttributes(function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(result);
        });
      });
    },
    confirmCode() {
      var poolData = {
        UserPoolId: "us-east-1_MYkuBdL4L",
        ClientId: "29jo8lq3jm7uhhjd5ei06r728u",
      };
      var userPool = new CognitoUserPool(poolData);
      var userData = {
        Username: this.signupUsername,
        Pool: userPool,
      };
      var cognitoUser = new CognitoUser(userData);
      cognitoUser.confirmRegistration(
        this.confirmation,
        true,
        function (err, result) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          console.log("You have successfully confirmed the email");
        }
      );
    },
  },
};
</script>

<style>
</style>