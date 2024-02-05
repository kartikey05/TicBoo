const addShows = Vue.component("addShows", {
    data: function () {
        
      return {
        show_name:"",
        vid:"",
        rating:"",
        tags:"",
        ticket_price:"",
        language:"",
        date:""
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
        <h1 class="p-2 align-self-start available-shows-heading">Show Details</h1>
      </div>
  
  <!--CARD Code -->
  <div class="row">
    <div  Venues class="col-md-4 mb-3">
      <div class="card rectangle-card bg-light">
        <div class="card-body">
        <input v-model="show_name"  ref="show_name" type="text" id="show_name" placeholder="Enter  Show Name" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
        <input v-model="vid"  ref="vid" type="text" id="vid" placeholder="Enter  vid" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
        <input v-model="rating"  ref="rating" type="text" id="rating" placeholder="Enter  rating" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
        <input v-model="tags"  ref="tags" type="text" id="tags" placeholder="Enter  tags" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
        <input v-model="ticket_price"  ref="ticket_price" type="text" id="ticket_price" placeholder="Enter  Ticket Price" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
        <input v-model="language"  ref="language" type="text" id="language" placeholder="Enter  language" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
        <input v-model="date"  ref="date" type="text" id="date" placeholder="Enter  date" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">

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
              const url = `/shows`;
              const editedShow = {

                show_name:this.show_name,
                vid:this.vid,
                rating:this.rating,
                tags:this.tags,
                ticket_price:this.ticket_price,
                language:this.language,
                date:this.date
              };
              
              fetch(url, {
                method: 'POST',
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
  export default addShows