/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Please login!"
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
    axios.get("https://salty-ridge-97861.herokuapp.com/v1/students").then(
      function(response) {
        this.student = response.data[0]; // Change once rails back end params search route is created
      }.bind(this)
    );
  },
  methods: {
    submit: function() {
      var params = {
        first_name: this.student.first_name,
        last_name: this.student.last_name,
        email: this.student.email,
        phone_number: this.student.phone_number,
        short_bio: this.student.short_bio,
        linkedin_url: this.student.linkedin_url,
        twitter_handle: this.student.twitter_handle,
        personal_blog_url: this.student.personal_blog_url,
        online_resume_url: this.student.online_resume_url,
        github_url: this.student.github_url,
        photo: this.student.photo,
        password: this.student.password,
        password_confirmation: this.student.passwordConfirmation
      };
      axios
        .path("https://salty-ridge-97861.herokuapp.com/v1/students", params)
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
        first_name: "Chappy",
        last_name: "Mark",
        email: "cheekymark@email.com",
        phone_number: "312-213-3433",
        short_bio:
          "I'm a cheeky chap from England and struggles with american day to day living.",
        linkedin_url: "https://www.linkedin.com./in/KingOfChaps",
        twitter_handle: "@ChappyCheeks",
        personal_blog_url: "https://www.markschappycheeks.com",
        online_resume_url: "https://www.idk-cheeks.com",
        github_url: "https://www.github.com/markschappycheeks",
        photo:
          "http://www.haverigg.cumbria.sch.uk/images/library/Logos/cheekymonkey[1].jpg"
      },
      errors: []
    };
  },
  created: function() {
    axios.get("https://salty-ridge-97861.herokuapp.com/v1/students").then(
      function(response) {
        this.student = response.data[0]; // Change once rails back end params search route is created
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
        .post("https://salty-ridge-97861.herokuapp.com/student_token", params)
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
