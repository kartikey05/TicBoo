import SearchPage from "./components/search.js"
import LoginPage from "./components/login.js"
import adminlogin from "./components/adminlogin.js"
import SignupPage from "./components/signup.js"
import FeedPage from "./components/feed.js"
import Venue from "./components/Venue.js"
import Show from "./components/Show.js"
import adminpage from "./components/adminpage.js"
import Details from "./components/Details.js"
import Bookingpage from "./components/Bookingpage.js"
import HomePage from "./components/home.js"
import editVenue from "./components/editVenue.js"
import editShow from "./components/editShow.js"
import addShows from "./components/addShows.js"
import profilee from "./components/profilee.js"
import addVenue from "./components/addVenue.js"


const routes = [
    {
        path: '/', component: FeedPage, meta: {
            requiresAuth: true
        }
    },
    { path: '/login', component: LoginPage },
    { path: '/adminlogin', component: adminlogin },
    { path: '/home', component: HomePage },
    { path: '/signup', component: SignupPage },
    {
        path: '/adminpage',name: 'adminpage', component: adminpage, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/feed',name: 'feed', component: FeedPage, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/addVenue',name: 'addVenue', component: addVenue, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/addShows',name: 'addShows', component: addShows, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/Venue',name: 'Venue', component: Venue, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/Show',name: 'Show', component: Show, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/editVenue/:venue_id',name: 'editVenue', props: true,component: editVenue, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/editShow/:show_id',name: 'editShow', props: true,component: editShow, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/profilee/:User_id',name: 'profilee', props: true,component: profilee, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/Details/:show_id',
        name: 'Details',props: true,
        component: Details, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/Bookingpage/:show_id/:User_id/:seats', component: Bookingpage, 
        props: true, meta: {
            requiresAuth: true
        }
    },    
    {
        path: '/search/:query',
        name: 'search',
        props: true, component: SearchPage, meta: {
            requiresAuth: true
        }
    },
]





const router = new VueRouter({
    routes: routes
})

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('auth_token')

    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
        next('/home')
    } else {
        next()
    }
})

export default router