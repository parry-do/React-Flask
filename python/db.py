import os
import json

from flask_login import UserMixin

from werkzeug.security import check_password_hash as check_hash
from werkzeug.security import generate_password_hash as make_hash

import mongoengine

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

class Global(mongoengine.Document):
        name  = mongoengine.fields.StringField(unique=True)
        total = mongoengine.fields.LongField(default=0)

# User getting function
def get_user(username, password=None):
    "Checks password if not None"
    try:
        user = User.objects.get(username=username)
    except mongoengine.DoesNotExist:
        return None
    
    if password is None:
        match = True
    else:
        match = check_hash(user['password'], password)
    return user if user and match else None

def initialize():
    # Database is initialized
    mode = os.environ.get('MODE') or 'deployment'
    if mode != 'deployment':
        print('*' * 10, 'Creating Dummy Database', '*' * 10)
        User(username='admin', password='admin').save()
        User(username='user', password='useruser').save()
    else:
        print('*' * 10, 'Creating Initial Database', '*' * 10)
        options_path = os.path.realpath(
            os.path.join(
                os.path.dirname(__file__),
                '..',
                'scripts',
                'options.json',
            )
        )
        with open(options_path, 'r') as f:
            options = json.load(f)
        # admin user is created from options
        User(
            username=options['ADMIN_USERNAME'],
            password=options['ADMIN_PASSWORD'],
        ).save()

    Global(name="Global Visits").save()
