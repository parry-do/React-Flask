import os
from os.path import split, join
import shutil
import string
import random
import json
import subprocess

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

# The options dictionary is created
with open('scripts/options.json', 'r') as f:
    options = json.load(f)
import multiprocessing
chars = string.ascii_letters + string.digits
options.update({
    'SECRET_KEY' : ''.join(random.sample(chars,32)),
    'BASE_DIR'   : BASE_DIR,
    'DB_DATA'    : join(BASE_DIR, 'docker', 'db'),
    'NGINX_DATA' : join(BASE_DIR, 'docker', 'nginx'),
    'APP_DATA'   : join(BASE_DIR, 'docker', 'app'),
    'CPUS'       : 2* multiprocessing.cpu_count() + 1,
})

# Docker files are created with correct options
for path in ['app', 'nginx']:
    name = f'{path}.Dockerfile'
    with open(join(BASE_DIR,'scripts',name),'r') as f:
        with open(join(
                BASE_DIR, 'docker', path, 'Dockerfile'
        ),'w') as w:
            w.write(f.read().format(**options))

# Mongo init file is created with correct options
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
    BASE_DIR,'docker','db','mongo-init.js'),'w'
) as w:
    w.write(init_file)


# nginx configuration is copied
os.mkdir(join(BASE_DIR, 'docker', 'nginx', 'conf.d'))
shutil.copy(
    join(BASE_DIR, 'scripts', 'main.conf'),
    join(BASE_DIR, 'docker', 'nginx', 'conf.d'),
)

##############################################
# Docker implemented
##############################################
os.chdir(join(BASE_DIR, 'docker'))

def subprocessicate(command, comment="Initiating"):
    p=subprocess.Popen(
        command,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    print(comment)

    minsec = lambda s: f'{s//60:.0f}min {s%60:.0f}sec'

    def monitor(timeout=0):
        try:
            p.wait(5)
            print(f"  Total Time:{minsec(timeout)}")
            print()

        except subprocess.TimeoutExpired as e:
            print(f"  Time:{timeout+e.timeout:.1f}")
            monitor(timeout+e.timeout)

subprocessicate(
    ["docker-compose", "up", "-d"],
    "Creating Docker Containers",
)

subprocessicate(
    ["sudo" "systemctl" "enable" "docker"],
    "Setting Docker To Start on Startup"
)

##############################################
# Other systems are implemented
##############################################


