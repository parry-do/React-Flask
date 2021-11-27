from flask_login import UserMixin

from mongoengine import Document, fields

def make_user_class(db):
    "Creates the User class per db provided"

    class User(Document, UserMixin):
        username = fields.StringField(
            required=True,
            unique=True,
        )
        password = fields.StringField(required=True)
        roles = fields.StringField(default='')
        hits = fields.LongField(default=0)
        is_active = fields.BooleanField(default=True)

        def get_id(self):
            return self.username

        def __repr__(self):
            return f"<User:{self.username} {self.password}>"

    return User
