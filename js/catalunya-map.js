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

      //Array of comarcas
      this.mcat = [];
    }

    Catmap.prototype = {

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

        if (this.config.debug) {
          console.log(llistaComarques);
        }

        // Order the list by name
        llistaComarques = llistaComarques.sort(function(a, b) {
          return a.name.localeCompare(b.name);
        });

        // Create list with bootstrap styles
        for (i = 0; i < llistaComarques.length; i++) {
          $("<li class='list-group-item'><a href='" + llistaComarques[i].url + "' class='list-group-item'>" + llistaComarques[i].name + "<span class='badge'>" + llistaComarques[i].total + "</span></a></li>").appendTo("ul.list");
        }
      },

      createComarca: function(paper, id, replacePosition=false) {

        var config = this.config;
        var self = this;

        if (this.config.debug) {
          console.log(this.mappaths);
          console.log(Object.values(this.mappaths)[id]);
        }

        comarca = Object.values(this.mappaths)[id];
        key = Object.keys(this.mappaths)[id];

        if (this.config.debug) {
          console.log('CreateComarca ...');
          console.log('id:' + id);
          console.log('comarca:' + comarca.name);
          console.log('comarca:' + comarca.capital);
          console.log('key:' + key);
        }

        // raphael object
        var obj = paper.set();

        var path = comarca.path;
        if (replacePosition) {
          // replace the x,y position for 200.00000,400.0000
          if(this.config.debug) {
            console.log('path:'+path);
          }
          path = path.replace(/m \w+.\w+,\w+.\w+/, 'm 100, 100 ');
        }

        // object 0 (the map)
        p = paper.path(path);
        p.attr(this.config.comarcaAttr);
        p.translate(0,0);
        obj.push(p);
        //obj.animate({ transform: "t0,-200"});

        // object 1 and 2 (comarca name / capital comarca name)
        obj.push(paper.text(comarca.nx, comarca.ny, comarca.name).attr(this.config.nomComcarcaAttr_out));
        obj.push(paper.text(comarca.cx, comarca.cy, comarca.capital).attr(this.config.nomCapitalAttr));

        obj[0].comarcaName = comarca.name;
        obj[1].comarcaName = comarca.name;
        obj[2].comarcaName = comarca.name;

        obj[0].contentText = comarca.info;
        obj[1].contentText = comarca.info;
        obj[2].contentText = comarca.info;

        obj[0].comarcaLink = comarca.url;
        obj[1].comarcaLink = comarca.url;
        obj[2].comarcaLink = comarca.url;

        obj[0].node.id = key;
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
          this[0].animate(params, 100);
          this[1].attr(config.nomComcarcaAttr_out);
          this[2].hide();
        }, obj, obj);

        if (this.config.useText) {
          // on click event
          obj[0].click(function() {
            var comarcaName = this.comarcaName;
            var contentText = this.contentText;
            var comarcaLink = this.comarcaLink;
            self.onMapClick(comarcaName, contentText, comarcaLink);
          });

          obj[1].click(function() {
            var comarcaName = this.comarcaName;
            var contentText = this.contentText;
            var comarcaLink = this.comarcaLink;
            self.onMapClick(comarcaName, contentText, comarcaLink);
          });

          obj[2].click(function() {
            var comarcaName = this.comarcaName;
            var contentText = this.contentText;
            var comarcaLink = this.comarcaLink;
            self.onMapClick(comarcaName, contentText, comarcaLink);
          });

          obj[0].touchstart(function() {
            var comarcaName = this.comarcaName;
            var contentText = this.contentText;
            var comarcaLink = this.comarcaLink;
            self.onMapClick(comarcaName, contentText, comarcaLink);
          });

          obj[1].touchstart(function() {
            var comarcaName = this.comarcaName;
            var contentText = this.contentText;
            var comarcaLink = this.comarcaLink;
            self.onMapClick(comarcaName, contentText, comarcaLink);
          });

          obj[2].touchstart(function() {
            var comarcaName = this.comarcaName;
            var contentText = this.contentText;
            var comarcaLink = this.comarcaLink;
            self.onMapClick(comarcaName, contentText, comarcaLink);
          });
        }

        this.mcat.push(obj);

      },

      /**
       * Function that create the map based in the mappaths array
       *
       * @param  {[type]} paper [the raphaelJs paper object]
       *
       */
      createMap: function(paper) {

        if (this.config.debug) {
          console.log('CreateMap ...');
        }

        //We have 42 comarques
        for (var i = 0; i <= 41; i++) {
          this.createComarca(paper, i);
        }

        this.resizeFunctionality();

      },

      resizeFunctionality: function() {

        if (this.config.debug) {
          console.log('resizeFunctionality ...');
        }

        var self = this;
        if (this.config.responsive) {
          this.responsiveResize();
          $(window).resize(function() {
            self.responsiveResize();
          });
        } else {
          this.resizeMap(paper);
        }
      },

      /**
       * On Map click show the information text
       * @return {[type]} [description]
       */
      onMapClick: function(comarcaName, contentText, comarcaLink) {
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

            $('#veure-contingut').show();

            $('#contentText').click(function() {
              //window.open(comarcaLink, 'window name', 'window settings');
              window.location = comarcaLink;
              return false;
            });
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

        $(".mapWrapper").css({
          'width': this.config.mapWidth + this.config.textInitWidth + 'px',
          'height': this.config.mapHeight + 'px'
        });

        $(".comarcaWrapper").css({
          'width': this.config.mapWidth + this.config.textInitWidth + 'px',
          'height': this.config.mapHeight + 'px'
        });

        //On mouse enter show comarca name
        $('.mapWrapper').mouseenter(function() {
          self.showComarcaName();
        });

        //On mouse leave hide comarca name
        $('.mapWrapper').mouseleave(function() {
          self.hideComarcaName();
        });

      },

      /**
       * show comarca name
       * @return {[type]} [description]
       */
      showComarcaName: function() {
        for (var i = 0; i < this.mcat.length; i++) {
          this.mcat[i][1].show();
        }
      },

      /**
       * hide comarca name
       * @return {[type]} [description]
       */
      hideComarcaName: function() {
        for (var i = 0; i < this.mcat.length; i++) {
          this.mcat[i][1].hide();
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
        $('.mapWrapper').hide();
        $('.llistaComarques').show();
      },

      hideListShowMap: function() {
        $('.llistaComarques').hide();
        $('.mapWrapper').show();
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
          console.log('Create map with : ' + this.config.mapInitWidth + ' height : ' + this.config.mapInitHeight);
        }

        paper = new ScaleRaphael('map', this.config.mapInitWidth, this.config.mapInitHeight);

        //apply the this.config.scale value
        if (this.config.debug) {
          console.log('scale map : ' + this.config.scale);
        }

        paper.scaleAll(this.config.scale);

        ratio = this.config.mapInitWidth / this.config.mapInitHeight;

        if (this.config.debug) {
          console.log('ratio : ' + ratio);
        }

        win = $(window);
        winWidth = win.width();

        if (this.config.debug) {
          console.log('Window With : ' + winWidth);
        }

        //create map
        self.createMap(paper);

        //create list
        self.createLlistaComarquesText();

      },

      /**
       * Get the comarca
       * @return {[type]} [description]
       */
      getComarca: function(id) {

        if (this.config.debug) {
          console.log('getComarca ...');
          console.log('Create area with : ' + this.config.mapInitWidth + ' height : ' + this.config.mapInitHeight);
        }

        paper = new ScaleRaphael('comarca', this.config.mapInitWidth, this.config.mapInitHeight);

        //apply the this.config.scale value
        if (this.config.debug) {
          console.log('scale area : ' + this.config.scale);
        }

        paper.scaleAll(this.config.scale);

        ratio = this.config.mapInitWidth / this.config.mapInitHeight;

        if (this.config.debug) {
          console.log('ratio : ' + ratio);
        }

        win = $(window);
        winWidth = win.width();

        if (this.config.debug) {
          console.log('Window With : ' + winWidth);
        }

        //create map
        this.createComarca(paper, id, true);
        this.resizeFunctionality();
        this.resizeCanvas();

      },

      resizeCanvas: function() {
        //paper.setViewBox(0, 10, 200, 200, true);
        //paper.setSize('100%', '100%');
        //$('#comarca').width(200);
        //$('#comarca').height(200);
      }

    }

    return Catmap;

  }());

  Catmap.create = function(opts, json) {
    return new Catmap(opts, json);
  };

  window.Catmap = Catmap;

}(window));
