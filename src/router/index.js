import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import auth from '../app/auth';
import LogoutSuccess from '@/components/LogoutSuccess';
import UserInfoStore from '../app/userInfo';
import UserInfoApi from '../app/userInfoAPI';

Vue.use(Router)


function requireAuth(to, from, next) {
  
  if (!auth.auth.isUserSignedIn()) {
      UserInfoStore.setLoggedIn(false);
      next({
      path: '/login',
      query: { redirect: to.fullPath }
      });
  } else {
    UserInfoApi.getUserInfo().then(response => {
      UserInfoStore.setLoggedIn(true);
      UserInfoStore.setCognitoInfo(response);
      next();
    });
      
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      // beforeEnter: requireAuth
    },
    {
      path: '/login', beforeEnter(to, from, next){
        auth.auth.getSession();
      }
    },
    {
      path: '/login/oauth2/code/cognito', beforeEnter(to, from, next){
        var currUrl = window.location.href;
        
        console.log(currUrl);
        auth.auth.parseCognitoWebResponse(currUrl);
        //next();
      }
    },
    {
      path: '/logout', component: LogoutSuccess,  beforeEnter(to, from, next){
        auth.logout();
        next();
      }
    }
  ]
})
