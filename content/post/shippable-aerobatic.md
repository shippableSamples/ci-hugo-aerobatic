+++
date = "2017-03-23T21:34:22-07:00"
title = "Deploy a Hugo Site to Aerobatic with Shippable"
draft = false

+++

*This is a guest post written by [Jason Gowans](https://twitter.com/jasongowans), Co-Founder of Aerobatic.* 

[Aerobatic](https://www.aerobatic.com/) is a web publishing service built specifically for static generators and modern web apps. Using the Aerobatic Command Line Interface (CLI), front-end developers can deploy their sites to the Aerobatic Global Content Delivery Network (CDN) in a matter of seconds.

The workflow becomes even more powerful and convenient when Aerobatic is combined with a Continuous Integration (CI) tool such as [Shippable](https://twitter.com/jasongowans). In this scenario, developers can host their static generator site on any version control service, such as GitHub, Bitbucket, or Gitlab, and using Shippable, build the site, and then deploy to Aerobatic.

The advantage of this approach is that you no longer need to build your site on your local machine. In fact, once set up, you can then simply edit your site directly in GitHub using markdown, and the combination of Shippable and Aerobatic will take care of the rest such that a new version of your site will be live in less than a minute.

In this tutorial, we'll show you how to use Shippable to build a [Hugo](https://gohugo.io/) static site and deploy it to Aerobatic. Further, we'll use the Aerobatic [password-protect](https://www.aerobatic.com/docs/plugins/password-protect/) plugin to add a password to the site. This comes in handy if, for example, you're an agency, and you want to show a preview of the site to your client before opening it up to the world.

## Create New Hugo Site

We'll assume you've already [installed Hugo](https://gohugo.io/overview/quickstart/). Also, Hugo has an extensive [themes gallery](http://themes.gohugo.io/). In the example below, we're using a theme called hemingway2, but you can, of course, use any theme.

~~~bash
[$] hugo new site shippable
[$] cd shippable
[$] hugo new post/shippable-aerobatic.md
[$] git clone https://github.com/beli3ver/hemingway2.git themes/hemingway2
[$] hugo server --buildDrafts -t hemingway2
~~~

## Create Aerobatic Site

At this point, we could now simply create and deploy the site to Aerobatic like so;

~~~bash
[$] hugo
[$] aero create -n shippable
[$] aero deploy -d public
~~~

However, we're going to use GitHub and Shippable to set up our CI workflow. So, go ahead and create the Aerobatic site with `aero create -n shippable`, but don't deploy it just yet. 

Also, note that in this example, we've called our website `shippable` but you can name it anything you want. When it's deployed, it will have the URL format of `https://your-website-name.aerobatic.io`.

## Create package.json

In the root directory of your site, go ahead and create a `package.json` file like so:

~~~json
{
  "scripts": {
     "build": "hugo --theme=hemingway2 --baseURL 'https://!!baseurl!!' --buildDrafts",
     "deploy": "npm run build && aero deploy -d public"
  },
  "devDependencies": {
      "aerobatic-cli": "1.0.35"
  }
}
~~~


## Set Up GitHub Repository

Next, create a new repository in GitHub at https://github.com/new. Once the repository is created, push your code to GitHub:

~~~bash
# initialize new git repository
[$] git init

# set up our .gitignore and README files
[$] echo -e "/public \n/themes \naero-deploy.tar.gz" >> .gitignore
[$] echo "# aeroship" >> README.md

# commit and push code to master branch
[$] git add --all
[$] git commit -m "first commit"
[$] git remote add origin https://github.com/Dundonian/shippable.git
[$] git push -u origin master
~~~

## Set Up Shippable

We'll assume you have a Shippable account and you've linked it to your GitHub account. Click the **Enable project** link and select your newly created Hugo site.

Once you’ve done that, you’ll then also need to add the `AEROBATIC_API_KEY` to Shippable as an environment variable. This is a one-time step. You can get your Aerobatic API key by running `aero apikey` from the command line in the root of your Hugo site.

<img src="/images/env-var.png" alt="Shippable Environment Variable">

## Create shippable.yml

In the root directory of your site, create a `shippable.yml` file.

~~~yaml
language: node_js

node_js:
  - 6.9.4

env:
  - secure: <a long string of values goes here>

build:
  cache: true

  cache_dir_list:
    - node_modules
    
  ci:
    - wget https://github.com/spf13/hugo/releases/download/v0.18/hugo_0.18-64bit.deb
    - sudo dpkg -i hugo*.deb
    - git clone https://github.com/beli3ver/hemingway2.git themes/hemingway2
    - shippable_retry sudo npm install

  on_success:
    - npm run deploy
~~~

Once you push this new file to GitHub, your site will be automatically built and deployed by Shippable:

<img src="/images/site-live.png" alt="Shippable CI Build Log">

## Option - Password Protection

If you decide you'd like to password protect your new Hugo site, you can do so by editing the `aerobatic.yml` file:

~~~yaml
id: <your website id>
deploy:
  ignore: []
  directory: .
plugins:
  - name: password-protect
    options:
      password: $SITE_PASSWORD
  - name: webpage

~~~

Then, log in to the Aerobatic [dashboard](https://dashboard.aerobatic.com) to set the `SITE_PASSWORD` environment variable. As you can see, for this demo, our password value is **aeroship**.

<img src="/images/aero-env-var.png" alt="Aerobatic Environment Variable Screenshot">


## Conclusion

At this point, with your build process set up, you can now author new blog posts directly in GitHub, make your commit, everything will be built, and a new version of your site will be deployed immediately.

<img src="/images/edit-github.png" alt="Edit live in GitHub">

And that’s it. Happy Coding! 

p.s. The code for this tutorial can be found at https://github.com/Dundonian/shippable

