from flask_login import UserMixin

from mongoengine import Document, fields

from werkzeug.security import generate_password_hash as make_hash

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
        
        def __str__(self):
            return self.__repr__()
    
        @classmethod
        def post_save(cls, sender, document, created):
            # Automatically hash passwords on User creation
            if created:
                document['password'] = make_hash(document['password'])
                document.save()

    return User
