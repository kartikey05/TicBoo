const SearchPage = Vue.component("search", {
  props: {
    query: {
      type: String,
      required: true
    }
  },

  data: function () {
    return {
      shows: [],
      loading: false,
      venues: [],
      seats: ''
    };
  },
  template: `
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-for="show in shows" :key="show.show_id">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-4 mb-3">
            <div class="card rectangle-card bg-light">
              <div class="card-body text-center">
                <h3 class="card-title text-primary">{{ show.show_name }}</h3>
                <h5 class="card-text">Language: <span class="text-muted">{{ show.language }}<span>🗣</span></span></h5>
                <h5 class="card-text">Tags: <span class="text-success">{{ show.tags }}</span></h5>
                <h5 class="card-text">Price: <span class="text-success">{{ show.ticket_price }}<span class="text-success" >&#8377;</span></span></h5>
                <h5 class="card-text">Rating: <span class="text-success">{{ show.rating }}<span class="text-warning">&#9733;</span></span></h5>
                <h5 class="card-text">Date: <span class="text-success">{{ show.date }}</span></h5>
                <hr class="cool-hr">
                <div style="margin-bottom: 1rem;">
                  <input v-model="seats" ref="seats" type="text" id="seats" placeholder="Enter Tickets required" style="width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; border-radius: 4px;">
                </div>
                <hr class="cool-hr">
                <div class="text-center" style="padding: 0; margin-top: 1rem;">
                  <button @click="Book(show)" class="btn btn-lg btn-primary" style="padding: 0.5rem 1rem; font-size: 1rem; font-weight: bold;">Book</button>
                  <button @click="feed" class="btn btn-lg btn-outline-primary" style="padding: 0.5rem 1rem; font-size: 1rem; font-weight: bold; margin-left: 1rem;">Back</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-for="venue in venues" :key="venue.venue_id">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-4 mb-3">
            <div class="card rectangle-card bg-light">
              <div class="card-body text-center">
                <h3 class="card-title text-primary">{{ venue.venue_name }}</h3>
                <h5 class="card-text">Location: <span class="text-muted">{{ venue.place }}</span></h5>

                <hr class="cool-hr">
                <div class="text-center" style="padding: 0; margin-top: 1rem;">
                  <button @click="feed" class="btn btn-lg btn-outline-primary" style="padding: 0.5rem 1rem; font-size: 1rem; font-weight: bold;">Back</button>
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
    this.search();
  },
  methods: {
    feed() {
      window.location = `/?#/feed`;
    },
    Book(show) {
      window.location = `/?#/Bookingpage/${show.show_id}/${this.seats}`;
    },
    search() {
      this.loading = true;
      fetch(`/search?q=${this.query}`)
        .then(response => response.json())
        .then(data => {
          this.shows = data.shows.filter(
            show =>
              show.show_name.toLowerCase().includes(this.query.toLowerCase()) ||
              show.tags.toLowerCase().includes(this.query.toLowerCase()) ||
              show.rating == parseInt(this.query)
          );
          this.venues = data.venues.filter(venue =>
            venue.venue_name.toLowerCase().includes(this.query.toLowerCase()) ||
            venue.place.toLowerCase().includes(this.query.toLowerCase()) 
          );
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          this.loading = false;
        });
    }
  }
});

export default SearchPage;
