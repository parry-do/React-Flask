from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, user_id, db, create=False, **kwargs):
        'Recalls or Creates user from string user_id in db'
        super().__init__()

        if not create:
            user = db.get('users', dict()).get(user_id, None)

            if user is None:
                raise ValueError('No such user')
            self.user_id        = user_id
            self.authenticated  = True
            self.active         = user['active']
            self.data           = user['data']
            self.password       = user['password']

        else:
            self.user_id        = user_id
            self.authenticated  = True
            self.active         = True
            self.data           = {
                k:v for k,v in kwargs.items()
                if k != 'password'
            }
            if not 'password' in kwargs:
                raise ValueError('Password required')
            else:
                self.password      = kwargs['password']
                        
            self.save(db)

    def save(self, db):
        'Saves the user in the provided document database'
        assert isinstance(self.user_id, str)
        assert isinstance(self.active, bool)

        db.get('users', dict())[self.user_id] = {
            'active'    : self.active,            
            'data'      : self.data,
            'password'  : self.password,
        }

    def is_authenticated(self):
        'User is currently authenticated? Transient to session.'
        return self.authenticated

    def is_active(self):
        'User is currently active? Persistent'
        return self.active

    def is_anonymous(self):
        'User is currently anonymous? Defaults to False'
        return False

    def get_id(self):
        'Alias for user_id property'
        return self.user_id
