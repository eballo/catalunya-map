# Interactive Map of Catalunya
Interactive vectorial map of Catalunya based on a SVG/VML and the library RaphaëlJs.


<img src="https://github.com/eballo/catalunya-map/blob/master/screenshot/screenshot-v11.png" alt="screen-shot" align="center" />

## Current versions
* Raphaël JS - 2.3.0
* ScaleRaphael - 0.8
* jQuery - 3.1.1
* Bootstrap - 3.3.7

## Demo

[Demo](./demo.md)

## How to create a Map using a SVG file

1. Given a [SVG file](http://demo.catalunyamedieval.es/map90/src/Mapa_comarcal_de_Catalunya.svg) you can rename it to xml [XML file](http://demo.catalunyamedieval.es/map7/xml/Mapa_comarcal_de_Catalunya.svg.xml)
2. Inside the xml file you will see a d="..." like this one
```
	d="M 97.21875 15.40625 L 94.84375 L 100.03125 16.34375 L 98.625 15.65625 L 98.15625 15.65625 L 97.21875 15.40625 z "
```
3. Create a mappath array with all the values seen in the last point like this [path file](http://demo.catalunyamedieval.es/map80/js/catalunya-map-path.js)
4. Use RaphaëlJs to draw the map like this [path file](http://demo.catalunyamedieval.es/map80/js/catalunya-map-init.js)

## How to use this map (last version)

1. Add this code in the head and footer

1.1 header

    <header>
    ...
    <meta name="viewport" content="width=device-width">
    <!-- Jquery & Raphaeljs -->
    <script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="js/raphael-min.js"></script>
    <script type="text/javascript" src="js/scale.raphael.js"></script>
    <!-- Bootstrap -->
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <!-- custom styles -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/catalunya-map-v3.css">
    ...
    </header>

Explanation:
    catalunya-map-v3.css : custom css theme (v1/v2/v3)


1.2 footer

    <footer>
    ...
    <script type="text/javascript" src="js/catalunya-map-path-sample.js"></script>
    <script type="text/javascript" src="js/catalunya-map.min.js"></script>
    ...
    </footer>

Source files Explanation :

    catalunya-map-path-sample.js          : js file that have the javascript array with all the data
    catalunya-map-min.js                  : js file that have the object to create maps

2. Add this code in the body

				<div id="container row">

					<div class="map-wrapper">
						<div id="text" class="col-md-4">
							<div id="comarcaName">
								<h1>Catalunya Interactive Map</h1></div>
							<div id="contentText">Seleccionar una comarca del mapa i fer clic per veure el seu contingut</div>
						</div>
						<div id="map" class="col-md-8"></div>
					</div>

					<div class="llistaComarques col-md-12">
						<ul class="list list-group"></ul>
					</div>

				</div>

3. Reload the page and all you should be able to see the map

## Sources
- [Mapa SVG de Catalunya](http://commons.wikimedia.org/wiki/File:Mapa_comarcal_de_Catalunya.svg)
- [RaphaëlJs](http://raphaeljs.com)
- [raphael-scale.js](http://www.shapevent.com/scaleraphael/)
- [JQuery](http://jquery.com/)
- [Bootstrap](http://getbootstrap.com/)

## Inspiration Links
- [http://codecanyon.net/item/interactive-svg-usa-map/full_screen_preview/1021095](http://codecanyon.net/item/interactive-svg-usa-map/full_screen_preview/1021095)
- [http://blog.comersis.com/articles/SVG-Raphael-map/](http://blog.comersis.com/articles/SVG-Raphael-map/)
- [http://www.jonathan-petitcolas.com/2013/07/18/create-clickable-svg-france-regions-map.html](http://www.jonathan-petitcolas.com/2013/07/18/create-clickable-svg-france-regions-map.html)
- [http://migrationsmap.net/#/NLD/arrivals](http://migrationsmap.net/#/NLD/arrivals)
- [http://newsignature.github.io/us-map/](http://newsignature.github.io/us-map/)

## Versions

[Change log](./changelog.md) 


## Development

Since version 10.0 uses [webpack](https://webpack.js.org/).

### Install gulp and Bower

Building the theme requires [node.js](http://nodejs.org/download/). We recommend you update to the latest version of npm: `npm install -g npm@latest`.

From the command line:

1. Navigate to the theme directory, then run `npm install`
3. Build `npm run build`
4. Start `npm run start` 

Open your browser [localhost:9000](http://localhost:9000/)

### Available node commands

* `build`      — Compile and optimize the files in your web directory
* `buildWatch` — Compile and optimize the files in your web directory and watch for changes to update the files
* `start`      — Starts a web server

## Webs using this map:
- [blog cimasdestacables](http://cimasdestacables.blogspot.com/p/mapa-comarcal-de-catalunya.html)
- [catalunya medieval](http://www.catalunyamedieval.es)

## License

- [GNU GENERAL PUBLIC LICENSE](http://demo.catalunyamedieval.es/LICENSE.txt)
