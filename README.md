# Shwop

Shwop is a peer-to-peer, mobile-optimized marketplace with intuitive swipe-based user experience, geolocation tracking and text notifications. Check out Shwop [here](http://shwop.herokuapp.com/)!

## Table of Contents

1. [Screenshots](#screenshots)
1. [Code Highlights](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
1. [Team](#team)
1. [Contributing](#contributing)

## Overview and Features

Shwop works by allowing users to swipe their way through available items for sale, rather than obliging them to click back and forth through endless links like more traditional sites do. And since all items are associated with a photo, a buyer knows exactly what he or she is getting.

Shwop users can search for specific items, swiping left to browse through what is available for sale and swiping right to place a bid on an item. On a desktop or laptop, users can click and drag through items or use the left/right arrow keys.

Once a bid is placed, the seller is sent an anonymous, peer-to-peer SMS message via Twilio, which contains information about the bid and how to reply to the bidder if they are interested in accepting the offer.

In addition to uploading items for sale, users can also view a summary of all items that they have posted as well as all items for which they have submitted a bid.

Shwop makes the shopping experience more streamlined, efficient, visual, and fun!

## Team

  - Product Owner: John Wareing
  - Scrum Master: Corey Roy 
  - Development Team Members: 
      Tommy Sander [LinkedIn](https://linkedin.com/in/thomasksander) | [GitHub](https://github.com/tksander) 
      Brett Sanders [LinkedIn](https://linkedin.com/in/brettwsanders) | [GitHub](https://github.com/brettwsanders)
      John Wareing [LinkedIn](https://linkedin.com/in/johnwareing) | [GitHub](https://github.com/jwareing)
      Corey Roy [LinkedIn](https://linkedin.com/in/coreyroy), [GitHub](https://github.com/coreysf)


## Screenshots

![Shwop Mobile Browser App](/screenshots/mobileapp-screenshot.png?raw=true "Mobile App")
![Shwop Web Browser App](/screenshots/webapp-screenshot.png?raw=true "Web App")


## Code Highlights

Client-side
[Products View](/client/app/products/products.html)
[Products Controller](/client/app/products/products.js)

Server-side
[Products Controller](/server/products/productsController.js)

Database 
[Products Controller](/server/db/db_config.js)

Code-base Test 
[Server Intergration Test](/test/server/integration.js)

## Model-View-Controller Map



## Requirements

- Node 
- NPM
- Bower
- mySQL
- Parse.com account

## Development
The following commands are written for OS X.  

### Installing Dependencies
Run all of the following commands from the root directory to setup your dependencies.

```sh
$ npm install
$ bower install
```

### Creating A Local mySQL Database
Create the mySQL database:
```sh
$ grunt create

Running "create" task

Running "shell:createdb" (shell) task
Lets go shwoping!

Done, without errors.
```

#### Accessing The Database

Check if mySQL is installed on your machine by executing:
```sh
$ which mySQL
```
If mySQL is not installed, run:
```sh
$ brew install mySQL
```
Start up your mySQL server
```sh
$ mySQL.server start
```
Start the mySQL shell, login as the root user, and access the database, by executing the below command.  
```sh
$ mySQL -u root shwopDB
```

### Starting Node Server
Open a new terminal window and run the following command to start a new Node server on Port 8080. 
Running this command will also execute the Sequelize commands to 

```sh
$ grunt start
```
#### Create Sass file

```sh
grunt runSass
```

## Running Tests

```sh
grunt test
```

## Parse Account Setup



### Roadmap
View the project roadmap [here](https://github.com/ClandestineCalavera/shwop/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
