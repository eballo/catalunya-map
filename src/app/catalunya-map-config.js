export function stringToBoolean(string) {
    return string.toLowerCase() === "false" ? false : Boolean(string);
}

/**
 * Value of a CSS custom property on <html>, or `fallback` when it is not set
 * (or there is no DOM at all, e.g. under Jest).
 *
 * Raphael paints the comarca shapes with SVG presentation attributes, so a
 * stylesheet cannot restyle them the way it can the side panel. Reading the
 * same tokens the stylesheet defines keeps both in step, and reading them on
 * every access — the colours below are getters — means a theme switch is
 * picked up on the next hover or redraw without re-creating the map.
 */
export function cssColour(name, fallback) {
    if (typeof document === 'undefined' || !document.documentElement) return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    return value?.trim() || fallback;
}

const MAP_CONFIG = {

    comarquesJsonUrl: (typeof catalunyaMapConfig !== 'undefined' && catalunyaMapConfig.comarquesJsonUrl)
        ? catalunyaMapConfig.comarquesJsonUrl
        : '',

    // Needed to do the total calculation
    markersJsonUrl: (typeof catalunyaMapConfig !== 'undefined' && catalunyaMapConfig.markersJsonUrl)
        ? catalunyaMapConfig.markersJsonUrl
        : '',

    // Base URL for the building-type icons. Optional: when empty, it's derived
    // from comarquesJsonUrl (see catalunya-map-main.js). Set it explicitly when
    // comarquesJsonUrl doesn't look like a path to the JSON file — e.g. when the
    // host serves that JSON through an API endpoint rather than a static file,
    // which makes the derivation impossible.
    imagesUrl: (typeof catalunyaMapConfig !== 'undefined' && catalunyaMapConfig.imagesUrl)
        ? catalunyaMapConfig.imagesUrl
        : '',

    responsive: stringToBoolean(process.env.RESPONSIVE ?? 'true'),
    useText: stringToBoolean(process.env.USE_TEXT ?? 'true'),
    useListText: stringToBoolean(process.env.USE_LIST_TEXT ?? 'false'),
    button: stringToBoolean(process.env.BUTTON ?? 'false'),
    onClick: stringToBoolean(process.env.ON_CLICK ?? 'false'),
    newWindow: stringToBoolean(process.env.NEW_WINDOW ?? 'false'),

    get colorIn() { return cssColour('--cm-comarca-fill-hover', process.env.COLOR_IN ?? '#fee8cb'); },
    get colorOut() { return cssColour('--cm-comarca-fill', process.env.COLOR_OUT ?? '#fff'); },

    scale: parseFloat(process.env.SCALE ?? '0.8'),

    mapInitWidth: parseInt(process.env.MAP_INIT_WIDTH ?? '825'),
    mapInitHeight: parseInt(process.env.MAP_INIT_HEIGHT ?? '800'),
    textInitWidth: parseInt(process.env.TEXT_INIT_WIDTH ?? '280'),
    mapWidth: parseInt(process.env.MAP_WIDTH ?? '825'),
    mapHeight: parseInt(process.env.MAP_HEIGHT ?? '800'),

    // --------- Comarca style configuration
    comarcaAttr: {
        get 'fill'() { return cssColour('--cm-comarca-fill', '#fff'); },
        get 'stroke'() { return cssColour('--cm-comarca-stroke', '#c7ab89'); },
        'stroke-width': 0.8,
        'stroke-linejoin': 'round',
        'font-family': 'Droid Sans,Verdana',
        'font-size': '19px',
        'font-weight': 'bold',
        'cursor': 'pointer',
        'z-index': 10
    },

    // --------- Nom comarca style configuration for hover in
    nomComcarcaAttr_in: {
        get 'fill'() { return cssColour('--cm-comarca-name', '#a07a49'); },
        get 'stroke'() { return cssColour('--cm-comarca-label', '#000000'); },
        'stroke-width': 0.4,
        'font-family': 'Droid Sans,Verdana',
        'font-size': '14px',
        'font-weight': 'bold',
        'cursor': 'pointer',
        'z-index': 20
    },

    // --------- Nom comarca style configuration for hover out
    nomComcarcaAttr_out: {
        get 'fill'() { return cssColour('--cm-comarca-name', '#a07a49'); },
        'stroke-width': 0,
        'font-family': 'Droid Sans,Verdana',
        'font-size': '14px',
        'font-weight': 'bold',
        'cursor': 'pointer',
        'z-index': 20
    },

    // --------- Nom capital comarca style configuration
    nomCapitalAttr: {
        get 'fill'() { return cssColour('--cm-comarca-capital', '#FF9900'); },
        'font-family': 'Droid Sans, Arial, sans-serif',
        'font-size': '12px',
        'font-weight': 'bold',
        'cursor': 'pointer',
        'z-index': 30
    }
};

export default MAP_CONFIG;
