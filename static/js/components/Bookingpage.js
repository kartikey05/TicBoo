const Bookingpage = Vue.component("Bookingpage", {
    props: ['show_id','User_id','seats'],

    data: function () {
        return {
            Shows: []
        }
    },

    template: `
    <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-4 mb-3">
        <div class="card rectangle-card bg-light">
          <div class="card-body text-center">
            <h1>ticket Booked Status</h1>
            <hr class="cool-hr">
            <h3>{{ Shows.message }} </h3>
            <div class="text-center" style="padding: 0; margin-top: 1rem;">    
            </div>
            <button  @click="feed" class="btn btn-lg btn-outline-primary" style="padding: 0.5rem 1rem; font-size: 1rem; font-weight: bold; margin-left: 1rem;">Main Page</button>
            <button @click="login" class="btn btn-lg btn-primary" style="padding:  0.5rem 1.5rem; font-size: 1rem; font-weight: bold;">Log In</button>

          </div>
        </div>
      </div>
    </div>
  </div>
    `,
    mounted() {
        this.Booking();
    },
    methods: {
        feed(){
            window.location = `/?#/feed`;
          },
        login(){
            window.location = `/?#/login`;
          },
        Booking() {
            console.log("show_id:", this.show_id);
            var url = `/book/${this.show_id}/${this.User_id}/${this.seats}`; // Use this.show_id from the prop
            fetch(url, {
                method: 'POST',
                headers: {
                    'x-access-tokens': localStorage.getItem('auth_token')
                },
            })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.Shows = data;
                        console.log("hiii",data);
                    });
                }
            });
        }
        },

})

export default Bookingpage