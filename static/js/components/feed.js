const FeedPage = Vue.component("feed", {
  data: function () {
    return {
      Shows: [],
      showFollowers: true,
      query: '',
      User_id:''
    }
  },
  template: `
  <div class="container" style="max-width: 1200px; margin: 0 auto; padding-top: 30px;">
  <div class="row justify-content-between align-items-center">
    <div class="col-auto">
      <h2 class="mb-0">Ticket Booking</h2>
    </div>
    <div class="col-auto">
      <button @click="profilee(User_id)" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-1 1c-1.097 0-2 .903-2 2v1a2 2 0 0 0 2 2 1 1 0 0 0 1 1h2a1 1 0 0 0 1-1 2 2 0 0 0 2-2v-1c0-1.097-.903-2-2-2H7zm1 7a4.978 4.978 0 0 1-2-.432 5.98 5.98 0 0 0 4 0A4.978 4.978 0 0 1 8 16z"/>
        </svg>
        Profile
      </button>

</div>

      <div class="col-auto">
        <div class="row justify-content-between align-items-center" style="display: flex;">
          <div class="col-sm-8" style="display: flex;">
            <input type="text" class="form-control" placeholder="Search" v-model="query"
              style="flex: 1; margin-right: 5px;">
            <button @click="search" type="submit" class="btn btn-primary" style="flex: 0;">Search</button>
          </div>
        <div class="col-sm-4 text-right">
          <button class="btn btn-danger" @click="logout()"
          style="background-color: #dc3545; border-color: #dc3545;">Logout</button>
        </div>
      </div>
    </div>
  </div>
  <hr class="cool-hr" style="margin-top: 20px; margin-bottom: 20px;" >
 
  <div class="row">
  <div class="col-12">
    <div class="justify-content-center align-items-start text-center mb-3">
      <h1 class="p-2 align-self-start available-shows-heading">World Wide Shows</h1>
    </div>

<!--CARD Code -->
<div class="row">
  <div v-for="(show, index) in Shows" :key="index" class="col-md-4 mb-3">
    <div class="card rectangle-card bg-light">
      <div class="card-body">
        <h3 class="card-title text-primary">{{ show.show_name }}</h3>
        <h5 class="card-text">Language: <span class="text-muted">{{ show.language }}</span></h5>
        <h5 class="card-text">Rating: <span class="text-success">{{ show.rating }}</span></h5>
        <h5 class="card-text">Type: <span class="text-success">{{ show.tags }} </span></h5>

        <hr class="cool-hr">
        <div class="text-center">
          <button @click="Details(show.id)" class="btn btn-lg btn-outline-primary" style="padding: 0.2rem 5rem; font-size: 1rem; font-weight: bold; margin-left: 1rem;">Details</button>
        </div>
      </div>
    </div>
  </div>
</div>


  </div>
</div>

</div>

    `,
    mounted() {
      this.getFeed();
      
    },
  methods: {
    /*getShows() {
      var url = '/shows';
      fetch(url, {
        headers: {
          'x-access-tokens': localStorage.getItem('auth_token')
        },
      })
      .then( res => res.blob())
      .then( blob => {
        saveAs(blob, 'download.csv') // Update Shows data property
      });
    },
    */
    search: function() {
      const query = this.query || 'all';

      window.location = `/?#/search/${query}`
    },
    profilee(User_id){
      window.location = `/?#/profilee/${this.User_id}`;
    },
    Details(show_id){
      window.location = `/?#/Details/${show_id}`;
    },
    logout() {
      new Promise((resolve, reject) => {
        try {
          localStorage.removeItem("auth_token");
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .then(() => {
        // Code to execute after the auth_token is set in local storage
        window.location = '/?#/home';
      })
    },
    getFeed() {
      var url = "/shows"
      fetch(url, {
        headers: {
          'x-access-tokens': localStorage.getItem('auth_token')
        },
      })
        .then(response => {
          if (response.ok) {
            response.json().then(data => {
              this.Shows = data;
              this.User_id = parseInt(localStorage.getItem('User_id'));
              console.log("this is User_id",this.User_id);
              console.log(data)
              
            })
          }
        });
    }
  },
})

export default FeedPage