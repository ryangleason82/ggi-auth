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
import AuthAPI from '../services/AuthAPI'

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
      cognitoUser: {},
    };
  },
  methods: {
    login() {
      this.cognitoUser = AuthAPI.login(this.loginUsername, this.loginPassword)
    },
    logout() {
      AuthAPI.logout(this.cognitoUser)
    },
    register() {
      this.cognitoUser = AuthAPI.register(this.signupEmail, this.signupPhone, this.signupUsername, this.signupPassword)
    },
    checkIfLoggedIn() {
      AuthAPI.checkIfLoggedIn(this.loginUsername, this.cognitoUser)
    },
    retrieveUserInfo() {
      AuthAPI.retrieveUserInfo(this.cognitoUser)
    },
    confirmCode() {
      AuthAPI.confirmCode(this.confirmation, this.cognitoUser)
    },
  },
};
</script>

<style>

</style>