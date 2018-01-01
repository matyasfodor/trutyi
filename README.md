# Trutyi

A browser extension and a backend service for instantly adding words from google translate to your quizlet sets.

## Features

- Browser extension:
  * Log into Quizlet with the extension background page
  * List sets created by a user
  * Select the set (which will be used by the project)
  * Add new entries in google translate with a single click.
  
- Backend service:
  * Hosted on Heroku
  * Basically a proxy, because Quizlet checks the origin of the request.
  * Does not store any user information

## How to Use

The extension is not published yet. The easiest way to try it is to
- Clone the project
- Go to chrome://extensions/ and click "Load unpacked extension"
- Select trutyiExtension in your file browser

## Note

This project is in a very early stage, use it on your own risk. Issues / contribution doc will be added.

## License: GLP-3.0
