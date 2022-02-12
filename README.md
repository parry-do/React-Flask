## React+Flask on Repl.it

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces.

[Vite](https://vitejs.dev/) is a blazing fast frontend build tool with Hot Module Reloading (HMR), optimized builds, and TypeScript.

[Material UI](https://mui.com/core/) is a design language using grid-based layouts, responsive animations, padding, and depth effects such as lighting and shadows. 📑

[Flask](https://flask.palletsprojects.com/) is a bare-bones Python micro web framework based on Werkzeug, Jinja2, and good intentions.

[MongoDB](https://mongodb.com) is a NoSQL, document-oriented database using JSON-like documents with optional schemas.

These three are one of the fastest ways to build a web app with a powerful backend.

### Getting Started
- Hit run
- Edit [src/App.jsx](#src/App.jsx) and watch it live update!
- Edit main.py to change the backend
- Login through separate window:
  - Username: admin Password: admin
  - or
  - Username: user  Password: useruser
- (the Flask server may not connect as Replit doesn't allow listening ports etc. to be specified. Reset in shell with `busybox reboot`)

The default development server can be changed below.

### Development
The development server uses Vite to interpret React code live and is too slow to use in real time, but it makes building a new website easy.

### Production
The production server does not support live React and builds static HTML/JS like a real deployment using a gunicorn server.

To run the production server, change the first line in .replit:<br>
From: `run="bash development.sh"`  
To: `run="bash production.sh"`

### Deployment
Deployment tested on linode.com. I don't work for them, but they're developer owned and not a bookstore. Provision an Ubuntu LTS (Long-Term Support) node, ssh in, and run as root:

`git clone https://github.com/parry-do/React-Flask.git`

`bash React-Flask/scripts/configure.sh`

### Next
For real real world use you'll want Captcha protections, OAuth signin, and continuous integration as just a few other features to add next. This builds the backbone for a great webapp.

Change /python/db.py to alter the objects in the database and the initialize() function used to create a baseline database.

Change /scripts/options.json to edit developer contact information, administrative username/password, and other parameters.

### Inspiration

Directly inspired by [a previous React Repl](https://replit.com/@replit/Reactjs).

Deployment implementation patterned from [this article](https://www.digitalocean.com/community/tutorials/how-to-set-up-flask-with-mongodb-and-docker).
