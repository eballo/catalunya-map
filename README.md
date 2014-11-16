# Interactive Map of Catalunya SVG/VML and RaphaëlJs - Demo
Interactive vectorial map of Catalunya based on a SVG/VML and the library RaphaëlJs.

## Demo

- [Demo v1.0](http://demo.catalunyamedieval.es/map1)
- [Demo v2.0](http://demo.catalunyamedieval.es/map2)

#How to create a Map using a SVG file

- 1) Given a [SVG file](http://demo.catalunyamedieval.es/map1/src/Mapa_comarcal_de_Catalunya.svg) you can rename it to xml [XML file](http://demo.catalunyamedieval.es/map1/xml/Mapa_comarcal_de_Catalunya.svg.xml)
- 2) Inside the xml file you will see a d="..." like this one
```
	d="M 97.21875 15.40625 L 94.84375 16.34375 L 93.90625 16.34375 L 93.4375 17.78125 L 91.5625 18.9375 L 92.03125 20.375 L 92.5 20.84375 L 92.25 22.25 L 92.5 23.4375 L 92.71875 24.59375 L 91.3125 25.5625 L 90.59375 26.96875 L 89.90625 27.6875 L 111.59375 20.84375 L 108.53125 18.9375 L 107.34375 19.1875 L 105.9375 19.40625 L 104.75 19.1875 L 103.34375 18.46875 L 100.5 17.53125 L 100.03125 16.34375 L 98.625 15.65625 L 98.15625 15.65625 L 97.21875 15.40625 z "
```
- 3) Create a mappath array with all the values seen in the last point like this [path file](http://demo.catalunyamedieval.es/map1/js/catalunya-map-path.js)
- 4) Use RaphaëlJs to draw the map like this [path file](http://demo.catalunyamedieval.es/map1/js/catalunya-map-init.js)

## Sources
- [Mapa SVG de Catalunya](http://commons.wikimedia.org/wiki/File:Mapa_comarcal_de_Catalunya.svg)
- [RaphaëlJs](http://raphaeljs.com)
- [raphael-scale.js](http://www.shapevent.com/scaleraphael/)
- [JQuery](http://jquery.com/)

## Versions
V1.0 
- Just the map

V2.0
- Resize functionality using [raphael-scale.js](http://www.shapevent.com/scaleraphael/)

v3.0
- Add Comarca Names and tooltips capital