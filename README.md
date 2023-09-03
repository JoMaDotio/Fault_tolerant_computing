# Application checkpointing

This is the branch when we lear how to do Application checkpointing on any app, basicaly we only need a way to access to the file system/or a kind of storage to save the data in something happend

## example 1
This is a small web example of the topic using the local storage to save the game progress
### How to use it
```
- Depending on the OS where you are apening this, it could be just double click on the index.html file and will open it on the browser
- If you are using VS Code, you can just add the extension Live Server [https://github.com/ritwickdey/vscode-live-server-plus-plus]
```
### How it works?
It's pretty simple, I jsut the game of Guess a number, and it stores the puntuacion and the number of attempts if the browser get refresh or closed, it uses the LocaStorage, ti save everithing as an JSON object on the browser memory.

## example 2
This is a different game, were we try to guest a word and it count the trys and al the failing attemps

### how to use it?
It's a pretty stright forward app,we need to have installed "Node.JS".
Note: "Remember to move the to folder, example_2"

Under the folder, we do on the command line:
```
npm i
```

Once it finish, we only run:
```
npm run prod
```
This will execute the server normaly as prod

If you wanted to use it as develop, probably you had to check if is installed "Nodemon"
If not, its pretty simple, just type on the command line:
```
npm i -g nodemon //Note: You know all the crazy stuff on the forked repos with malisious scrips on that, I highly recomend to type the package name on npm search and verify that is the correct one, or you can just trust me and who cares, it's is a scooll assesment hahaha
``` 
Once that you have nodemon install, just run:
```
npm run dev
```
And that all

### How it works?
This work diferent, bc it contains the server and the "client" (if we can call it that way the html page we send on the initial request)
You can play normaly, and if we hit button "Detener server", its kinda simulate a failure and stop the server, with that we save the data on a JSON file, if we start again the server, it will try to read the file and load the data, that we send it to the client and display the current progress