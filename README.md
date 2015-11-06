# Project Name

> Pithy project description

## Team

  - Product Owner: John Wareing
  - Scrum Master: Corey Roy
  - Development Team Members: Tommy Sander, Brett Sanders

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

- Node 0.10.x
- Redis 2.6.x
- Postgresql 9.1.x
- etc
- etc

## Development
The following commands are written for OS X.  

### Installing Dependencies
Run all of the following commands from the root directory to setup your dependencies.

```sh
$ npm install
$ bower install
```

### Starting The Node Server
Open a new terminal window and run the following command to start a new server on Port 8080.

```sh
$ grunt start
```

### Creating A Local Database
Create the mySQL database:
```sh
$ grunt create

Running "create" task

Running "shell:createdb" (shell) task
Lets go shwoping!

Done, without errors.
```

#### Accessing The Database

If mySQL is not installed on machine. Check this by executing:
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
Start the mySQL shell, login as the root user, and access the database, execute the below line. After executing the below command, 
```sh
$ mySQL -u root shwopDB
```

Useful mySQL shell commands:
‘show databases;’
‘use [database];’
‘show tables;’
‘describe [table];’
(Open a new terminal window from mySQL shell) grunt create
(In the new terminal window) grunt start (run from root directory)
grunt runSass


From within the root directory:



```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
