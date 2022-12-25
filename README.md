## Background
[Garry's Mod](https://en.wikipedia.org/wiki/Garry%27s_Mod) is a sandbox video game by Facepunch, published by Valve in 2006. When connecting to a game server, players view a loading screen while the game client downloads all of the server's custom files. This process can take a long time, and even if players have already downloaded those files, they will still be on the loading screen for some time as their client syncs to the server's game state.

[PonyLiving](https://web.archive.org/web/20150306034910/http://www.ponyliving.com/) was a very popular [My Little Pony](https://en.wikipedia.org/wiki/My_Little_Pony:_Friendship_Is_Magic_fandom)-themed [DarkRP](https://gmod.fandom.com/wiki/DarkRP) server that became the [3rd most populous Gmod server](https://web.archive.org/web/20141020170827/http://www.gametracker.com:80/server_info/74.91.126.74:27015/) at its peak. I was an administrator and developer there, and one thing I did for the server was develop its loading screen.

## Technical Details
Garry's Mod renders HTML in [Awesomium](https://web.archive.org/web/20170506160333/http://awesomium.com/), a now-abandoned SDK for implementing the [WebKit](https://en.wikipedia.org/wiki/WebKit) engine. Awesomium mostly supports HTML5 and CSS3, at least for the specifications that existed when it was still in active development, but does not support Javascript [ES6](https://www.w3schools.com/js/js_es6.asp) or newer. When Gmod players connect to a server, their client displays a web page defined by the server's [sv_loadingurl](https://wiki.facepunch.com/gmod/Loading_URL) convar, which functions as the server's loading screen.

If the URL contains "%s" or "%m", Gmod will replace them with the player's Steam ID and the server's current map respectively, which can be then processed by the web page as PHP GET parameters or with some other method. Gmod will also call the GameDetails function in Javascript if it exists, passing in the server name, map name, gamemode, player's Steam ID, and other details. It will also call other functions related to file downloading progress.

## Repository
I originally made this project in 2013, but I've cleaned up the code a bit for presentation here. I've fixed several bugs, reorganized the files into folders, deprecated [jPlayer](https://jplayer.org/) which I used for cross-platform autoplaying audio but browsers don't allow that anymore, deprecated [gfycat.js](https://github.com/gfycat/gfycat.js/) since their API endpoint is no longer available, and updated the code for compatibility with [PHP 8.1](https://www.php.net/releases/8.1/en.php). The original files (except the music) can be seen in the commit history.

## Features
* Themes for each season and some holidays, uses [geoPlugin's API](https://www.geoplugin.com/) to find the viewer's hemisphere to determine the appropriate season
* Events for special dates such as PonyLiving's anniversary
* April Fool's event is a creepy static-covered theme with jitters, text corruption, and other effects, dynamically applied through [Javascript](js/effect_fools.js)
* Random songs and loading images based on theme, with some images being rare
* Uses [Steam Web API](https://steamcommunity.com/dev) for retrieving player's avatar and username
* PHP parameters for debugging and variable overrides
* Saves logs of player joins to text files (development ended before I could move to a proper SQL database), and associates Steam IDs with IPs to discover alt accounts and ban evasion
* Logs are viewable from a [password-protected page](logs.php), access is saved with a cookie

## Demonstration
[![Youtube video](https://i.imgur.com/MPrlcED.png)](https://www.youtube.com/watch?v=GGaKxBg2GBs)
![Picture 1](https://i.imgur.com/ucBvFHu.png)
![Picture 2](https://i.imgur.com/W6udZAS.png)
![Picture 3](https://i.imgur.com/3JqXbC5.png)
![Picture 4](https://i.imgur.com/i3qGX6O.png)
![Picture 5](https://i.imgur.com/b3FmcGW.png)
