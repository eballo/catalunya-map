# Interactive Map of Catalunya SVG/VML and RaphaëlJs - Demo
Interactive vectorial map of Catalunya based on a SVG/VML and the library RaphaëlJs.


<img src="https://github.com/eballo/catalunya-map/blob/master/screenshot/screenshot-v4.png" alt="screen-shot" align="center" />


## Demo

- [Demo v1.0](http://demo.catalunyamedieval.es/map1)
- [Demo v2.0](http://demo.catalunyamedieval.es/map2)
- [Demo v2.1](http://demo.catalunyamedieval.es/map21)
- [Demo v3.0](http://demo.catalunyamedieval.es/map3)
- [Demo v3.1](http://demo.catalunyamedieval.es/map31)
- [Demo v4.0](http://demo.catalunyamedieval.es/map4)

##How to create a Map using a SVG file

1. Given a [SVG file](http://demo.catalunyamedieval.es/map1/src/Mapa_comarcal_de_Catalunya.svg) you can rename it to xml [XML file](http://demo.catalunyamedieval.es/map1/xml/Mapa_comarcal_de_Catalunya.svg.xml)
2. Inside the xml file you will see a d="..." like this one
```
	d="M 97.21875 15.40625 L 94.84375 L 100.03125 16.34375 L 98.625 15.65625 L 98.15625 15.65625 L 97.21875 15.40625 z "
```
3. Create a mappath array with all the values seen in the last point like this [path file](http://demo.catalunyamedieval.es/map1/js/catalunya-map-path.js)
4. Use RaphaëlJs to draw the map like this [path file](http://demo.catalunyamedieval.es/map1/js/catalunya-map-init.js)

## How to use this map

1. Add this code in the head

	     <script type="text/javascript" src="js/raphael-min.js"></script>
	     <script type="text/javascript" src="js/scale.raphael.js"></script>
	     <script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>

	     <script type="text/javascript" src="js/catalunya-map-path.js"></script>
	     <script type="text/javascript" src="js/catalunya-map-init.js"></script>

	     <link rel="stylesheet" href="css/main.css">
	     <link rel="stylesheet" href="css/catalunya-map.css">

2. Add this code in the body

		<div class="mapWrapper">
			<div id="map"></div>
			<div id="text">
				<div id="comarcaName"><h1>Informaci&oacute;</h1></div>
				<div id="contentText">Seleccionar una comarca del mapa i fer clic per veure el seu contingut</div>
			</div>
		</div>

3. Reload the page and all you should be able to see the map

## Sources
- [Mapa SVG de Catalunya](http://commons.wikimedia.org/wiki/File:Mapa_comarcal_de_Catalunya.svg)
- [RaphaëlJs](http://raphaeljs.com)
- [raphael-scale.js](http://www.shapevent.com/scaleraphael/)
- [JQuery](http://jquery.com/)

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

##License
