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

def connect(app):
    # Connects the provided app to the database
    # Returns db (mongoengine) object and get_user function

    # Gathers keys from environment or config file
    def get_key(key, default=''):
        if os.environ.get(key):
            app.config[key] = os.environ.get(key)
        else:
            with open('scripts/options.json') as config_file:
                app.config[key] = json.load(config_file).get(
                    key, default
                )
    get_key('SECRET_KEY', 'KEEPITSECRETkeepitsafe')
    get_key('COOKIE_LIFESPAN', {'months': 12})

    mode = os.environ.get('MODE')
    if mode is None:
        mode == 'deployment'
    if mode=='deployment':
        # Deployment server, actual mongo db
        db = mongoengine

        db.connect(host=f"mongodb://{get_key('MONGODB_USERNAME')}:{get_key('MONGODB_PASSWORD')}@db:27017/flaskdb?authSource=admin")
        
        """
        db.connect(  # Deployment db server
            db       = 'flaskdb',
            username = get_key('MONGODB_USERNAME'),
            password = get_key('MONGODB_PASSWORD'),
            host     = 'db',
            port     = 27017,
        )
        """
    else:
        # Replit prod/dev, db by mongomock
        db = mongoengine
        db.connect("test", host="mongomock://localhost")

    # security system is initialized
    login_manager = login.LoginManager()
    login_manager.init_app(app)
    login_manager.user_loader(get_user)
    @login_manager.unauthorized_handler
    def unauthorized_handler():
        return 'Unauthorized'

    return db

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
