/**
 * Catalunya Medieval 2015-2023 - Open Source Catalunya Map
 *
 * Author  : Enric Ballo
 * version : 9.0
 *
 */
;
class CatMap {

    constructor(config, json) {
        this.config = config;
        this.mappaths = json
        this.paper = new ScaleRaphael('map', this.config.mapWidth, this.config.mapHeight);
        this.winWidth;
        this.win;
        this.selected;
        this.ratio;
        this.mcat = {}; //Array of comarcas
    }

    showValues(){
        if (this.config.debug) {
            console.log('ShowValues ...');
            console.log("Win Width: " + this.winWidth + " Map with: " + this.config.mapWidth + " Map Height: " + this.config.mapHeight + " Ratio: " + this.ratio);
            $("#this.config.debugInfo").html("Win Width: " + this.winWidth + " Map with: " + this.config.mapWidth + " Map Height: " + this.config.mapHeight + " Ratio: " + this.ratio);
        }
    }

    createArrayComarcas(){
        if (this.config.debug) {
            console.log('create Array Comarcas...');
        }
        for (const comarca in this.mappaths) {
            this.mcat[comarca] = this.paper.set()
        }
    }

    createLlistaComarquesText(){
        if (this.config.debug) {
            console.log('create list of comarques ...');
        }

        let llistaComarques = [];
        for (let comarca in this.mappaths) {
            llistaComarques.push({
                name: this.mappaths[comarca].name,
                url: this.mappaths[comarca].url,
                total: this.mappaths[comarca].total
            });
        }

        // Order the list by name
        llistaComarques = llistaComarques.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

        // Create list with bootstrap styles
        for (let i = 0; i < llistaComarques.length; i++) {
            $("<li class='list-group-item'><a href='" + llistaComarques[i].url + "' class='list-group-item'>" + llistaComarques[i].name + "<span class='badge'>" + llistaComarques[i].total + "</span></a></li>").appendTo("ul.list");
        }
    }

    createMap(){

        if (this.config.debug) {
            console.log('CreateMap ...');
        }

        // This objects hack are needed because onHover function
        // this will be the obj itself
        let config = this.config;
        let self = this;
        let i = 0; // used to create a unique node id

        for (let comarca in this.mappaths) {
            let obj = this.createRaphaelObject(comarca, i);

            // Change the color of each comarca animation hover event
            obj.hover(function () { // hoverIn function
                let params = {
                    'fill': config.colorIn
                };
                this[0].animate(params, 100);
                this[1].attr(config.nomComcarcaAttr_in);
                this[2].show();
            }, function () { // hoverOut function
                let params = {
                    'fill': config.colorOut
                };
                //if it is not the selected comarca remove styles
                if (self.selected != this[0].comarcaName) {

                    this[0].animate(params, 100);
                    this[1].attr(config.nomComcarcaAttr_out);
                    this[2].hide();

                } else {
                    //if it is the selected comarca on hover out treiem la capital
                    //this[2].hide();
                }
            }, obj, obj);

            if (config.useText) {
                // on click event
                obj[0].click(function () {
                    var comarcaName = this.comarcaName;
                    var capitalComarca = this.capitalComarca;
                    var contentText = this.contentText;
                    var comarcaLink = this.comarcaLink;
                    self.selected = this.comarcaName;
                    self.remove_background();
                    self.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);
                });

                obj[1].click(function () {
                    var comarcaName = this.comarcaName;
                    var capitalComarca = this.capitalComarca;
                    var contentText = this.contentText;
                    var comarcaLink = this.comarcaLink;
                    self.selected = this.comarcaName;
                    self.remove_background();
                    self.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);
                });

                obj[2].click(function () {
                    var comarcaName = this.comarcaName;
                    var capitalComarca = this.capitalComarca;
                    var contentText = this.contentText;
                    var comarcaLink = this.comarcaLink;
                    self.selected = this.comarcaName;
                    self.remove_background();
                    self.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);
                });

                obj[0].touchstart(function () {
                    var comarcaName = this.comarcaName;
                    var capitalComarca = this.capitalComarca;
                    var contentText = this.contentText;
                    var comarcaLink = this.comarcaLink;
                    self.selected = this.comarcaName;
                    self.remove_background();
                    self.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);
                });

                obj[1].touchstart(function () {
                    var comarcaName = this.comarcaName;
                    var capitalComarca = this.capitalComarca;
                    var contentText = this.contentText;
                    var comarcaLink = this.comarcaLink;
                    self.selected = this.comarcaName;
                    self.remove_background();
                    self.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);
                });

                obj[2].touchstart(function () {
                    var comarcaName = this.comarcaName;
                    var capitalComarca = this.capitalComarca;
                    var contentText = this.contentText;
                    var comarcaLink = this.comarcaLink;
                    self.selected = this.comarcaName;
                    self.remove_background();
                    self.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);
                });
            }

            i++;
        }

        if (this.config.responsive) {
            self.responsiveResize();
            self.win.resize(function () {
                self.responsiveResize();
            });
        } else {
            self.resizeMap();
        }
    }

    createRaphaelObject(comarca, i) {
        let obj = this.mcat[comarca];

        // Raphael object - object 0 (the map)
        obj.push(this.paper.path(this.mappaths[comarca].path).attr(this.config.comarcaAttr));
        obj.animate({
            transform: "t0,-200"
        });

        // object 1 and 2 (comarca name / capital comarca name)
        obj.push(this.paper.text(this.mappaths[comarca].nx, this.mappaths[comarca].ny, this.mappaths[comarca].name).attr(this.config.nomComcarcaAttr_out));
        obj.push(this.paper.text(this.mappaths[comarca].cx, this.mappaths[comarca].cy, this.mappaths[comarca].capital).attr(this.config.nomCapitalAttr));

        obj[0].comarcaName = this.mappaths[comarca].name;
        obj[1].comarcaName = this.mappaths[comarca].name;
        obj[2].comarcaName = this.mappaths[comarca].name;

        obj[0].capitalComarca = this.mappaths[comarca].capital;
        obj[1].capitalComarca = this.mappaths[comarca].capital;
        obj[2].capitalComarca = this.mappaths[comarca].capital;

        obj[0].contentText = this.mappaths[comarca].info;
        obj[1].contentText = this.mappaths[comarca].info;
        obj[2].contentText = this.mappaths[comarca].info;

        obj[0].comarcaLink = this.mappaths[comarca].url;
        obj[1].comarcaLink = this.mappaths[comarca].url;
        obj[2].comarcaLink = this.mappaths[comarca].url;

        obj[0].node.id = i;
        obj[0].toBack();

        obj[1].toFront();
        obj[2].toFront();

        //Initial status hiden
        obj[1].hide();
        obj[2].hide();

        return obj;
    }

    remove_background(){
        for (const comarca in this.mappaths) {
            let obj = this.mcat[comarca];
            if (obj[0].comarcaName != this.selected) {
                let params = {
                    'fill': this.config.colorOut
                };
                obj[0].animate(params, 100);
                obj[1].attr(this.config.nomComcarcaAttr_out);
                obj[2].hide();
            }
        }
    }

    onMapClick(comarcaName, capitalComarca, contentText, comarcaLink){
        if (this.config.onClick) {
            if (this.config.newWindow) {
                window.open(comarcaLink);
            } else {
                window.location = comarcaLink;
            }
        } else {
            if (this.config.button) {
                if (this.config.debug) {
                    console.log('button functionality enabled');
                }
                $('#veure-contingut').show()
                $('#veure-contingut').click(function () {
                    $(this).toggleClass("veure-clic");
                    window.location = comarcaLink;
                    return false;
                });

            }
            $('#comarcaName').html('<h1>' + comarcaName + '</h1><h2>' + capitalComarca + '</h2>');
            $('#contentText').html(contentText);
        }
    }

    resizeMap(){
        if (this.config.debug) {
            console.log('resizeMap ...');
        }
        let self = this;

        this.paper.changeSize(this.config.mapWidth, this.config.mapHeight, true, false);
        if (this.config.debug) {
            console.log('resize map with : ' + this.config.mapWidth + ' height : ' + this.config.mapHeight);
        }

        $(".map").css({
            'width': this.config.mapWidth + 'px',
            'height': this.config.mapHeight + 'px'
        });

        $(".map-wrapper").css({
            'width': this.config.mapWidth + this.config.textInitWidth + 'px',
            'height': '700px'
        });

        //On mouse enter show comarca name
        $('#map').mouseenter(function () {
            self.showComarcaName();
        });

        //On mouse leave hide comarca name
        $('#map').mouseleave(function () {
            self.hideComarcaName();
        });
    }

    showComarcaName(){
        for (const comarca in this.mappaths) {
            let obj = this.mcat[comarca];
            obj[1].show();
        }
    }

    hideComarcaName(){
        for (const comarca in this.mappaths) {
            let obj = this.mcat[comarca];
            if (obj[1].comarcaName != this.selected) {
                obj[1].hide();
            }
        }
    }

    responsiveResize(){
        if (this.config.debug) {
            console.log('responsiveResize ...');
        }

        this.winWidth = this.win.width();

        if (this.winWidth >= 960) {
            if (this.config.debug) {
                console.log('WindowWith > 960');
            }
            this.hideListShowMap();
            this.config.mapWidth = this.config.mapInitWidth * 0.8;
            this.config.mapHeight = this.config.mapInitHeight * 0.8;
            this.paper.scaleAll(this.config.scale);
            this.resizeMap();
        } else if (this.winWidth < 960 && this.winWidth >= 768) {
            if (this.config.debug) {
                console.log('768 =< WindowWith < 960 ');
            }
            this.hideMapShowList();
        } else if (this.winWidth < 768 && this.winWidth >= 480) {
            if (this.config.debug) {
                console.log('480 =< WindowWith < 768 ');
            }
            this.hideMapShowList();
        } else if (this.winWidth < 480) {
            if (this.config.debug) {
                console.log('480 < WindowWith');
            }
            this.hideMapShowList();
        }
        this.showValues();
    }

    hideMapShowList(){
        $('.map-wrapper').hide();
        $('.llistaComarques').show();
    }

    hideListShowMap(){
        $('.llistaComarques').hide();
        $('.map-wrapper').show();
    }

    loadMapAndText(){

        this.paper.scaleAll(this.config.scale);
        this.ratio = this.config.mapWidth / this.config.mapHeight;
        this.win = $(window);
        this.winWidth = this.win.width();

        if (this.config.debug) {
            console.log('calling loadMapAndText ...');
            console.log('Create map with : ' + this.config.mapWidth + ' height : ' + this.config.mapHeight);
            console.log('Scale map : ' + this.config.scale);
            console.log('Ratio : ' + this.ratio);
            console.log('Window With : ' + this.winWidth);
        }

        this.createArrayComarcas();
        this.createMap();
        this.createLlistaComarquesText();

    }

}

export default CatMap;
