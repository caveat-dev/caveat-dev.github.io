# caveat-dev.github.io

Source code for my website, https://caveatemptor.dev. Built using Jekyll and hosted using Github pages.

# contributing Pico-8 games

The current proccess for this is sloppy. To update a game, you would need to manually re-add it the repository. Nothing is automated.

## Step 1:
Clone this repository. You will need to edit games.md as well as add the HTML and CSS files for your game.

## Step 2:
Add the HTML and CSS files for your game into the "game_src" directory. The files should both be named "yourname_gamename", Ex: "caveat_box_push". <b>You must name these files correctly as you export them from Pico-8. Changing the names later breaks the carts.</b>

## Step 3:
Add the following to the games.md page below the other embeds. "GAME NAME" is the name of your game, "YOU" is your name or username, "YOUR_REPO" is a link to the source code repository, and "FILE_NAME" is the name of the HTML file for the game.
```html
...
<hr>
<h2>GAME NAME</h2>
<h3>By YOU</h3>
<p><a href="https://website.com/YOUR_REPO" target="_blank">source</a></p>
<iframe src="/game_src/FILE_NAME.html" height="1000" width="1000" title="Iframe GAME_NAME"></iframe>
...
```
Example:
```html
...
<hr>
<h2>Box Push</h2>
<h3>By caveat</h3>
<p><a href="https://github.com/caveat-dev/box_push" target="_blank">source</a></p>
<iframe src="/game_src/caveat_box_push.html" height="1000" width="1000" title="Iframe Box Push"></iframe>
...
```

## Step 4:
Open a pull request! (and maybe suggest a better way to do this)