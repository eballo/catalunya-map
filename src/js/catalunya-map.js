/**
 * Catalunya Medieval 2015-2017 - Open Source Catalunya Map
 *
 * Author  : Enric Ballo
 * version : 7.0
 *
 */
;
$(function(window) {

    //---------------------------
    // Catmap Constructor
    //---------------------------
    var Catmap = (function() {
        function Catmap(opts, json) {
            this.config = opts;
            this.mappaths = json;
            this.paper;
            this.winWidth;
            this.win;
            this.obj;
            this.selected;

            //Array of comarcas
            this.mcat = {};
        }

        Catmap.prototype = {

            /**
             * Function that create the Array of Comarcas
             * set the mcat array
             */
            createArrayComarcas: function() {
                if (this.config.debug) {
                    console.log('createArrayComarcas ...');
                }

                this.mcat.cat1 = paper.set();
                this.mcat.cat2 = paper.set();
                this.mcat.cat3 = paper.set();
                this.mcat.cat4 = paper.set();
                this.mcat.cat5 = paper.set();
                this.mcat.cat6 = paper.set();
                this.mcat.cat7 = paper.set();
                this.mcat.cat8 = paper.set();
                this.mcat.cat9 = paper.set();
                this.mcat.cat10 = paper.set();
                this.mcat.cat11 = paper.set();
                this.mcat.cat12 = paper.set();
                this.mcat.cat13 = paper.set();
                this.mcat.cat14 = paper.set();
                this.mcat.cat15 = paper.set();
                this.mcat.cat16 = paper.set();
                this.mcat.cat17 = paper.set();
                this.mcat.cat18 = paper.set();
                this.mcat.cat19 = paper.set();
                this.mcat.cat20 = paper.set();
                this.mcat.cat21 = paper.set();
                this.mcat.cat22 = paper.set();
                this.mcat.cat23 = paper.set();
                this.mcat.cat24 = paper.set();
                this.mcat.cat25 = paper.set();
                this.mcat.cat26 = paper.set();
                this.mcat.cat27 = paper.set();
                this.mcat.cat28 = paper.set();
                this.mcat.cat29 = paper.set();
                this.mcat.cat30 = paper.set();
                this.mcat.cat31 = paper.set();
                this.mcat.cat32 = paper.set();
                this.mcat.cat33 = paper.set();
                this.mcat.cat34 = paper.set();
                this.mcat.cat35 = paper.set();
                this.mcat.cat36 = paper.set();
                this.mcat.cat37 = paper.set();
                this.mcat.cat38 = paper.set();
                this.mcat.cat39 = paper.set();
                this.mcat.cat40 = paper.set();
                this.mcat.cat41 = paper.set();
                this.mcat.cat42 = paper.set();
            },

            /**
             * Function that create a text list of all the comarques
             *
             */
            createLlistaComarquesText: function() {
                if (this.config.debug) {
                    console.log('create list of comarques ...');
                }

                var llistaComarques = [];
                for (var comarca in this.mappaths) {
                    llistaComarques.push({
                        name: this.mappaths[comarca].name,
                        url: this.mappaths[comarca].url,
                        total: this.mappaths[comarca].total
                    });
                }

                //console.log(llistaComarques);

                // Order the list by name
                llistaComarques = llistaComarques.sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });

                // Create list with bootstrap styles
                for (i = 0; i < llistaComarques.length; i++) {
                    $("<li class='list-group-item'><a href='" + llistaComarques[i].url + "' class='list-group-item'>" + llistaComarques[i].name + "<span class='badge'>" + llistaComarques[i].total + "</span></a></li>").appendTo("ul.list");
                }
            },

            /**
             * Function that create the map based in the mappaths array
             *
             * @param  {[type]} paper [the raphaelJs paper object]
             *
             */
            createMap: function(paper) {
                var config = this.config;
                var self = this;

                if (this.config.debug) {
                    console.log('CreateMap ...');
                }

                var i = 0;
                for (var comarca in this.mappaths) {

                    //Create obj
                    obj = this.mcat[comarca];

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
                    obj.hover(function() { //hoverIn function
                        var params = {
                            'fill': config.colorIn
                        };
                        this[0].animate(params, 100);
                        this[1].attr(config.nomComcarcaAttr_in);
                        this[2].show();
                    }, function() { //hoverOut function
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
                            this[2].hide();
                        }
                    }, obj, obj);

                    if (this.config.useText) {
                        // on click event
                        obj[0].click(function() {
                            var comarcaName = this.comarcaName;
                            var contentText = this.contentText;
                            var comarcaLink = this.comarcaLink;
                            self.selected = this.comarcaName;
                            self.remove_background();
                            self.onMapClick(comarcaName, contentText, comarcaLink);
                        });

                        obj[1].click(function() {
                            var comarcaName = this.comarcaName;
                            var contentText = this.contentText;
                            var comarcaLink = this.comarcaLink;
                            self.selected = this.comarcaName;
                            self.remove_background();
                            self.onMapClick(comarcaName, contentText, comarcaLink);
                        });

                        obj[2].click(function() {
                            var comarcaName = this.comarcaName;
                            var contentText = this.contentText;
                            var comarcaLink = this.comarcaLink;
                            self.selected = this.comarcaName;
                            self.remove_background();
                            self.onMapClick(comarcaName, contentText, comarcaLink);
                        });

                        obj[0].touchstart(function() {
                            var comarcaName = this.comarcaName;
                            var contentText = this.contentText;
                            var comarcaLink = this.comarcaLink;
                            self.selected = this.comarcaName;
                            self.remove_background();
                            self.onMapClick(comarcaName, contentText, comarcaLink);
                        });

                        obj[1].touchstart(function() {
                            var comarcaName = this.comarcaName;
                            var contentText = this.contentText;
                            var comarcaLink = this.comarcaLink;
                            self.selected = this.comarcaName;
                            self.remove_background();
                            self.onMapClick(comarcaName, contentText, comarcaLink);
                        });

                        obj[2].touchstart(function() {
                            var comarcaName = this.comarcaName;
                            var contentText = this.contentText;
                            var comarcaLink = this.comarcaLink;
                            self.selected = this.comarcaName;
                            self.remove_background();
                            self.onMapClick(comarcaName, contentText, comarcaLink);
                        });
                    }

                    i++;
                }

                if (this.config.responsive) {
                    self.responsiveResize();
                    $(window).resize(function() {
                        self.responsiveResize();
                    });
                } else {
                    self.resizeMap(paper);
                }

            },
            /**
             * Remove the background if it is not the selected one
             */
            remove_background: function() {
                var config = this.config;
                for (var comarca in this.mappaths) {
                    obj = this.mcat[comarca];
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
            },

            /**
             * On Map click show the information text
             * @return {[type]} [description]
             */
            onMapClick: function(comarcaName, contentText, comarcaLink) {
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

                        $('#veure-contingut').click(function() {
                            //window.open(comarcaLink, 'window name', 'window settings');
                            $(this).toggleClass("veure-clic");
                            window.location = comarcaLink;
                            return false;
                        });

                    }

                    $('#comarcaName').html('<h1>' + comarcaName + '</h1>');
                    $('#contentText').html(contentText);
                }
            },

            /**
             * resize the map on change
             *
             * @param  {[type]} paper [the raphaelJs paper object]
             *
             */
            resizeMap: function(paper) {

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
                    'height': this.config.mapHeight + 'px'
                });

                //On mouse enter show comarca name
                $('.map-wrapper').mouseenter(function() {
                    self.showComarcaName();
                });

                //On mouse leave hide comarca name
                $('.map-wrapper').mouseleave(function() {
                    self.hideComarcaName();
                });

            },

            /**
             * show comarca name
             * @return {[type]} [description]
             */
            showComarcaName: function() {
                for (var comarca in this.mappaths) {
                    //Create obj
                    obj = this.mcat[comarca];
                    obj[1].show();
                }
            },

            /**
             * hide comarca name
             * @return {[type]} [description]
             */
            hideComarcaName: function() {
                for (var comarca in this.mappaths) {
                    //Create obj
                    obj = this.mcat[comarca];
                    obj[1].hide();
                }
            },

            /**
             * Map Responsive Resize
             * @return {[type]} [description]
             */
            responsiveResize: function() {

                var self = this;

                if (this.config.debug) {
                    console.log('responsiveResize ...');
                }

                winWidth = win.width();

                if (winWidth >= 960) {
                    if (this.config.debug) {
                        console.log('WindowWith > 960');
                    }
                    self.hideListShowMap();

                    this.config.mapWidth = this.config.mapInitWidth * 0.8;
                    this.config.mapHeight = this.config.mapInitHeight * 0.8;
                    paper.scaleAll(this.config.scale);
                    self.resizeMap(paper);

                } else if (winWidth < 960 && winWidth >= 768) {
                    if (this.config.debug) {
                        console.log('768 =< WindowWith < 960 ');
                    }
                    self.hideMapShowList();

                    //this.config.mapWidth =  mapInitWidth;
                    //this.config.mapHeight = this.config.mapWidth/ratio;
                    //paper.scaleAll(this.config.scale/2);
                    //resizeMap(paper);

                } else if (winWidth < 768 && winWidth >= 480) {
                    if (this.config.debug) {
                        console.log('480 =< WindowWith < 768 ');
                    }

                    //this.config.mapWidth = mapInitWidth;
                    //this.config.mapHeight = this.config.mapWidth/ratio;
                    //resizeMap(paper);

                    self.hideMapShowList();
                } else if (winWidth < 480) {
                    if (this.config.debug) {
                        console.log('480 < WindowWith');
                    }

                    //this.config.mapWidth = mapInitWidth /2;
                    //this.config.mapHeight = this.config.mapWidth/ratio;
                    //resizeMap(paper);

                    self.hideMapShowList();

                }

                self.showValues();
            },

            hideMapShowList: function() {
                $('.map-wrapper').hide();
                $('.llistaComarques').show();
            },

            hideListShowMap: function() {
                $('.llistaComarques').hide();
                $('.map-wrapper').show();
            },

            /**
             * this.config.debug porpouse function
             * @return {[type]} [description]
             */
            showValues: function() {
                if (this.config.debug) {
                    console.log('showValues ...');
                    console.log("Win Width: " + winWidth + " Map with: " + this.config.mapWidth + " Map Height: " + this.config.mapHeight + " Ratio: " + ratio);
                    $("#this.config.debugInfo").html("Win Width: " + winWidth + " Map with: " + this.config.mapWidth + " Map Height: " + this.config.mapHeight + " Ratio: " + ratio);
                }
            },

            /**
             * Load the map and the text
             * @return {[type]} [description]
             */
            loadMapAndText: function() {

                var self = this;

                if (this.config.debug) {
                    console.log('loadMapAndText ...');
                    console.log('Create map with : ' + this.config.mapWidth + ' height : ' + this.config.mapHeight);
                }

                paper = new ScaleRaphael('map', this.config.mapWidth, this.config.mapHeight);

                //apply the this.config.scale value
                if (this.config.debug) {
                    console.log('scale map : ' + this.config.scale);
                }

                paper.scaleAll(this.config.scale);

                ratio = this.config.mapWidth / this.config.mapHeight;

                if (this.config.debug) {
                    console.log('ratio : ' + ratio);
                }

                win = $(window);
                winWidth = win.width();

                if (this.config.debug) {
                    console.log('Window With : ' + winWidth);
                }

                //create array
                self.createArrayComarcas();

                //create map
                self.createMap(paper);

                //create list
                self.createLlistaComarquesText();

            }

        }

        return Catmap;

    }());

    Catmap.create = function(opts, json) {
        return new Catmap(opts, json);
    };

    window.Catmap = Catmap;

}(window));
