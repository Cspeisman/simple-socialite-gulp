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