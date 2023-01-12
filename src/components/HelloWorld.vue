<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- <button @click="loginClick">
      Login
    </button>
    <button @click="logoutClick">
      Logout
    </button>
    <button @click="getJWT">Get JWT</button>
    <div>
      <br />
      User Info: {{ this.userInfo }}
    </div> -->
    <Login />
  </div>
</template>

<script>
import Login from './Login.vue';
import axios from 'axios'

export default {
  name: 'HelloWorld',
  components:{
    Login
  },
  data() {
    return {
      msg: 'GGI Auth Flow',
      auth2: "",
      code: ''
    }
  },
  methods: {
    differentFlow(){
      console.log("Different flow")
    },
    getQueryParams() {
      this.auth2 = this.$route.query.code
      console.log(this.auth2)
    },
    loginClick() {
      const URL = 'https://ggi-user-pool-2.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=4ckq2pjka0nl64smcp2fnnk5bd&redirect_uri=http://localhost:8080'
      window.location.assign(URL)
    },
    logoutClick() {
      const URL = 'https://ggi-user-pool-2.auth.us-east-1.amazoncognito.com/logout?client_id=4ckq2pjka0nl64smcp2fnnk5bd&logout_uri=http://localhost:8080'
      window.location.assign(URL)
    },
    getJWT() {
      this.getQueryParams()
      if (this.auth2) {
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("client_id", "4ckq2pjka0nl64smcp2fnnk5bd");
        params.append("code", this.auth2);
        params.append("redirect_uri", 'http://localhost:8080');
        params.append("client_secret", '8ahqpl1ng5ag26kq64o358s0av1746e6o1qk0t924fj5khgrkcd')
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
        };
        axios
          .post(
            'https://ggi-user-pool-2.auth.us-east-1.amazoncognito.com/oauth2/token',
            params,
            { headers }
          ).then((response) => {
            console.log(response)
            this.userInfo = response.data;
            console.log("Access token: " + response.data.access_token)
            console.log("Refresh token: " + response.data.refresh_token)
          }).catch((error) => {
            console.log(error)
          })

      }

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
