# Bitburner

I found a game on Steam called Bitburner (https://store.steampowered.com/app/1812820/Bitburner/) for the low-low price of free. From the page's description, "Bitburner is a programming-based idle incremental RPG where you, the player, take the role of an unknown hacker in a dark, dystopian world. The game provides a variety of mechanics and systems that can be changed through coding and solved or automated in whatever way you find suitable."

The basic premise is to gain money by hacking servers (there are other ways too). Hacking a server gets you hacking experience and a portion of the money on the server, but also increases the server's security, making it harder to hack the next time. Repeatedly hacking a server also has diminishing returns, since you're only taking a portion of the server's money. Through a combination of the following functions, you can make a sustainable income in the game:
- `ns.hack()` -- hacks the server, giving you a portion of the money on it
- `ns.weaken()` -- weaken the server's security, making it easier to hack the next time
- `ns.grow()` -- inflate the funds on the server, giving the server more money for you to hack

These are my own words from my understanding (which could be wrong), so if you are at all confused or want more information, I encourage you to read the documentation found in game or from the following sources:
- https://github.com/bitburner-official/bitburner-src
- https://bitburner.readthedocs.io/en/latest/index.html

The game also has a 'prestige' mechanic known as augmentations. You can buy these from factions to improve your skill progression, reduce main function (`hack`,`weaken`,`grow`) time, and more. Installing augmentations resets you back to the beginning, so having a master script to start your 'hacking event loop' is very handy. 

After reading the in-game documentation (highly recommended), I took some of the code provided in it and as I learned, I started to develop my own scripts. This repository is just a collection of the scripts I've made while playing the game.

## USAGE:
While the game supports directories, it is unfortunately not as simple as using `mkdir`. Instead, you must use something similar to `nano /folder/subfolder/<filename>` in order to use them. When I wrote the scripts I did not use directories, so the file paths in the scripts do not match this repository. Instead, for readability and ease-of-understanding, I have organized it into different sections:
- Archive: old files that have been improved or no longer used (I only use this here)
- Data: server data files used as input
- src: main scripts that are run (excluding `master.js`)

As mentioned earlier, having a master script is pretty handy when installing augmentations. `master.js` is this script. It should be noted that the way the scripts are set up assumes all files are in the same directory, so if you wanted to run this, you would need to either update the file paths in the scripts, or move everything into one folder. I believe the main functions should only work in-game, so running any scripts outside of it should have no effect.

## TO DO:
- offload `files` array to separate file, and use I/O in scripts
- output log statements to separate files

## DONE:
- offload `servers` array to separate file (data file) and updated `script_startup.js` to read input from file (4.24.2024)
- in `script_startup.js`, reduce the number of for-loops (4.24.2024)
- ADAPTATION: incorporate `no-ram-script_startup.js` into `master.js`
    - Instead, added servers with no ram to list of servers used by `home-script_startup.js` (?4.26.2024)

- SCRAPPED: return an array of servers affected in `script_startup.js` to be used with `home-script_startup.js`
