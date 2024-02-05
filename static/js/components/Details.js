const Details = Vue.component("Details", {
    props: ['show_id'], // Declare the show_id prop

    data: function () {
        return {
            Shows: {},
            query: '',
            seats:"",
            User_id:''
        };
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
  <hr style="margin-top: 20px; margin-bottom: 20px;" >
 
  <div class="row">
  <div class="col-12">
    <div class="justify-content-center align-items-start text-center mb-3">
      <h1 class="p-2 align-self-start available-shows-heading">{{ Shows.show_name }}</h1>
    </div>

<!--CARD Code -->

<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-4 mb-3">
      <div class="card rectangle-card bg-light">
        <div class="card-body text-center">
          <h3 class="card-title text-primary">{{ Shows.show_name }}</h3>
          <h5 class="card-text">Venue Name: <span class="text-success">{{ Shows.venue.venue_name }}</span></h5>
          <h5 class="card-text">Tickets Available: <span class="text-success">{{ Shows.venue.capacity }}</span></h5>

          <h5 class="card-text">City Name: <span class="text-success">{{ Shows.venue.place }}</span></h5>
          <h5 class="card-text">Language: <span class="text-muted">{{ Shows.language }}<span>🗣</span></span></h5>
          <h5 class="card-text">Tags: <span class="text-success">{{ Shows.tags }}</span></h5>
          <h5 class="card-text">Price: <span class="text-success">{{ Shows.ticket_price }}<span class="text-success" >&#8377;</span></span></h5>
          <h5 class="card-text">Rating: <span class="text-success">{{ Shows.rating }}<span class="text-warning">&#9733;</span></span></h5>
          <hr class="cool-hr">
          <div style="margin-bottom: 1rem;">
          <input v-model="seats"  ref="seats"  type="text" id="seats" placeholder="Enter Tickets required" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
          </div>
          <hr class="cool-hr">
          <div class="text-center" style="padding: 0; margin-top: 1rem;">
          <button @click="Book" class="btn btn-lg btn-primary" style="padding: 0.5rem 1rem; font-size: 1rem; font-weight: bold;">Book</button>
          <button  @click="feed" class="btn btn-lg btn-outline-primary" style="padding: 0.5rem 1rem; font-size: 1rem; font-weight: bold; margin-left: 1rem;">Back</button>
  
          </div>
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
        this.grabShowDetails();
      },
    methods: {    
      feed(){
      window.location = `/?#/feed`;
    },
    Book(){
      window.location = `/?#/Bookingpage/${this.show_id}/${this.User_id}/${this.seats}`;
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
      grabShowDetails() {
        console.log("show_id:", this.show_id);
        var url = `/shows/${this.show_id}`; // Use this.show_id from the prop
        fetch(url, {
            headers: {
                'x-access-tokens': localStorage.getItem('auth_token'),

            },
        })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    this.Shows = data;
                    this.User_id = parseInt(localStorage.getItem('User_id'));
                    console.log("hiii",data);
                    console.log('User_id',this.User_id,typeof this.User_id)
                });
            }
        });
    },/*
        getFeed() {
            var url = "/shows/show_id"
            fetch(url, {
              headers: {
                'x-access-tokens': localStorage.getItem('auth_token')
              },
            })
              .then(response => {
                if (response.ok) {
                  response.json().then(data => {
                    this.Shows = data;
                    console.log("this is shows",this.Shows);
                    console.log(data)
                    
                  })
                }
              });
          }*/
    }
})

export default Details