const profilee = Vue.component("profilee", {
    props: ['User_id'],
    data: function() {
      return {
        bookings: []
          // Add more show objects here
      };
    },
    template: `
    <div>
    <div class="text-center">
    <h2>User Booking Details</h2>
  </div>
    <ul>
      <li v-for="booking in bookings" :key="booking.id">
        <p><strong>Show Name:</strong> {{ booking.show_name }}</p>
        <p><strong>Tickets:</strong> {{ booking.tickets }}</p>
        <p><strong>Date:</strong> {{ booking.date }}</p>

        <hr class="cool-hr">
      </li>
    </ul>
    <button  @click="Back" class="btn btn-lg btn-outline-primary" style="padding: 0.5rem 1.5rem; font-size: 1rem; font-weight: bold; margin-left: 1rem;">Back</button>

  </div>

    `,
    mounted() {
        this.fetchUserBookings();
      },
    methods: {   
        Back(){
      window.location = `/?#/feed`
   },

        fetchUserBookings() {
 // Replace with the actual user ID
            var url = `/user/bookings/${this.User_id}`;  // Use this.show_id from the prop
            fetch(url, {
                headers: {
                    'x-access-tokens': localStorage.getItem('auth_token'),
    
                },
            })        
            .then(response => {
              if (response.ok) {
                response.json().then(data => {
                  this.bookings = data;
                  console.log(data)
                  
                })
              }
            });
          }
    }
  });
  
  export default profilee;
  