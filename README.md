# Introducction into Scaling Distributed Python Applications

## Example 1: The pong game
This a simple pong game, for 2 players on the same computer
### How to use it?
First of all, it's on python, so, you need python
Once that u already had python installed, you will need to intall a package from pip
Run the next command on the console
```
pip install pygame
```
Could happend that something fails and says that is missing the --user flag
jut run
```
pip install pygame --user
```
That's all you will need to run the script
Now just run the game
```
cd pong_game_threads && py ./main.py
```
Enjoy with your friends

## Example 2: A chat room
This is other example a little bit more complex but no all from other word, it's a chat room, where once you connect from the client, you will able to send message to all the persons on the room

## How to use it?
In this case we don't need any other library or something external

You only need to open the terminal and run the following command to run the server:
```
cd concurrent_chat && py server.py
```

Once the server is running and there isn't any error or issue
run the command on other terminal (up to 5):
```
cd concurrent_chat && py client.py
```
that all, enojoy it!!!