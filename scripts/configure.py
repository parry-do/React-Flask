import os
from os.path import split, join
import shutil
from distutils.dir_util import copy_tree
import string
import random
import json

##############################################
# Establish correct working directories
##############################################
BASE_DIR = split(
    os.path.dirname(
        os.path.realpath(__file__)
    )
)[0]
os.chdir(BASE_DIR)

for path in [[], ['db'], ['nginx'], ['app']]:
    try:
        os.mkdir(join(BASE_DIR, 'docker', *path))
    except OSError as e:
        import errno
        if e.errno != errno.EEXIST:
            raise
        pass

##############################################
# Files are loaded into /docker
##############################################

##############################################
# The options dictionary is created
##############################################
import multiprocessing
chars = string.ascii_letters + string.digits
options = {
    'SECRET_KEY' : ''.join(random.sample(chars,32)),
    'BASE_DIR'   : BASE_DIR,
    'DB_DIR'     : join(BASE_DIR, 'docker', 'db'),
    'NGINX_DIR'  : join(BASE_DIR, 'docker', 'nginx'),
    'APP_DIR'    : join(BASE_DIR, 'docker', 'app'),
    'CPUS'       : 2* multiprocessing.cpu_count() + 1,
}
with open('scripts/options.json', 'r') as f:
    options.update(json.load(f))

###############################################
# Docker files are created with correct options
###############################################
for path in ['app', 'nginx']:
    name = f'{path}.Dockerfile'
    with open(join(BASE_DIR,'scripts',name),'r') as f:
        with open(join(
                BASE_DIR, 'docker', path, 'Dockerfile'
        ),'w') as w:
            w.write(f.read().format(**options))

#####################################################
# Docker-compose file is created with correct options
#####################################################
with open(join(BASE_DIR,'scripts','docker-compose.yml'),'r') as f:
    with open(
        join(BASE_DIR,'docker','docker-compose.yml'),'w'
    ) as w:
        w.write(f.read().format(**options))

#####################################################
# Mongo init file is created with correct options
#####################################################
init_file = """db.createUser({{
    'user' : '{MONGODB_USERNAME}',
    'pwd'  : '{MONGODB_PASSWORD}',
    'roles': [
        {{
            'role' : 'readWrite',
            'db'   : 'flaskdb',
        }},
    ],
}});
""".format(**options)

with open(join(
    BASE_DIR,'docker','db','init.js'),'w'
) as w:
    w.write(init_file)

#####################################################
# nginx configuration is copied
#####################################################
os.mkdir(join(BASE_DIR, 'docker', 'nginx', 'conf.d'))
shutil.copy(
    join(BASE_DIR, 'scripts', 'main.conf'),
    join(BASE_DIR, 'docker', 'nginx', 'conf.d'),
)

#####################################################
# app files are copied
#####################################################
targets = [
    'main.py', 'index.html', 'vite.config.js',
    'package.json', 'pyproject.toml',
]
for target in targets:
    shutil.copy(
        join(BASE_DIR, target),
        join(BASE_DIR, 'docker', 'app', target),
    )
targets = [
    'python', 'react', 'scripts',
]
for target in targets:
    copy_tree(
        join(BASE_DIR, target),
        join(BASE_DIR, 'docker', 'app', target),
    )

#####################################################
# wsgi file is created
#####################################################
wsgi_file="""from main import app

if __name__ == "__main__":
    app.run()
"""
with open(join(
    BASE_DIR,'docker','app','wsgi.py'),'w'
) as w:
    w.write(wsgi_file)
