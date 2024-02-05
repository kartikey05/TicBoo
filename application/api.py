from flask_restful import Resource, reqparse
from flask_restful import fields, marshal_with

from flask import jsonify, make_response, request, send_from_directory, send_file

from application.database import db
from application.models import User,Venue,Show,Booking
from application.validation import NotFoundError, BusinessValidationError, CustomError

from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import or_
#from flask_login import current_user

from app import app

import werkzeug

from werkzeug.utils import secure_filename

from functools import wraps
import uuid
import jwt

import os

import json

from datetime import datetime

from app import api

import base64

from application import tasks

output_fields = {
	"id" : fields.Integer,
	"username" : fields.String,
	"email" : fields.String,
}

create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument('username')
create_user_parser.add_argument('email')
create_user_parser.add_argument('password')

update_user_parser = reqparse.RequestParser()
update_user_parser.add_argument('email')


create_venue_parser = reqparse.RequestParser()
create_venue_parser.add_argument('venue_name')
create_venue_parser.add_argument('place')
create_venue_parser.add_argument('capacity')

update_venue_parser= reqparse.RequestParser()
update_venue_parser.add_argument('shows')
update_venue_parser.add_argument('venue_name')
update_venue_parser.add_argument('place')
update_venue_parser.add_argument('capacity')


create_show_parser = reqparse.RequestParser()
create_show_parser.add_argument('id')
create_show_parser.add_argument('show_name')
create_show_parser.add_argument('vid')
create_show_parser.add_argument('rating')
create_show_parser.add_argument('tags')
create_show_parser.add_argument('ticket_price')
create_show_parser.add_argument('language')
create_show_parser.add_argument('date')

update_show_parser= reqparse.RequestParser()
update_show_parser.add_argument('show_name')
update_show_parser.add_argument('vid')
update_show_parser.add_argument('ticket_price')
update_show_parser.add_argument('date')




output_fields_post = {
	'id': fields.Integer,
	'title': fields.String,
	'timestamp': fields.DateTime(dt_format='rfc822'),
}


def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
           token = request.headers['x-access-tokens']
 
        if not token:
           return jsonify({'message': 'a valid token is missing'})
        try:
           data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
           user = db.session.query(User).filter(User.id == int(data['public_id'])).first()

           current_user = {"id": user.id, "username": user.username, "password": user.password, "email": user.email}
        except:
           return jsonify({'message': 'token is invalid'})
 
        return f(current_user = current_user, *args, **kwargs)
   return decorator

def admin_token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
           token = request.headers['x-access-tokens']
 
        if not token:
           return jsonify({'message': 'a valid token is missing'})
        try:
           data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
           user = db.session.query(User).filter(User.id == int(data['public_id'])).first()
           if user.role_id != 1:
               return jsonify({'message': 'you are not an admin'})
           current_user = {"id": user.id, "username": user.username, "password": user.password, "email": user.email}
        except:
           return jsonify({'message': 'token is invalid'})
 
        return f(current_user = current_user, *args, **kwargs)
   return decorator

class LoginAPI(Resource):   
	def get(self, username, password):
		# Getting the User from the database based on the username
		user = None
		if '@' in username:
			user = db.session.query(User).filter(User.email == username).first()
		else:
			user = db.session.query(User).filter(User.username == username).first()

		if user:
			if check_password_hash(user.password, password):
			# return a valid user JSON
			# 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=45)
				# return "OK", 200
				token = jwt.encode({'public_id' : user.id, }, app.config['SECRET_KEY'], "HS256")
                
				return jsonify({'token' : token,'role_id': user.role_id,'User_id' : user.id})
			else:
			# return 404 error
				raise BusinessValidationError(status_code=404, error_code="BE102", error_message="Incorrect password!")
		else:
			raise BusinessValidationError(status_code=404, error_code="BE101", error_message="User not found!")

class UserAPI(Resource):
	def post(self):
		args = create_user_parser.parse_args()
		username = args.get("username", None)
		email = args.get("email", None)
		password = args.get("password", None)

		if username is None:
			raise BusinessValidationError(status_code=400, error_code="BE1001", error_message="username is required")

		if email is None:
			raise BusinessValidationError(status_code=400, error_code="BE1002", error_message="email is required")

		if password is None:
			raise BusinessValidationError(status_code=400, error_code="BE1003", error_message="password is required")

		
		user1 = db.session.query(User).filter(User.username == username).first()

		user2 = db.session.query(User).filter(User.email == email).first()

		if user1:
			raise BusinessValidationError(status_code=400, error_code="BE105", error_message="Username already exists")

		if not '@' in email:
			raise BusinessValidationError(status_code=400, error_code="BE104", error_message="Invalid email")

		if user2:
			raise BusinessValidationError(status_code=400, error_code="BE106", error_message="Email already in use")

		new_user = User(username = username, email=email, password = generate_password_hash(password, method='sha256'))
		db.session.add(new_user)
		db.session.commit()
		return "", 201
"""
class VenueAPI(Resource):
    @token_required 
    def get(self, venue_id,current_user):
        # Get a specific venue by venue_id
        #venue = db.session.query(Venue).get(venue_id)
        venue = db.session.query(Venue).filter(Venue.venue_id == venue_id).first()
        if venue:
            return jsonify({
                'venue_id': venue.venue_id,
                'venue_name': venue.venue_name,
                'place': venue.place,
                'capacity': venue.capacity,
            })
        else:
            return jsonify({'message': 'Venue not found'}), 404
        
    @admin_token_required 
    def post(self,current_user):
        # Add a new venue
        args = create_venue_parser.parse_args()
        venue_name = args.get("venue_name", None)
        place = args.get("place", None)
        capacity = args.get("capacity", None)
        
        venue=Venue(venue_name=venue_name,place=place,capacity=capacity)
        
        db.session.add(venue)
        db.session.commit()
        return jsonify({'message': 'Venue added successfully'})
    @admin_token_required
    def put(self, venue_id,current_user):
        # Edit an existing venue by venue_id
        venue = db.session.query(Venue).filter(Venue.venue_id == venue_id).first()
        if not venue:
            return jsonify({'message': 'Venue not found'}), 404

        args = update_venue_parser.parse_args()
        venue_name = args.get("venue_name", None)
        place = args.get("place", None)
        capacity = args.get("capacity", None)
        shows=args.get("shows", None)
        
        db.session.commit()
        
        return jsonify({'message': 'Venue updated successfully'})
    
    @admin_token_required
    def delete(self, venue_id,current_user):
        # Delete a venue by venue_id
        venue = db.session.query(Venue).filter(Venue.venue_id == venue_id).first()
        if not venue:
            return jsonify({'message': 'Venue not found'}), 404

        db.session.delete(venue)
        db.session.commit()
        return jsonify({'message': 'Venue deleted successfully'})
"""
class VenueAPI(Resource):
    @token_required
    def get(self, current_user, venue_id=None):
        # Get a specific venue by venue_id
        if venue_id:
            venue = db.session.query(Venue).filter(Venue.venue_id == venue_id).first()
            if venue:
                return jsonify({
                    'venue_id': venue.venue_id,
                    'venue_name': venue.venue_name,
                    'place': venue.place,
                    'capacity': venue.capacity,
                })
            else:
                raise NotFoundError(status_code=404, error_code="VE1001", error_message="Venue not found")
        else:
            venues = db.session.query(Venue).all()
            venue_list = []
            for venue in venues:
                venue_list.append({
                    'venue_id': venue.venue_id,
                    'venue_name': venue.venue_name,
                    'place': venue.place,
                    'capacity': venue.capacity,
                    
                })
            return jsonify(venue_list)

    @admin_token_required
    def post(self, current_user):
        # Add a new venue
        args = create_venue_parser.parse_args()
        venue_name = args.get("venue_name", None)
        place = args.get("place", None)
        capacity = args.get("capacity", None)

        if not venue_name or not place or not capacity:
            raise BusinessValidationError(status_code=400, error_code="VE1002", error_message="All fields are required")

        venue = Venue(venue_name=venue_name, place=place, capacity=capacity)

        db.session.add(venue)
        db.session.commit()
        return jsonify({'message': 'Venue added successfully'})

    @admin_token_required
    def put(self, venue_id, current_user):
        # Edit an existing venue by venue_id
        venue = db.session.query(Venue).filter(Venue.venue_id == venue_id).first()
        if not venue:
            raise NotFoundError(status_code=404, error_code="VE1001", error_message="Venue not found")

        args = update_venue_parser.parse_args()
        venue_name = args.get("venue_name", None)
        place = args.get("place", None)
        capacity = args.get("capacity", None)

        if not venue_name or not place or not capacity:
            raise BusinessValidationError(status_code=400, error_code="VE1002", error_message="All fields are required")

        # Update venue attributes and commit changes
        venue.venue_name = venue_name
        venue.place = place
        venue.capacity = capacity
        db.session.commit()

        return jsonify({'message': 'Venue updated successfully'})

    @admin_token_required
    def delete(self, venue_id, current_user):
        # Delete a venue by venue_id
        venue = db.session.query(Venue).filter(Venue.venue_id == venue_id).first()
        if not venue:
            raise NotFoundError(status_code=404, error_code="VE1001", error_message="Venue not found")

        db.session.delete(venue)
        db.session.commit()
        return jsonify({'message': 'Venue deleted successfully'})
"""
class ShowAPI(Resource):
    @token_required
    def get(self,current_user, show_id=None):
        if show_id:
            # Get a specific show by show_id
            show = db.session.query(Show).filter(Show.id == show_id).first()
            if show:
                return jsonify({
                    #'id': show.id,
                    'show_name': show.show_name,
                    'rating'  : show.rating,
                    'ticket_price':show.ticket_price,
                    'language':show.language,
                    'venue': {
                        'venue_id': show.venue.venue_id,
                        'venue_name': show.venue.venue_name,
                        'place': show.venue.place,
                        'capacity': show.venue.capacity,
                    }
                })
                
            else:
                return jsonify({'message': 'Show not found'}), 404
        else:
            # Get all shows with their associated venues
            shows = db.session.query(Show).all()
            show_list = []
            for show in shows:
                show_list.append({
                    #'id': show.id,
                    'show_name': show.show_name,
                    'rating'  : show.rating,
                    'ticket_price':show.ticket_price,
                    'language':show.language,
                    'venue': {
                        'venue_id': show.venue.venue_id,
                        'venue_name': show.venue.venue_name,
                        'place': show.venue.place,
                        'capacity': show.venue.capacity,
                    }
                })
            return jsonify(show_list)
    @admin_token_required
    def post(self,current_user):
        # Add a new show
        #data = request.get_json()
        #venue_id = data.get('venue_id')
        #venue = db.session.query(Venue).get(venue_id)
        
        args = create_show_parser.parse_args()
        show_name = args.get("show_name", None)
        vid = args.get("vid", None)
        rating = args.get("rating", None)
        tags = args.get("tags", None)
        ticket_price = args.get("ticket_price", None)
        language = args.get("language", None)
        date = args.get("date", None)
        venue = db.session.query(Venue).filter(Venue.venue_id == vid).first()
        
        if not venue:
            return jsonify({'message': 'Venue not found'}), 404

        show=Show(show_name=show_name,vid=vid,rating=rating,tags=tags,ticket_price=ticket_price,language=language,date=date)
        db.session.add(show)
        db.session.commit()
        return jsonify({'message': 'Show added successfully'})
    
    @admin_token_required 
    def put(self, show_id,current_user):
        # Edit an existing show by show_id
        show = db.session.query(Show).filter(Show.id == show_id).first()
        if not show:
            return jsonify({'message': 'Show not found'}), 404
        args = update_show_parser.parse_args()
        show_name = args.get("show_name", None)
        ticket_price = args.get("ticket_price", None)
        date = args.get("date", None)
        vid=args.get("vid", None)
        if vid:
            venue = db.session.query(Venue).filter(Venue.venue_id == vid).first()
            if not venue:
                return jsonify({'message': 'Venue not found'}), 404
            show.venue = venue
        db.session.commit()
        return jsonify({'message': 'Show updated successfully'})
    
    
    
    @admin_token_required
    def delete(self, show_id,current_user):
        # Delete a show by show_id
        show = db.session.query(Show).get(show_id)
        if not show:
            return jsonify({'message': 'Show not found'}), 404

        # Remove the association between the show and the venue by setting vid to None
        venue = db.session.query(Venue).get(show.vid)
        if venue:
            venue.id = None
            db.session.commit()

        # Delete the show from the Show table
        db.session.delete(show)
        db.session.commit()
        return jsonify({'message': 'Show deleted successfully'})
        return jsonify({'message': 'Show deleted successfully'})
"""


        
"""
        data = request.get_json()
        venue = Venue(
            venue_name=data['venue_name'],
            place=data['place'],
            capacity=data['capacity']
        )
        session.add(venue)
        session.commit()
        return jsonify({'message': 'Venue added successfully'})
    """
"""    
class BookShowAPI(Resource):
    @token_required
    def post(self, show_id, user_id, tickets,current_user):
        # Fetch the show and venue from the database
        # Assuming you have a Show model as well
        show = Show.query.get(show_id)
        venue = Venue.query.get(show.vid)

        if not show:
            return jsonify({'message': 'Show not found!'}), 404

        if venue.capacity < tickets:
            return jsonify({'message': 'Not enough tickets available!'}), 400

        # Update the venue capacity and save the booking information
        venue.capacity -= tickets
        db.session.add(show)
        db.session.add(venue)
        db.session.commit()

        # Save the booking information in your Booking model
        # Assuming you have a Booking model to store the bookings
        booking = Booking(user_id=user_id,venue_id=venue.venue_id ,show_id=show_id, tickets=tickets)
        db.session.add(booking)
        db.session.commit()

        return jsonify({'message': 'Show booked successfully!'})


class ShowsInVenueAPI(Resource):
    def get(self, venue_id):
        # Fetch all shows in the specified venue
        shows = Show.query.filter_by(vid=venue_id).all()

        if not shows:
            return jsonify({'message': 'No shows found for this venue'}), 404

        show_list = []
        for show in shows:
            show_info = {
                'show_id': show.id,
                'show_name': show.show_name,
                'rating': show.rating,
                'tags': show.tags,
                'ticket_price': show.ticket_price,
                'language': show.language,
                'date': show.date
            }
            show_list.append(show_info)

        return jsonify({'venue_id': venue_id, 'shows': show_list})
"""

class ShowAPI(Resource):
    @token_required
    def get(self, current_user, show_id=None):
        if show_id:
            show = db.session.query(Show).filter(Show.id == show_id).first()
            if show:
                return jsonify({
                    "id":show.id,
                    'show_name': show.show_name,
                    'rating': show.rating,
                    'ticket_price': show.ticket_price,
                    'language': show.language,
                    "tags":show.tags,
                    "date":show.date,
                    'venue': {
                        'venue_id': show.venue.venue_id,
                        'venue_name': show.venue.venue_name,
                        'place': show.venue.place,
                        'capacity': show.venue.capacity,
                    }
                })
            else:
                raise NotFoundError(status_code=404, error_code="SE1001", error_message="Show not found")
        else:
            shows = db.session.query(Show).all()
            show_list = []
            for show in shows:
                show_list.append({
                    "id":show.id,
                    'show_name': show.show_name,
                    'rating': show.rating,
                    'ticket_price': show.ticket_price,
                    'language': show.language,
                    "tags":show.tags,
                    "date":show.date,
                    'venue': {
                        'venue_id': show.venue.venue_id,
                        'venue_name': show.venue.venue_name,
                        'place': show.venue.place,
                        'capacity': show.venue.capacity,
                    }
                })
            return jsonify(show_list)

    @admin_token_required
    def post(self, current_user):
        args = create_show_parser.parse_args()
        show_name = args.get("show_name", None)
        vid = args.get("vid", None)
        rating = args.get("rating", None)
        tags = args.get("tags", None)
        ticket_price = args.get("ticket_price", None)
        language = args.get("language", None)
        date = args.get("date", None)

        if not show_name or not vid or not rating or not ticket_price or not language or not date:
            raise BusinessValidationError(status_code=400, error_code="SE1002", error_message="All fields are required")

        venue = db.session.query(Venue).filter(Venue.venue_id == vid).first()
        if not venue:
            raise NotFoundError(status_code=404, error_code="VE1001", error_message="Venue not found")

        show = Show(show_name=show_name, vid=vid, rating=rating, tags=tags, ticket_price=ticket_price, language=language, date=date)
        db.session.add(show)
        db.session.commit()
        return jsonify({'message': 'Show added successfully'})

    @admin_token_required
    def put(self, show_id, current_user):
        show = db.session.query(Show).filter(Show.id == show_id).first()
        if not show:
            raise NotFoundError(status_code=404, error_code="SE1001", error_message="Show not found")

        args = update_show_parser.parse_args()
        show_name = args.get("show_name", None)
        ticket_price = args.get("ticket_price", None)
        date = args.get("date", None)
        vid = args.get("vid", None)

        if not vid:
            # Handle other field updates here
            if show_name or ticket_price or date:
                # At least one field other than venue is being updated
                if show_name:
                    show.show_name = show_name
                if ticket_price:
                    show.ticket_price = ticket_price
                if date:
                    show.date = date
                db.session.commit()
                return jsonify({'message': 'Show updated successfully'})
            else:
                raise BusinessValidationError(status_code=400, error_code="SE1004", error_message="No valid fields to update")
        venue = db.session.query(Venue).filter(Venue.venue_id == vid).first()
        if not venue:
            raise NotFoundError(status_code=404, error_code="VE1001", error_message="Venue not found")

        show.venue = venue
        db.session.commit()

        return jsonify({'message': 'Show updated successfully'})

    @admin_token_required
    def delete(self, show_id, current_user):
        show = db.session.query(Show).get(show_id)
        if not show:
            raise NotFoundError(status_code=404, error_code="SE1001", error_message="Show not found")

        venue = db.session.query(Venue).get(show.vid)
        if venue:
            venue.id = None
            db.session.commit()

        db.session.delete(show)
        db.session.commit()
        return jsonify({'message': 'Show deleted successfully'})


class BookShowAPI(Resource):
    @token_required
    def post(self, show_id, user_id, tickets, current_user):
        show = db.session.query(Show).get(show_id)
        venue = db.session.query(Venue).get(show.vid)

        if not show:
            raise NotFoundError(status_code=404, error_code="SE1001", error_message="Show not found")


        if venue.capacity < tickets:
            raise BusinessValidationError(status_code=400, error_code="SE1003", error_message="Not enough tickets available")

        venue.capacity -= tickets
        db.session.add(show)
        db.session.add(venue)
        db.session.commit()

        booking = Booking(  show_id=show_id,user_id=user_id, tickets=tickets)
        db.session.add(booking)
        db.session.commit()

        return jsonify({'message': 'Show booked successfully'})


class ShowsInVenueAPI(Resource):
    def get(self, venue_id):
        shows = Show.query.filter_by(vid=venue_id).all()

        if not shows:
            raise NotFoundError(status_code=404, error_code="VE1002", error_message="No shows found for this venue")

        show_list = []
        for show in shows:
            show_info = {
                'show_id': show.id,
                'show_name': show.show_name,
                'rating': show.rating,
                'tags': show.tags,
                'ticket_price': show.ticket_price,
                'language': show.language,
                'date': show.date
            }
            show_list.append(show_info)

        return jsonify({'venue_id': venue_id, 'shows': show_list})



class SearchAPI(Resource):
    def get(self):
        search_query = request.args.get('q', '')

        shows = Show.query.filter(or_(
            Show.show_name.ilike(f'%{search_query}%'),
            Show.tags.ilike(f'%{search_query}%'),
            Show.date.ilike(f'%{search_query}%'),
            Show.language.ilike(f'%{search_query}%'),
            Show.ticket_price.ilike(f'%{search_query}%'),
        )).all()

        venues = Venue.query.filter(or_(
            Venue.place.ilike(f'%{search_query}%')
        )).all()

        results = {
            'shows': [{
                'show_id': show.id,
                'show_name': show.show_name,
                'tags': show.tags,
                'date': show.date,
                'language': show.language,
                'ticket_price': show.ticket_price,
                'rating': show.rating

            } for show in shows],
            'venues': [{
                'venue_id': venue.venue_id,
                'venue_name': venue.venue_name,
                'place': venue.place
            } for venue in venues]
        }

        return results


class getuserbookings(Resource):
    @token_required
    def get(self,user_id ,current_user):
        user_bookings = Booking.query.filter_by(user_id=user_id).all()
        bookings = []
        for booking in user_bookings:
            show_name = booking.show.show_name  # Get show name from associated Show record
            bookings.append({
                "id": booking.id,
                "user_id": booking.user_id,
                "show_id": booking.show_id,
                "show_name": show_name,
                "tickets": booking.tickets,
                "date":booking.show.date
                # Add more fields as needed
            })
        return jsonify(bookings)