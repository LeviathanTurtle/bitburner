# Bitburner

I found a game on Steam called Bitburner (https://store.steampowered.com/app/1812820/Bitburner/) for the low-low price of free. From the page's description, "Bitburner is a programming-based idle incremental RPG where you, the player, take the role of an unknown hacker in a dark, dystopian world. The game provides a variety of mechanics and systems that can be changed through coding and solved or automated in whatever way you find suitable."

The basic premise is to gain money by hacking servers (or other ways). Hacking a server gets you hacking experience and a portion of the money on the server, but also increases the server's security, making it harder to hack the next time. Repeatedly hacking a server also has diminishing returns, since you're only taking a portion of the server's money. Through a combination of the following functions, you can make a sustainable income in the game:
- `ns.hack()` -- hacks the server, giving you a portion of the money on it
- `ns.weaken()` -- weaken the server's security, making it easier to hack the next time
- `ns.grow()` -- inflate the funds on the server, giving the server more money for you to hack
These are my own words and my understanding (which could be wrong), so if you are at all confused, I encourage you to read the documentation found in game or from the following sources:
- https://github.com/bitburner-official/bitburner-src
- https://bitburner.readthedocs.io/en/latest/index.html

The game also offers different types of minigames to accomplish tasks for more money, but I have not explored those yet.

After reading the in-game documentation (highly recommended), I took some of the code provided in it. I started with that, then as I learned I started to develop my own scripts. This repository is just a collection of the scripts I've made while playing the game. This is in its own mini repository because I felt that it didn't fit in my other repositories. 

# TO DO:
- offload `files` array to separate file, and use I/O in scripts
- incorporate `no-ram-script_startup.js` into `master.js`
- output log statements to separate files

# DONE:
- offload `servers` array to separate file (data file) and updated `script_startup.js` to read input from file (4.24.2024)
- in `script_startup.js`, reduce the number of for-loops (4.24.2024)
- ADAPTATION: return an array of servers affected in `script_startup.js` to be used with `home-script_startup.js`
    - Instead, output affected servers to an `affected_servers` data file, to be read in `home-script_startup.js` (In progress)
