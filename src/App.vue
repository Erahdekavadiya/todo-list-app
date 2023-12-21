<!-- App.vue -->
<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Todo App - Er A H Dekavadiya</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" text v-if="isLoggedIn">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <TodoList v-if="isLoggedIn" :isLoggedIn="isLoggedIn" @childMethodTrigger="handleChildMethod"/>
      <v-container v-else>
        <v-row justify="center">
          <v-col cols="12" sm="6" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login Now</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field v-model="username" label="Username" outlined placeholder="demo"></v-text-field>
                  <v-text-field v-model="password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" label="Password" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" outlined placeholder="demo@123"></v-text-field>
                  <v-btn type="submit" color="primary" block>Login</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" >
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false; snackbarText = ''">
            Close
        </v-btn>
        </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import TodoList from './components/TodoList.vue';
import AuthService from '@/services/AuthService';
export default {
  data() {
    return {
      isLoggedIn: false,
      username: '',
      password: '',
      showPassword: false,
      snackbar: false,
      snackbarText: '',
      snackbarTimeout: 2000,
    };
  },
  components: {
    TodoList,
  },
  methods: {
    logout(){
      AuthService.logout();
      this.isLoggedIn = false;
    },
    login() {
      if (AuthService.login(this.username, this.password)) {
        this.isLoggedIn = true;
      } else {
        this.snackbarText = "Invalid username or password!";
        this.snackbar = true;
      }
    },
    handleChildMethod(data) {
      this.snackbarText = data.text;
      this.snackbar = data.status;
    },
  },
  created() {
    if (AuthService.isLoggedIn()) {
      this.isLoggedIn = AuthService.isLoggedIn();
    }
  },
};
</script>
