# Deploy to Google App Engine

Google App Engine lets you build and run applications on Google’s infrastructure. App Engine applications are easy to create, easy to maintain, and easy to scale as your traffic and data storage needs change. 

## Create the project in the Developer Console

In [Google Developers Console](https://console.developers.google.com/project):

1. Create a new project
2. Take note of the project ID (e.g `algebraic-depot-114712`)

## Install Google Cloud SDK

See <https://cloud.google.com/sdk/>.

## Download source code

Download and extract [Web Starter Kit](https://github.com/google/web-starter-kit/releases/latest) to a local directory.

Create a new file in the root of your project called `app.yaml`. Paste the following contents into it:

```
application: algebraic-depot-114712
version: 0
runtime: php55
api_version: 1
threadsafe: false

handlers:
- url: /$
  static_files: index.html
  upload: index.html

- url: /(.*)
  static_files: \1
  upload: .*
```

This is a minimalist configuration for serving a Web Starter Kit project on App Engine. A more comprehensive one should you need it is available [here](https://github.com/h5bp/server-configs-gae/blob/master/app.yaml).

## Install web-starter-kit dependencies (e.g Node)

See <https://github.com/google/web-starter-kit/blob/master/docs/install.md>.

## Install local dependencies and generate assets

```
npm install
gulp 
````

## Deploy

````
cp app.yaml dist
cd dist
appcfg.py update . # "rm ~/.appcfg_oauth2_tokens" if error
````

If the update fails, check that your `application` in `app.yaml` matches the project id in the Developers Console.

If everything has worked, you will be able to see your fully deployed site at `<project ID>.appspot.com` (e.g `https://algebraic-depot-114712.appspot.com/`).

