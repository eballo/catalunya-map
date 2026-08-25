import config from "./catalunya-map-config";
import CatMap from "./catalunya-map";

const BUILDING_TYPES = [
    { category: 'castell',               categoryName: 'Castells',               type: 'militar'  },
    { category: 'epoca-carlina',         categoryName: "Època Carlina",           type: 'militar'  },
    { category: 'muralles',              categoryName: 'Muralles',               type: 'militar'  },
    { category: 'torre',                 categoryName: 'Torres',                 type: 'militar'  },
    { category: 'casa-forta',            categoryName: 'Cases Fortes',           type: 'civil'    },
    { category: 'palau',                 categoryName: 'Palaus',                 type: 'civil'    },
    { category: 'pont',                  categoryName: 'Ponts',                  type: 'civil'    },
    { category: 'torre-colomer',         categoryName: 'Torres Colomer',         type: 'civil'    },
    { category: 'basilica',              categoryName: 'Basíliques',             type: 'religios' },
    { category: 'catedral',              categoryName: 'Catedrals',              type: 'religios' },
    { category: 'ermita',               categoryName: 'Ermites',               type: 'religios' },
    { category: 'esglesia',              categoryName: 'Esglésies',              type: 'religios' },
    { category: 'esglesia-fortificada',  categoryName: 'Esglésies fortificades', type: 'religios' },
    { category: 'monestir',              categoryName: 'Monestirs',              type: 'religios' },
    { category: 'altres-llocs-dinteres', categoryName: "Altres llocs d'Interés", type: 'altres'   },
];

function buildComarcaStats(comarcaName, markersByComarca, imagesUrl, comarcaUrl) {
    const markers = markersByComarca[comarcaName] || [];

    const counts = {};
    markers.forEach(function (m) {
        var t = m.tipus || '';
        counts[t] = (counts[t] || 0) + 1;
    });
    const total = markers.length;

    var rows = '';
    BUILDING_TYPES.forEach(function (def) {
        var count = counts[def.category] || 0;
        var icon = imagesUrl
            ? "<img src='" + imagesUrl + def.type + '/' + def.category + '/' + def.category + "8.png' class='cm-type-icon' alt=''>"
            : '';
        var zeroClass = count === 0 ? " cm-type-item--zero" : '';
        rows += "<li class='cm-type-item legend-text-" + def.type + zeroClass + "'>" +
                "<a href='" + comarcaUrl + '#' + def.category + "'>" +
                icon +
                "<span class='cm-type-name'>" + def.categoryName + "</span>" +
                "<span class='cm-type-count'>" + (count > 0 ? count : '–') + "</span>" +
                "</a></li>";
    });
    rows += "<li class='cm-type-item cm-type-total'>" +
            "<a href='" + comarcaUrl + "'>" +
            "<span class='cm-type-name'>Total</span>" +
            "<span class='cm-type-count'>" + total + "</span>" +
            "</a></li>";

    return {
        total: total,
        info:  "<div class='cm-comarca-info'><ul class='cm-type-list'>" + rows + "</ul></div>"
    };
}

$(document).ready(function () {
    var comarquesUrl = config.comarquesJsonUrl;
    var markersUrl   = config.markersJsonUrl   || '';

    // Prefer an explicitly configured imagesUrl; fall back to deriving it from
    // comarquesJsonUrl's path. The derivation only works while that URL really
    // is the path to the JSON file — a host serving it through an API endpoint
    // instead has no such path to rewrite, and must set imagesUrl itself.
    var imagesUrl = config.imagesUrl
        || (comarquesUrl
            ? comarquesUrl.split('?')[0].replace('pages/js/catalunya-comarques.json', 'pages/images/')
            : '');

    var p1 = fetch(comarquesUrl).then(function (r) { return r.json(); });
    var p2 = markersUrl
        ? fetch(markersUrl).then(function (r) { return r.json(); })
        : Promise.resolve([]);

    Promise.all([p1, p2])
        .then(function (results) {
            var comarques = results[0];
            var markers   = results[1];

            var markersByComarca = {};
            markers.forEach(function (m) {
                var name = m.comarca || '';
                if (!markersByComarca[name]) markersByComarca[name] = [];
                markersByComarca[name].push(m);
            });

            Object.keys(comarques).forEach(function (key) {
                var comarca = comarques[key];
                var stats   = buildComarcaStats(comarca.name, markersByComarca, imagesUrl, comarca.url);
                comarca.total = stats.total;
                comarca.info  = stats.info;
            });

            const map = new CatMap(config, comarques);
            window.cmMapManager = map;
            map.loadMapAndText();

            $("#text").fadeIn(1000);
            $("#contentText").show();
            $("#legend").fadeIn(1000);
            $("#map-overlay").fadeOut(1500);
        })
        .catch(function (err) {
            console.error('Error loading map data:', err);
        });
});
