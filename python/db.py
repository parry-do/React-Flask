import os
import json

import flask_login as login

from werkzeug.security import check_password_hash as check_hash

import mongoengine

from python.user import make_user_class


def connect(app):
    # Prepares app with database, security, and CORS services

    # Gathers keys from environment or config file
    def get_key(key, default=''):
        if os.environ.get(key):
            app.config[key] = os.environ.get(key)
        else:
            with open('flask.config.json') as config_file:
                app.config[key] = json.load(config_file).get(key, default)

    get_key('SECRET_KEY', 'KEEPITSECRETkeepitsafe')
    get_key('COOKIE_LIFESPAN', {'months': 12})

    mode = os.environ.get('MODE')
    if mode is None:
        # Deployment server, actual mongo db
        mode = 'deployment'
        # TODO: get this figured out
        db = mongoengine
        db.connect("test", host="mydatabase", port=27017)
    else:
        # Replit prod/dev, db by mongomock
        db = mongoengine
        db.connect("test", host="mongomock://localhost")

    # User class prepared
    User = make_user_class(db)
    mongoengine.signals.post_save.connect(User.post_save, sender=User)
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

    # security system is initialized
    login_manager = login.LoginManager()
    login_manager.init_app(app)
    login_manager.user_loader(get_user)

    @login_manager.unauthorized_handler
    def unauthorized_handler():
        return 'Unauthorized'

    if mode != 'deployment':
        print('*' * 10, 'Creating Dummy Database', '*' * 10)
        User(username='admin', password='admin').save()
        User(username='user', password='useruser').save()

    class Global(mongoengine.Document):
        name  = mongoengine.fields.StringField(unique=True)
        total = mongoengine.fields.LongField(default=0)

    Global(name="Global Visits").save()

    return db, User, Global, get_user
