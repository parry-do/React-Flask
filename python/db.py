import os
import json

import flask_login as login

from werkzeug.security import check_password_hash as check_hash

import mongoengine

from python.user import User

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

def initialize(db):
    # Database is initialized
    mode = os.environ.get('MODE')
    if mode is None:
        mode == 'deployment'
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
