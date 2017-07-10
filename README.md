# Interactive Map of Catalunya
Interactive vectorial map of Catalunya based on a SVG/VML and the library RaphaëlJs.


<img src="https://github.com/eballo/catalunya-map/blob/master/screenshot/screenshot-v7.0.png" alt="screen-shot" align="center" />

## Current versions
* Raphaël JS - 2.2.1
* ScaleRaphael - 0.8
* jQuery - 3.1.1
* Bootstrap - 3.3.7

## Demo

- [Demo v1.0](http://demo.catalunyamedieval.es/map1)
- [Demo v2.0](http://demo.catalunyamedieval.es/map2)
- [Demo v2.1](http://demo.catalunyamedieval.es/map21)
- [Demo v3.0](http://demo.catalunyamedieval.es/map3)
- [Demo v3.1](http://demo.catalunyamedieval.es/map31)
- [Demo v4.0](http://demo.catalunyamedieval.es/map4)
- [Demo v4.1](http://demo.catalunyamedieval.es/map41)
- [Demo v5.0](http://demo.catalunyamedieval.es/map50)
- [Demo v5.1](http://demo.catalunyamedieval.es/map51)
- [Demo v5.2](http://demo.catalunyamedieval.es/map52)
- [Demo v6.0](http://demo.catalunyamedieval.es/map60)
- [Demo v6.1](http://demo.catalunyamedieval.es/map61)
- [Demo v6.2](http://demo.catalunyamedieval.es/map62)
- [Demo v7.0](http://demo.catalunyamedieval.es/map7)
- [Demo v7.1](http://demo.catalunyamedieval.es/map71)
- [Demo v7.2](http://demo.catalunyamedieval.es/map71)

## How to create a Map using a SVG file

1. Given a [SVG file](http://demo.catalunyamedieval.es/map7/src/Mapa_comarcal_de_Catalunya.svg) you can rename it to xml [XML file](http://demo.catalunyamedieval.es/map7/xml/Mapa_comarcal_de_Catalunya.svg.xml)
2. Inside the xml file you will see a d="..." like this one
```
	d="M 97.21875 15.40625 L 94.84375 L 100.03125 16.34375 L 98.625 15.65625 L 98.15625 15.65625 L 97.21875 15.40625 z "
```
3. Create a mappath array with all the values seen in the last point like this [path file](http://demo.catalunyamedieval.es/map7/js/catalunya-map-path.js)
4. Use RaphaëlJs to draw the map like this [path file](http://demo.catalunyamedieval.es/map7/js/catalunya-map-init.js)

## How to use this map (last version)

1. Add this code in the head and footer

1.1 header

    <header>
    ...
    <meta name="viewport" content="width=device-width">
    <!-- Jquery & Raphaeljs -->
    <script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="js/raphael-min.js"></script>
    <script type="text/javascript" src="js/scale.raphael.js"></script>
    <!-- Bootstrap -->
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <!-- custom styles -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/catalunya-map-v2.css">
    ...
    </header>

Explanation:
    catalunya-map-v2.css : custom css theme (v1/v2)


1.2 footer

    <footer>
    ...
    <script type="text/javascript" src="js/catalunya-map-path.js"></script>
    <script type="text/javascript" src="js/catalunya-map.js"></script>
    <script type="text/javascript" src="js/catalunya-map-options-v2.js"></script>
    <script type="text/javascript" src="js/catalunya-map-init.js"></script>
    ...
    </footer>

Explanation :

    catalunya-map-path.js       : js file that have the javascript array with all the data
    catalunya-map.js            : js file that have the object to create maps
    catalunya-map-options-vX.js : js file that have the custom options for each theme (v1/v2)
    catalunya-map-init.js       : js file that create an object map and print it in the screen

2. Add this code in the body

				<div id="container row">

					<div class="mapWrapper">
						<div id="text" class="col-md-4">
							<div id="comarcaName">
								<h1>Catalunya Medieval</h1></div>
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

V1.0
- Just the map

V2.0
- Resize functionality using [raphael-scale.js](http://www.shapevent.com/scaleraphael/)

V2.1
- Debug information and better resize example

v3.0
- Add comarca and capital names

v3.1
- New catalunya-map-path.js
- Add colors on mouse hover

V4.0
- Add Comarca Info box on mouse click

V4.1
- add touchStart for tablets (ipad)

v5.0
- Add Comarca del Moianes : Source image Mapa_comarcal_de_Catalunya_v2.svg (Thanks for your Contribution Hector)

v5.1
- reposition of all the names
- new screenshot

v5.2
- add property onClick and newWindow (requested functionality by Hector)

v6.0
- add Droid Sans Font
- change colors
- update Raphael JS and jQuery versions
- add bootstrap
- add all buildings

v6.1
- Fix responsive design

v6.2
- Object Oriented implementation (refactor)

v7.0
- update readme
- create diferent configuration option files (v1,v2)
- beautifyed all code
- Documentation of the code

v7.1
- Add button option configuration (https://codepen.io/piecdesmit/details/OMYNZg/)
- Styles for icons

v7.2
- Fix styles


## Webs using this map:
- [blog cimasdestacables](http://cimasdestacables.blogspot.com/p/mapa-comarcal-de-catalunya.html)
- [catalunya medieval](http://www.catalunyamedieval.es)

## License

- [GNU GENERAL PUBLIC LICENSE](http://demo.catalunyamedieval.es/LICENSE.txt)
