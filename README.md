# Daily Quote & Reflection Wall
- **Purpose**: Users share inspirational quotes or reflections and react to each other's posts in real time.
- **Features**:
    - Submit short quotes or reflections that appear instantly for other users
    - Reaction buttons (e.g., like, clap) that update in real-time
    - Daily reset or archive of entries to keep it fresh
- **Tech Stack**: Node.js, [Socket.IO](https://socket.io) for real-time updates, frontend framework like React or Vue. 

## Setting Up

I followed the tutorial [here](https://github.com/chandan-satyanarayan/monorepo-example/tree/patch-1) in setting up this project as a _monorepo_.

#### Upgrade

1. Use the command line below when creating the _React App_ instead of the one outline in the tutorial provided above:

``` bash
$ npx create-react-app frontend --template typescript
```

2. Use the command line below instead when adding a git submodule to the project.

``` bash
$ git add submodule https://github.com/alexeagleson/react-dark-mode.git
```

## Running the App in Dev Mode

1. Navigate to the root directory and execute the following command in the terminal:

``` bash
$ yarn start
```

It'll start both the frontend and backend servers.

2. Navigate to the `frontend` directory and run the command below:

``` bash
$ npx tailwindcss -i ./src/index.css -o ./src/style.css --watch
```

This recompiles tailwindcss each time changes are made. Useful in dev mode.