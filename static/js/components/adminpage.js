const adminpage = Vue.component("adminpage", {
    props: [],

    data: function () {
        return {
            
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
  <hr style="margin-top: 20px; margin-bottom: 20px;" >
 
  <div class="row">
  <div class="col-12">
    <div class="justify-content-center align-items-start text-center mb-3">
    </div>

    <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-4 mb-3">
        <div class="card rectangle-card bg-light">
          <div class="card-body text-center">
            <h1>Edit -  ADD - Delete</h1>
            <h3>Venues - Shows</h3>
            <hr class="cool-hr">
            <h3>             
            <button  @click="Venue" class="btn btn-lg btn-outline-primary" style="padding: 0.5rem 1rem; font-size: 1rem; font-weight: bold; margin-left: 1rem;">Venues</button>
            <button @click="Show" class="btn btn-lg btn-primary" style="padding:  0.5rem 1.5rem; font-size: 1rem; font-weight: bold;">Shows</button>
            </h3>
            <div class="text-center" style="padding: 0; margin-top: 1rem;">    
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
        
    },
    methods: {
        Venue(){
            window.location = `/?#/Venue`;
          },
          Show(){
            window.location = `/?#/Show`;
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
      }

        },

})

export default adminpage