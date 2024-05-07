import MAP_CONFIG, {stringToBoolean} from '../app/catalunya-map-config'
import {describe, expect, test} from "@jest/globals";

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

describe('MAP_CONFIG', () => {
    test('should exactly match the expected configuration', () => {
        const expectedConfig = {
            url_json: process.env.SERVER_HOST,
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
            textInitWidth: 250,
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
