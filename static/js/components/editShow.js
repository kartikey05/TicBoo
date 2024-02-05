const editShow = Vue.component("editShow", {
    props: ['show_id'],
    data: function () {
        
      return {
        show_name:'',
        ticket_price:'',
        date:''
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
        <h1 class="p-2 align-self-start available-shows-heading">Show</h1>
      </div>
  
  <!--CARD Code -->
  <div class="row">
    <div  Venues class="col-md-4 mb-3">
      <div class="card rectangle-card bg-light">
        <div class="card-body">
        <input v-model="venue_name"  ref="venue_name" type="text" id="venue_name" placeholder="Enter edited Show name" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
        <input v-model="ticket_price"  ref="ticket_price" type="text" id="ticket_price" placeholder="Enter edited ticket_price" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
        <input v-model="date"  ref="date" type="text" id="date" placeholder="Enter edited Date" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">


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
              const url = `/shows/${this.show_id}`;
              const editedShow = {
                show_name: this.venue_name,
                ticket_price: this.ticket_price,
                date: this.date
              };
              
              fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-tokens': localStorage.getItem('auth_token')
                },
                body: JSON.stringify(editedShow)
              })
              .then(response => {
                if (response.ok) {
                  console.log("Venue edited successfully");
                  window.location = `/?#/Show`
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
  export default editShow