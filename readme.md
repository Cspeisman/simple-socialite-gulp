# Simple Socialite
A silently failing, HTML tag-based abstraction API for [dbushell/socialite](https://github.com/dbushell/socialite)

---

## Getting started
Simple-Socialite is a Gulp build task.  Install a global version of Gulp before trying to build

    $ npm install -g gulp

Build your own and post assets to a server:

    $ npm install

    # twitter, facebook, and googleplus are already built into socialite
    # so there is no need to specificy those extensions in the build

Run the gulp command with an `--e` flag and whatever extensions to add as arguments

    $ gulp --e "hackernews github whatever other extensions"

Implement all your widgets in one single tag using the data attribute

  ```html
    <html>
        <head>
            <title>Test title for social buttons</title>
            <meta name="description" content="My description">
            <script src="path/to/jquery.min.js"></script>
            <script src="path/to/simple-socialite-pack.min.js"></script>
        </head>
        <body>
            <div class="share-buttons" data-socialite="auto" data-services="facebook-like,twitter-share,googleplus-one"></div>
        </body>
    </html>
  ```

---

### Running the example file:

Run the following commands from the root directy of this project

    $ gulp --e 'twitter-simple facebook-simple linkedin linkedin-simple googleplus-simple hackernews tumblr-simple'

    $ python -m SimpleHTTPServer

Then go to [http://localhost:8000/example/](http://localhost:8000/example/) and see all your assets built on the page