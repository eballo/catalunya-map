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
        this.obj;
        this.selected;
        this.ratio;

        //Array of comarcas
        this.mcat = {};
    }

    createArrayComarcas(){
        if (this.config.debug) {
            console.log('createArrayComarcas ...');
        }

        this.mcat.cat1 = this.paper.set();
        this.mcat.cat2 = this.paper.set();
        this.mcat.cat3 = this.paper.set();
        this.mcat.cat4 = this.paper.set();
        this.mcat.cat5 = this.paper.set();
        this.mcat.cat6 = this.paper.set();
        this.mcat.cat7 = this.paper.set();
        this.mcat.cat8 = this.paper.set();
        this.mcat.cat9 = this.paper.set();
        this.mcat.cat10 = this.paper.set();
        this.mcat.cat11 = this.paper.set();
        this.mcat.cat12 = this.paper.set();
        this.mcat.cat13 = this.paper.set();
        this.mcat.cat14 = this.paper.set();
        this.mcat.cat15 = this.paper.set();
        this.mcat.cat16 = this.paper.set();
        this.mcat.cat17 = this.paper.set();
        this.mcat.cat18 = this.paper.set();
        this.mcat.cat19 = this.paper.set();
        this.mcat.cat20 = this.paper.set();
        this.mcat.cat21 = this.paper.set();
        this.mcat.cat22 = this.paper.set();
        this.mcat.cat23 = this.paper.set();
        this.mcat.cat24 = this.paper.set();
        this.mcat.cat25 = this.paper.set();
        this.mcat.cat26 = this.paper.set();
        this.mcat.cat27 = this.paper.set();
        this.mcat.cat28 = this.paper.set();
        this.mcat.cat29 = this.paper.set();
        this.mcat.cat30 = this.paper.set();
        this.mcat.cat31 = this.paper.set();
        this.mcat.cat32 = this.paper.set();
        this.mcat.cat33 = this.paper.set();
        this.mcat.cat34 = this.paper.set();
        this.mcat.cat35 = this.paper.set();
        this.mcat.cat36 = this.paper.set();
        this.mcat.cat37 = this.paper.set();
        this.mcat.cat38 = this.paper.set();
        this.mcat.cat39 = this.paper.set();
        this.mcat.cat40 = this.paper.set();
        this.mcat.cat41 = this.paper.set();
        this.mcat.cat42 = this.paper.set();
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

    createMap(paper){

        var config = this.config;
        var self = this;

        if (this.config.debug) {
            console.log('CreateMap ...');
        }

        var i = 0;
        for (var comarca in this.mappaths) {

            //Create obj
            var obj = this.mcat[comarca];

            // raphael object
            // object 0 (the map)
            obj.push(paper.path(this.mappaths[comarca].path).attr(this.config.comarcaAttr));
            obj.animate({
                transform: "t0,-200"
            });

            // object 1 and 2 (comarca name / capital comarca name)
            obj.push(paper.text(this.mappaths[comarca].nx, this.mappaths[comarca].ny, this.mappaths[comarca].name).attr(this.config.nomComcarcaAttr_out));
            obj.push(paper.text(this.mappaths[comarca].cx, this.mappaths[comarca].cy, this.mappaths[comarca].capital).attr(this.config.nomCapitalAttr));

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

            // Change the color of each comarca animation hover event
            obj.hover(function () { //hoverIn function
                var params = {
                    'fill': config.colorIn
                };
                this[0].animate(params, 100);
                this[1].attr(config.nomComcarcaAttr_in);
                this[2].show();
            }, function () { //hoverOut function
                var params = {
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

            if (this.config.useText) {
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
            $(window).resize(function () {
                self.responsiveResize();
            });
        } else {
            self.resizeMap(paper);
        }
    }

    remove_background(){
        var config = this.config;
        for (var comarca in this.mappaths) {
            var obj = this.mcat[comarca];
            //console.log('selected: ' + this.selected + ' Obj: ' + obj[0].comarcaName);
            if (obj[0].comarcaName != this.selected) {
                var params = {
                    'fill': config.colorOut
                };
                obj[0].animate(params, 100);
                obj[1].attr(config.nomComcarcaAttr_out);
                obj[2].hide();
            } else {
                //console.log('selected: ' + this.selected + ' = Obj: ' + obj[0].comarcaName);
            }
        }
    }

    onMapClick(comarcaName, capitalComarca, contentText, comarcaLink){

        if (this.config.onClick) {
            //console.log(comarcaLink);
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

                $('#veure-contingut').show();

                //$('#contentText').click(function() {
                //window.open(comarcaLink, 'window name', 'window settings');
                //window.location = comarcaLink;
                //return false;
                //});

                $('#veure-contingut').click(function () {
                    //window.open(comarcaLink, 'window name', 'window settings');
                    $(this).toggleClass("veure-clic");
                    window.location = comarcaLink;
                    return false;
                });

            }

            $('#comarcaName').html('<h1>' + comarcaName + '</h1><h2>' + capitalComarca + '</h2>');
            $('#contentText').html(contentText);

            //$('.legend-text-militar .total').hide();
            //$('.legend-text-militar .total').each(function(index) {
            //    $(this).delay(20 * index).fadeIn(500);
            //});

        }
    }

    resizeMap(paper){
        var self = this;

        if (this.config.debug) {
            console.log('resizeMap ...');
        }

        paper.changeSize(this.config.mapWidth, this.config.mapHeight, true, false);
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
        for (var comarca in this.mappaths) {
            //Create obj
            var obj = this.mcat[comarca];
            obj[1].show();
        }
    }

    hideComarcaName(){
        for (var comarca in this.mappaths) {
            //Create obj
            var obj = this.mcat[comarca];
            if (obj[1].comarcaName != this.selected) {
                obj[1].hide();
            }
        }
    }

    responsiveResize(){


        var self = this;

        if (this.config.debug) {
            console.log('responsiveResize ...');
        }

        this.winWidth = this.win.width();

        if (this.winWidth >= 960) {
            if (this.config.debug) {
                console.log('WindowWith > 960');
            }
            self.hideListShowMap();

            this.config.mapWidth = this.config.mapInitWidth * 0.8;
            this.config.mapHeight = this.config.mapInitHeight * 0.8;
            paper.scaleAll(this.config.scale);
            self.resizeMap(paper);

        } else if (this.winWidth < 960 && this.winWidth >= 768) {
            if (this.config.debug) {
                console.log('768 =< WindowWith < 960 ');
            }
            self.hideMapShowList();

            //this.config.mapWidth =  mapInitWidth;
            //this.config.mapHeight = this.config.mapWidth/ratio;
            //paper.scaleAll(this.config.scale/2);
            //resizeMap(paper);

        } else if (this.winWidth < 768 && this.winWidth >= 480) {
            if (this.config.debug) {
                console.log('480 =< WindowWith < 768 ');
            }

            //this.config.mapWidth = mapInitWidth;
            //this.config.mapHeight = this.config.mapWidth/ratio;
            //resizeMap(paper);

            self.hideMapShowList();
        } else if (this.winWidth < 480) {
            if (this.config.debug) {
                console.log('480 < WindowWith');
            }

            //this.config.mapWidth = mapInitWidth /2;
            //this.config.mapHeight = this.config.mapWidth/ratio;
            //resizeMap(paper);

            self.hideMapShowList();

        }

        self.showValues();

    }

    hideMapShowList(){
        $('.map-wrapper').hide();
        $('.llistaComarques').show();
    }

    hideListShowMap(){
        $('.llistaComarques').hide();
        $('.map-wrapper').show();
    }

    showValues(){
        if (this.config.debug) {
            console.log('showValues ...');
            console.log("Win Width: " + this.winWidth + " Map with: " + this.config.mapWidth + " Map Height: " + this.config.mapHeight + " Ratio: " + this.ratio);
            $("#this.config.debugInfo").html("Win Width: " + this.winWidth + " Map with: " + this.config.mapWidth + " Map Height: " + this.config.mapHeight + " Ratio: " + this.ratio);
        }
    }

    loadMapAndText(){
        var self = this;

        if (this.config.debug) {
            console.log('loadMapAndText ...');
            console.log('Create map with : ' + this.config.mapWidth + ' height : ' + this.config.mapHeight);
        }

        //apply the this.config.scale value
        if (this.config.debug) {
            console.log('scale map : ' + this.config.scale);
        }

        this.paper.scaleAll(this.config.scale);

        this.ratio = this.config.mapWidth / this.config.mapHeight;

        if (this.config.debug) {
            console.log('ratio : ' + this.ratio);
        }

        this.win = $(window);
        this.winWidth = this.win.width();

        if (this.config.debug) {
            console.log('Window With : ' + this.winWidth);
        }

        //create array
        self.createArrayComarcas();

        //create map
        self.createMap(this.paper);

        //create list
        self.createLlistaComarquesText();

    }

}

export default CatMap;
