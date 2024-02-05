from application.database import db
from flask_login import UserMixin
from sqlalchemy.orm import relationship
from datetime import datetime


# Define a User model
class User(db.Model, UserMixin):
    __tablename__ = 'User'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String(150))
    email = db.Column(db.String, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role_id=db.Column(db.Integer,db.ForeignKey('Role.id'))

    def __repr__(self):
        return f"User({self.username}, {self.email})"

class Role(db.Model, UserMixin):
    __tablename__ = 'Role'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False,)
    
class Venue(db.Model):
    __tablename__ = 'Venue'
    venue_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    venue_name = db.Column(db.String(150))
    place = db.Column(db.String(150))
    capacity = db.Column(db.Integer)
    shows = db.relationship('Show', backref='venue', cascade='all, delete-orphan')


class Show(db.Model):
    __tablename__ = 'Show'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    show_name = db.Column(db.String(150))
    vid = db.Column(db.Integer, db.ForeignKey('Venue.venue_id',ondelete='CASCADE'))
    rating = db.Column(db.Integer)
    tags = db.Column(db.String(25))
    ticket_price = db.Column(db.Integer)
    language = db.Column(db.String(25))
    date = db.Column(db.String(25))

class Booking(db.Model):
    __tablename__ = 'Booking'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer,  nullable=False)
    show_id = db.Column(db.Integer, db.ForeignKey('Show.id'), nullable=False)
    #venue_id = db.Column(db.Integer, db.ForeignKey('Venue.venue_id'), nullable=False)
    tickets = db.Column(db.Integer, nullable=False)
    show = db.relationship('Show', backref='bookings')
    def __repr__(self):
        return f"Booking( Show ID: {self.show_id}, Tickets: {self.tickets})"
