## React+Flask on Repl.it

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces.

[Vite](https://vitejs.dev/) is a blazing fast frontend build tool with Hot Module Reloading (HMR), optimized builds, and TypeScript.

[Flask](https://flask.palletsprojects.com/) is a bare-bones Python micro web framework based on Werkzeug, Jinja2, and good intentions.

These three are one of the fastest ways to build a web app with a powerful backend.

### Getting Started
- Hit run
- Edit [src/App.jsx](#src/App.jsx) and watch it live update!
- Edit main.py to change the backend
- Using cookies, login must be done through a separate tab
  - Username: admin Password: admin
  - or
  - Username: user  Password: useruser

By default this runs a development server. Change that below.

### Development
The development server uses Vite to interpret React code live and is too slow to use in real time, but it makes building a new website easy.

### Production
The production server does not support live React and builds static HTML/JS like a real deployment using a gunicorn server.

To run the production server, change the first line in .replit:<br>
From: `run="bash development.sh"`  
To: `run="bash production.sh"`

### Deployment
Deployment tested on linode.com. I don't work for them, but they're developer owned and not a bookstore. Provision an Ubuntu LTS (Long-Term Support) node, ssh into the node, and run the following commands from root:

`git clone https://github.com/parry-do/React-Flask.git`

`bash React-Flask/configure.sh`

sudo nano /etc/config.json
{
	"SECRET_KEY": "1A37BbcCJh67",
	"DATABASE_URI": "sqlite:///site.db"
}

import json
with open('/etc/config.json') as config_file:
    config = json.load(config_file)
app.config['SECRET_KEY'] = config.get('SECRET_KEY')
app.config['DATABASE_URI'] = config.get('DATABASE_URI')

bash configure.sh "github clone url"

### Next
This isn't ready for use in the real world. Recaptcha protections, OAuth signins, and continuous integration as just a few other features that could be added and require specific tokens. This builds the backbone for a great webapp.

### Inspiration

Directly inspired by [a previous React Repl](https://replit.com/@replit/Reactjs).

Deployment implementation patterned from [this article](https://medium.com/@abalarin/flask-on-linode-a6d6ce2505d0).
