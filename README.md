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

### Installing Dependencies

Run the following commands from the root directory: 

```sh
$ npm install
$ bower install
```


### Creating A Local Database

Run the following commands from the root directory: 

Create the mySQL database:
```sh
$ grunt create

Running "create" task

Running "shell:createdb" (shell) task
Lets go shwoping!

Done, without errors.
```
#### Accessing The Database

If mySQL is not installed on machine. Check this by executing :
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
Start the mySQL shell, login as the root user, and access the  execute the below line. 
$ mySQL -u root 




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
