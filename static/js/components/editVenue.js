const editVenue = Vue.component("editVenue", {
    props: ['venue_id'],
    data: function () {
        
      return {
        venue_name:'',
        place:'',
        capacity:''
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
        <h1 class="p-2 align-self-start available-shows-heading">Venues</h1>
      </div>
  
  <!--CARD Code -->
  <div class="row">
    <div  Venues class="col-md-4 mb-3">
      <div class="card rectangle-card bg-light">
        <div class="card-body">
        <input v-model="venue_name"  ref="venue_name" type="text" id="venue_name" placeholder="Enter edited Venue name" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
        <input v-model="place"  ref="place" type="text" id="place" placeholder="Enter edited Venue place" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
        <input v-model="capacity"  ref="capacity" type="text" id="capacity" placeholder="Enter edited Venue capacity" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">


        <button @click="Submit" class="btn btn-lg btn-outline-primary" style="padding: 0.2rem 5rem; font-size: 1rem; font-weight: bold; margin-left: 1rem;">Submit</button>

          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center">
  <button  @click="Back" class="btn btn-lg btn-outline-primary" style="padding: 0.5rem 1.5rem; font-size: 1rem; font-weight: bold; margin-left: 1rem;">Back</button>
  </div>
  
    </div>
  </div>
  
  </div>
  
      `,

        methods: {
            Back(){
                window.location = `/?#/adminpage`
             },
            Submit() {
              const url = `/venue/${this.venue_id}`;
              const editedVenue = {
                venue_name: this.venue_name,
                place: this.place,
                capacity: this.capacity
              };
              
              fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-tokens': localStorage.getItem('auth_token')
                },
                body: JSON.stringify(editedVenue)
              })
              .then(response => {
                if (response.ok) {
                  console.log("Venue edited successfully");
                  window.location = `/?#/Venue`
                  // Perform additional actions after editing
                } else {
                  console.error("Failed to edit venue:", response.statusText);
                }
              })
              .catch(error => {
                console.error("An error occurred:", error);
              });
            }
          }
        });
  export default editVenue