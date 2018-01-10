/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!"
    };
  },
  created: function() {},
  methods: {},
  computed: {}
};

var EditPage = {
  template: "#edit-page",
  data: function() {
    return {
      student: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        short_bio: "",
        linkedin_url: "",
        twitter_handle: "",
        personal_blog_url: "",
        online_resume_url: "",
        github_url: "",
        photo: "",
        password: "",
        passwordConfirmation: ""
      },
      errors: []
    };
  },
  created: function() {
    axios.get("/v1/students").then(
      function(response) {
        this.student = response.data;
      }.bind(this)
    );
  },
  methods: {
    submit: function() {
      var params = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        phone_number: this.phone_number,
        short_bio: this.short_bio,
        linkedin_url: this.linkedin_url,
        twitter_handle: this.twitter_handle,
        personal_blog_url: this.personal_blog_url,
        online_resume_url: this.online_resume_url,
        github_url: this.github_url,
        photo: this.photo,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .path("/v1/students", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var ShowPage = {
  template: "#show-page",
  data: function() {
    return {
      student: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        short_bio: "",
        linkedin_url: "",
        twitter_handle: "",
        personal_blog_url: "",
        online_resume_url: "",
        github_url: "",
        photo: ""
      },
      errors: []
    };
  },
  created: function() {
    axios.get("/v1/students").then(
      function(response) {
        this.student = response.data;
      }.bind(this)
    );
  },
  methods: {}
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};

var LogoutPage = {
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/show", component: ShowPage },
    { path: "/edit", component: EditPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});
