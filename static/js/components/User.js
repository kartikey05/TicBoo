const AvailableShowsPage = Vue.component("User", {
    data: function() {
      return {
        availableShows: [
          {
            id: 1,
            venueName: "Example Venue",
            showName: "Example Show 1",
            ticketPrice: 20,
            location: "City A",
            date: "2023-08-10"
          },
          // Add more show objects here
        ],
        hoveredShowId: null
      };
    },
    template: `
      <div class="available-shows">
        <h2 class="text-center">Available Shows</h2>
        <div class="show-cards">
          <div
            v-for="show in availableShows"
            :key="show.id"
            class="show-card"
            :style="{ backgroundColor: hoveredShowId === show.id ? '#FFD700' : 'white' }"
            @mouseover="hoveredShowId = show.id"
            @mouseout="hoveredShowId = null"
            @click="navigateToBookingPage(show.id)"
          >
            <h3>{{ show.showName }}</h3>
            <p>Venue: {{ show.venueName }}</p>
            <p>Location: {{ show.location }}</p>
            <p>Date: {{ show.date }}</p>
            <p>Ticket Price: ${{ showticket_Price }}</p>
          </div>
        </div>
      </div>
    `,
    methods: {
      navigateToBookingPage(showId) {
        // Navigate to the booking page for the selected show using Vue Router
        this.$router.push(`/booking/${showId}`);
      }
    }
  });
  
  export default User;
  