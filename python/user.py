from flask_login import UserMixin

import mongoengine

from mongoengine import Document, fields

from werkzeug.security import generate_password_hash as make_hash

class User(mongoengine.Document, UserMixin):
    meta = {'collection': 'user'}
    username  = mongoengine.fields.StringField(
        required=True,
        unique=True,
    )
    password  = mongoengine.fields.StringField(required=True)
    roles     = mongoengine.fields.StringField(default='')
    hits      = mongoengine.fields.LongField(default=0)
    is_active = mongoengine.fields.BooleanField(default=True)

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
            document['password'] = make_hash(
                document['password']
            )
            document.save()

mongoengine.signals.post_save.connect(
    User.post_save, sender=User
)
