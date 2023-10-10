# NestJS GraphQL RpgManager API Project

This is a fully functional NestJS project for RpgManager, a self-management app that combines game and organization. The purpose of this project is to create a single application that combines self-management tools with gaming-like features to provide a comfortable and rewarding experience in managing your life.

This is the rewrite of <a href="https://github.com/Definitely-Human/rpgmanager-api/">Django REST API</a>.

## Table of Contents

- [The Goal](#the-goal)
- [Technical Details](#technical-details)
- [Installation](#installation)
- [Known Issues](#known-issues)
- [Contributing](#contributing)

## The Goal

The goal of this manager is to organize yourself using four main components:

- Tasks
- Lists
- Routines
- Notes

While combining it with gaming-like features such as:

- Character
- Level
- Rewards for completion of tasks, etc.
- Skills
- Coins
- Reward items

## Technical Details

This project is made using NestJS and GraphQL. It is designed to work with PostgreSQL using TypeORM, but in theory, this project is database agnostic. Docker was used to make this project system independent and easy to work with in a large team (currently whopping 1 person).

The database schema for this project is:

![alt text](https://i.imgur.com/0Jf1ch7.png)

### GraphQL Playground

GraphQL schema can be seen by going to localhost:3000/graphql. This will open a GraphQL Playground where test requests can be sent to play around with the API.

## Installation

1. Clone this project.
2. Install Docker Desktop.
3. Run `docker-compose up`, and all dependencies will be automatically installed.

## Known Issues

- Can't run automated tests in GitHub CI because Docker networking refuses to work properly.

## Contributing

If you know how to fix a bug or have a cool or useful feature to add, feel free to clone this repository and submit a pull request.
