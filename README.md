# Shwop

Peer-to-peer mobile optimized marketplace with intuitive swipe-based user experience, geolocation tracking and text notifications.

## Team

  - Product Owner: John Wareing [LinkedIn](linkedin.com/in/johnwareing), [GitHub](github.com/jwareing)
  - Scrum Master: Corey Roy [LinkedIn](linkedin.com/in/coreyroy), [GitHub](github.com/coreys)
  - Development Team Members: 
      Tommy Sander [LinkedIn](linkedin.com/in/thomasksander), [GitHub](github.com/tksander) 
      Brett Sanders [LinkedIn](linkedin.com/in/brettwsanders), [GitHub](github.com/brettwsanders)


## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Some usage instructions

## Requirements

- Node 
- NPM
- Bower
- mySQL

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

Useful mySQL shell commands:
```sh
‘show tables;’
‘describe [table];’
```

### Starting Node Server
Open a new terminal window and run the following command to start a new Node server on Port 8080. 
Running this command will also execute the Sequelize commands to 

```sh
$ grunt start
```
#### Create Sass file
grunt runSass

### Roadmap
View the project roadmap [here](https://github.com/ClandestineCalavera/shwop/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
