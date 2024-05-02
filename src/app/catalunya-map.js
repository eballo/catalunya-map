

/**
 * Catalunya Medieval 2015-2024 - Open Source Catalunya Map
 *
 * Author  : Enric Ballo
 * version : 11.0
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
        this.mcat = {}; //Array of comarques
    }

    showValues(){
        if (this.config.debug) {
            console.log('ShowValues ...');
            console.log("Win Width: " + this.winWidth + " Map with: " + this.config.mapWidth + " Map Height: " + this.config.mapHeight + " Ratio: " + this.ratio);
            $('#debugInfo').html("Win Width: " + this.winWidth + " Map with: " + this.config.mapWidth + " Map Height: " + this.config.mapHeight + " Ratio: " + this.ratio);
        }
    }

    createArrayComarcas(){
        if (this.config.debug) {
            console.log('Create Array of Comarques');
        }
        for (const comarca in this.mappaths) {
            this.mcat[comarca] = this.paper.set()
        }
    }

    createLlistaComarquesText(){
        if(this.config.useListText) {
            if (this.config.debug) {
                console.log('Create list of Comarques');
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
        }else{
            if(this.config.debug){
                console.log("Create list comarques is disabled")
            }
        }
    }

    createMap(){

        if (this.config.debug) {
            console.log('CreateMap');
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
                if (self.selected !== this[0].comarcaName) {
                    this[0].animate(params, 100);
                    this[1].attr(config.nomComcarcaAttr_out);
                    this[2].hide();

                } else {
                    //if it is the selected comarca on hover out - remove the capital
                    //this[2].hide();
                }
            }, obj, obj);

            if (config.useText) {
                if (this.config.debug) {
                    console.log("useText is enabled");
                }

                for (let i = 0; i < 3; i++) {
                    // on click event
                    obj[i].click(function () {
                        self.selected = this.comarcaName;
                        self.remove_background();
                        self.onMapClick(this.comarcaName, this.capitalComarca, this.contentText, this.comarcaLink);
                    });

                    // touch event
                    obj[i].touchstart(function () {
                        self.selected = this.comarcaName;
                        self.remove_background();
                        self.onMapClick(this.comarcaName, this.capitalComarca, this.contentText, this.comarcaLink);
                    });
                }
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

        const path = this.paper.path(this.mappaths[comarca].path);
        path.attr(this.config.comarcaAttr)

        // Raphael Object - object 0 (the map)
        obj.push(path);

        const bbox = path.getBBox();
        const {comarca_x, capital_x, comarca_y, capital_y} = this.get_comarca_and_capital_positions_label(comarca, bbox);

        // Object 1 and 2 (comarca name / capital comarca name)
        obj.push(this.paper.text(comarca_x, comarca_y, this.mappaths[comarca].name).attr(this.config.nomComcarcaAttr_out));
        obj.push(this.paper.text(capital_x, capital_y, this.mappaths[comarca].capital).attr(this.config.nomCapitalAttr));

        for (let i = 0; i < 3; i++) {
            // populate  all the values to all array objects to have it available
            obj[i].comarcaName = this.mappaths[comarca].name;
            obj[i].capitalComarca = this.mappaths[comarca].capital;
            obj[i].contentText = this.mappaths[comarca].info;
            obj[i].comarcaLink = this.mappaths[comarca].url;
        }

        obj[0].node.id = i;
        obj[0].toBack();

        obj[1].toFront();
        obj[2].toFront();

        //Initial status hidden
        obj[1].hide();
        obj[2].hide();

        return obj;
    }

    get_comarca_and_capital_positions_label(comarca, bbox) {
        let extra_x = 0;
        let extra_y = 0;
        if (this.mappaths[comarca].extra_x) {
            extra_x = this.mappaths[comarca].extra_x;
        }

        if (this.mappaths[comarca].extra_y) {
            extra_y = this.mappaths[comarca].extra_y;
        }

        const space_comarca = 15;
        const comarca_x = bbox.x + ((bbox.width + extra_x) / 2);
        const capital_x = comarca_x;

        const comarca_y = bbox.y + ((bbox.height + extra_y) / 2);
        const capital_y = comarca_y + space_comarca;
        return {comarca_x, capital_x, comarca_y, capital_y};
    }

    remove_background(){
        for (const comarca in this.mappaths) {
            let obj = this.mcat[comarca];
            if (obj[0].comarcaName !== this.selected) {
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
                    console.log('Button functionality enabled');
                }
                $('#veure-contingut').show().click(function () {
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
            console.log('ResizeMap');
        }
        let self = this;

        this.paper.changeSize(this.config.mapWidth, this.config.mapHeight, true, false);
        if (this.config.debug) {
            console.log('Resize map with : ' + this.config.mapWidth + ' height : ' + this.config.mapHeight);
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
            if (obj[1].comarcaName !== this.selected) {
                obj[1].hide();
            }
        }
    }

    responsiveResize(){
        if (this.config.debug) {
            console.log('ResponsiveResize');
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
            console.log('Calling loadMapAndText ...');
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
