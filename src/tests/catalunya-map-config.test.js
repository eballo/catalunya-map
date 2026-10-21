import MAP_CONFIG, {stringToBoolean, choroplethClass} from '../app/catalunya-map-config'
import {afterEach, describe, expect, test, jest} from "@jest/globals";

describe('stringToBoolean', () => {
    test('should return true for "true" string', () => {
        expect(stringToBoolean("true")).toBe(true);
    });

    test('should return false for "false" string', () => {
        expect(stringToBoolean("false")).toBe(false);
    });

    test('should return true for any non-"false" string', () => {
        expect(stringToBoolean("yes")).toBe(true);
        expect(stringToBoolean("no")).toBe(true); // "no" is considered true unless explicitly checking for "false"
    });

    test('should handle uppercase and mixed case inputs', () => {
        expect(stringToBoolean("FALSE")).toBe(false);
        expect(stringToBoolean("True")).toBe(true);
    });
});

describe('MAP_CONFIG with catalunyaMapConfig defined', () => {
    test('uses catalunyaMapConfig values when defined', () => {
        global.catalunyaMapConfig = {
            comarquesJsonUrl: 'http://test.com/comarques.json',
            markersJsonUrl:   'http://test.com/markers.json',
            mapDataNonce:     'n0nce',
            imagesUrl:        'http://test.com/images/',
        };
        jest.resetModules();
        const freshConfig = require('../app/catalunya-map-config').default;
        expect(freshConfig.comarquesJsonUrl).toBe('http://test.com/comarques.json');
        expect(freshConfig.markersJsonUrl).toBe('http://test.com/markers.json');
        expect(freshConfig.mapDataNonce).toBe('n0nce');
        expect(freshConfig.imagesUrl).toBe('http://test.com/images/');
        delete global.catalunyaMapConfig;
    });
});

describe('MAP_CONFIG', () => {
    test('should exactly match the expected configuration', () => {
        const expectedConfig = {
            choropleth: false,
            choroplethSteps: 5,
            comarquesJsonUrl: '',
            markersJsonUrl: '',
            mapDataNonce: '',
            imagesUrl: '',
            responsive: true,
            useText: true,
            useListText: false,
            button: false,
            onClick: false,
            newWindow: false,
            colorIn: '#fee8cb',
            colorOut: '#fff',
            scale: 0.8,
            mapInitWidth: 825,
            mapInitHeight: 800,
            textInitWidth: 280,
            mapWidth: 825,
            mapHeight: 800,
            comarcaAttr: {
                fill: '#fff',
                stroke: '#c7ab89',
                'stroke-width': 0.8,
                'stroke-linejoin': 'round',
                'font-family': 'Droid Sans,Verdana',
                'font-size': '19px',
                'font-weight': 'bold',
                cursor: 'pointer',
                'z-index': 10,
            },
            nomComcarcaAttr_in: {
                fill: '#a07a49',
                stroke: '#000000',
                'stroke-width': 0.4,
                'font-family': 'Droid Sans,Verdana',
                'font-size': '14px',
                'font-weight': 'bold',
                cursor: 'pointer',
                'z-index': 20,
            },
            nomComcarcaAttr_out: {
                fill: '#a07a49',
                'stroke-width': 0,
                'font-family': 'Droid Sans,Verdana',
                'font-size': '14px',
                'font-weight': 'bold',
                cursor: 'pointer',
                'z-index': 20,
            },
            nomCapitalAttr: {
                fill: '#FF9900',
                'font-family': 'Droid Sans, Arial, sans-serif',
                'font-size': '12px',
                'font-weight': 'bold',
                cursor: 'pointer',
                'z-index': 30,
            }
        };

        expect(MAP_CONFIG).toEqual(expectedConfig);
    });
});

describe('MAP_CONFIG host-set switches', () => {
    const FLAGS = ['useListText', 'button', 'onClick', 'newWindow'];

    afterEach(() => {
        delete global.catalunyaMapConfig;
        jest.resetModules();
    });

    test('a boolean from the host page beats the build-time value, in both directions', () => {
        jest.resetModules();
        global.catalunyaMapConfig = {useListText: true, button: true, onClick: true, newWindow: true};
        const on = require('../app/catalunya-map-config').default;
        FLAGS.forEach(flag => expect(on[flag]).toBe(true));

        jest.resetModules();
        process.env.ON_CLICK = 'true';
        global.catalunyaMapConfig = {onClick: false};
        const off = require('../app/catalunya-map-config').default;
        expect(off.onClick).toBe(false);
        delete process.env.ON_CLICK;
    });

    test('without a host value the build-time value is used', () => {
        jest.resetModules();
        process.env.NEW_WINDOW = 'true';
        global.catalunyaMapConfig = {};
        const config = require('../app/catalunya-map-config').default;
        expect(config.newWindow).toBe(true);
        expect(config.button).toBe(false);
        delete process.env.NEW_WINDOW;
    });

    test('a non-boolean host value is ignored', () => {
        jest.resetModules();
        global.catalunyaMapConfig = {onClick: 'yes', button: 1};
        const config = require('../app/catalunya-map-config').default;
        expect(config.onClick).toBe(false);
        expect(config.button).toBe(false);
    });
});

describe('MAP_CONFIG choropleth switch', () => {
    test('is on only when the host asks for it', () => {
        jest.resetModules();
        global.catalunyaMapConfig = {choropleth: true};
        const on = require('../app/catalunya-map-config').default;
        expect(on.choropleth).toBe(true);

        jest.resetModules();
        global.catalunyaMapConfig = {};
        const off = require('../app/catalunya-map-config').default;
        expect(off.choropleth).toBe(false);

        delete global.catalunyaMapConfig;
    });
});

describe('choroplethClass', () => {
    test('is 0 for a comarca without buildings or when nothing is known', () => {
        expect(choroplethClass(0, 100)).toBe(0);
        expect(choroplethClass(undefined, 100)).toBe(0);
        expect(choroplethClass(5, 0)).toBe(0);
    });

    test('gives the top class to the comarca with the most buildings', () => {
        expect(choroplethClass(100, 100)).toBe(5);
    });

    test('never drops below 1 for a comarca that has any', () => {
        expect(choroplethClass(1, 1000)).toBe(1);
    });

    test('uses the square root so one big comarca does not flatten the rest', () => {
        // 25 of 100 is a quarter of the buildings but half-way on the colour scale.
        expect(choroplethClass(25, 100)).toBe(3);
    });

    test('is not above the number of steps', () => {
        expect(choroplethClass(500, 100, 5)).toBe(5);
    });
});
