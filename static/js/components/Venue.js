const Venue = Vue.component("Venue", {
    data: function () {
      return {
        Venues: [],
        showFollowers: true,
        query: ''
      }
    },
    template: `
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding-top: 30px;">
      <div class="row justify-content-between">
        <div class="col-auto">
          <h2 class="mb-0">Ticket Booking</h2>
        </div>
  
        <div class="col-auto">
          <div class="row justify-content-between align-items-center" style="display: flex;">
          <div class="col-sm-4 text-right">
            <button class="btn btn-danger" @click="logout()"
            style="background-color: #dc3545; border-color: #dc3545;">Logout</button>
            
          </div>
        </div>
      </div>
    </div>
    <hr class="cool-hr">
   
    <div class="row">
    <div class="col-12">
      <div class="justify-content-center align-items-start text-center mb-3">
        <h1 class="p-2 align-self-start available-shows-heading">Venues</h1>
      </div>
  
  <!--CARD Code -->
  <div class="row">
    <div v-for="(Venue, index) in Venues" :key="index" class="col-md-4 mb-3">
      <div class="card rectangle-card bg-light">
        <div class="card-body">
          <h3 class="card-title text-primary">{{ Venue.venue_name }}</h3>
          <h5 class="card-text">Language: <span class="text-muted">{{ Venue.place }}</span></h5>
          <h5 class="card-text">Rating: <span class="text-success">{{ Venue.capacity }}</span></h5>
          <hr class="cool-hr">
          <div class="text-center" style="padding: 0; margin-top: 1rem;">
          <button @click="Delete(Venue.venue_id)" class="btn btn-lg btn-primary" style="padding: 0.5rem 1.5rem; font-size: 1rem; font-weight: bold;">Delete</button>
          <button  @click="editVenue(Venue.venue_id)" class="btn btn-lg btn-outline-primary" style="padding: 0.5rem 1.5rem; font-size: 1rem; font-weight: bold; margin-left: 1rem;">Edit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr class="cool-hr">

<div class="d-flex justify-content-center">
  <button @click="addVenue" class="btn btn-lg btn-primary" style="padding: 0.5rem 1rem; font-size: 1rem; font-weight: bold;">Add Venue</button>
  <button  @click="Back" class="btn btn-lg btn-outline-primary" style="padding: 0.5rem 1.5rem; font-size: 1rem; font-weight: bold; margin-left: 1rem;">Back</button>

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
     Back(){
        window.location = `/?#/adminpage`
     },
      addVenue(){
        window.location = `/?#/addVenue`
      },
      Delete(venue_id) {
        var url = `/venue/${venue_id}`;
        
        fetch(url, {
          method: 'DELETE',
          headers: {
            'x-access-tokens': localStorage.getItem('auth_token')
          },
        })
        .then(response => {
          if (response.ok) {
            console.log(`Venue with ID ${venue_id} deleted successfully.`);
            window.location = `/?#/adminpage`
            // Perform any additional actions after deletion if needed
          } else {
            console.log(`Failed to delete venue with ID ${venue_id}. Status code: ${response.status}`);
          }
        })
        .catch(error => {
          console.error("An error occurred:", error);
        });
      },      


      editVenue(venue_id){
        window.location = `/?#/editVenue/${venue_id}`;
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
        var url = "/venue"
        fetch(url, {
          headers: {
            'x-access-tokens': localStorage.getItem('auth_token')
          },
        })
          .then(response => {
            if (response.ok) {
              response.json().then(data => {
                this.Venues = data;
                console.log("this is shows",this.Venues);
                console.log(data)
                
              })
            }
          });
      }
    },
  })
  
  export default Venue