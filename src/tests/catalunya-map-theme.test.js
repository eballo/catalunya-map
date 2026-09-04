/**
 * @jest-environment jsdom
 *
 * Theme-aware behaviour: reading colours from CSS custom properties, and
 * repainting the already-drawn SVG when the host page switches theme.
 *
 * These need a DOM, which is why they are not in catalunya-map-config.test.js
 * — that file runs under the `node` environment and so covers the opposite
 * branch of cssColour(), the one taken when there is no document at all.
 */

import {afterEach, beforeEach, describe, expect, jest, test} from "@jest/globals";
import {cssColour} from '../app/catalunya-map-config';
import CatMap from '../app/catalunya-map';
import $ from './mocks/jquery';

function createMockElement() {
    return {
        attr:       jest.fn().mockReturnThis(),
        animate:    jest.fn(),
        getBBox:    jest.fn().mockReturnValue({x: 10, y: 20, width: 50, height: 40}),
        node:       {id: 0},
        toBack:     jest.fn(),
        toFront:    jest.fn(),
        hide:       jest.fn(),
        show:       jest.fn(),
        click:      jest.fn(),
        touchstart: jest.fn(),
    };
}

global.ScaleRaphael = jest.fn().mockImplementation(() => ({
    path: jest.fn().mockImplementation(() => createMockElement()),
    text: jest.fn().mockImplementation(() => createMockElement()),
    set:  jest.fn().mockImplementation(() => {
        const arr = [];
        arr.hover = jest.fn();
        return arr;
    }),
    changeSize: jest.fn(),
    scaleAll:   jest.fn(),
}));

global.$ = $;

// ── cssColour ──────────────────────────────────────────────────────────────

describe('cssColour', () => {
    afterEach(() => {
        document.documentElement.removeAttribute('style');
        document.head.innerHTML = '';
    });

    test('reads the value a stylesheet puts on :root', () => {
        const style = document.createElement('style');
        style.textContent = ':root { --cm-comarca-fill: #2f2720; }';
        document.head.appendChild(style);

        expect(cssColour('--cm-comarca-fill', '#fff')).toBe('#2f2720');
    });

    test('reads a value set directly on the element', () => {
        document.documentElement.style.setProperty('--cm-comarca-stroke', '#6b5a48');

        expect(cssColour('--cm-comarca-stroke', '#c7ab89')).toBe('#6b5a48');
    });

    test('trims the surrounding whitespace custom properties keep', () => {
        document.documentElement.style.setProperty('--cm-comarca-fill', '  #123456  ');

        expect(cssColour('--cm-comarca-fill', '#fff')).toBe('#123456');
    });

    test('falls back when the property is not defined', () => {
        expect(cssColour('--cm-not-defined-anywhere', '#fallback')).toBe('#fallback');
    });

    test('falls back when the property is defined but blank', () => {
        document.documentElement.style.setProperty('--cm-comarca-fill', '   ');

        expect(cssColour('--cm-comarca-fill', '#fallback')).toBe('#fallback');
    });
});

// ── CatMap theme repainting ────────────────────────────────────────────────

describe('CatMap theme repainting', () => {
    let mapInstance;
    let mockConfig;

    beforeEach(() => {
        jest.resetModules();
        // CatMap's constructor reads it through stringToBoolean(), which needs a string.
        process.env = {...process.env, DEBUG: 'false'};
        document.body.innerHTML = '<div id="map"></div>';

        mockConfig = {
            mapWidth: 800, mapHeight: 600, scale: 1, responsive: false,
            useListText: false, onClick: false, newWindow: false, button: false,
            textInitWidth: 280,
            colorIn:  '#fee8cb',
            colorOut: '#fff',
            comarcaAttr:         {fill: '#fff', stroke: '#c7ab89'},
            nomComcarcaAttr_in:  {fill: '#a07a49', stroke: '#000000'},
            nomComcarcaAttr_out: {fill: '#a07a49'},
            nomCapitalAttr:      {fill: '#FF9900'},
        };

        const mockJson = {
            comarca1: {
                path: 'M10,10L20,20', name: 'Comarca1', url: 'http://example.com/1',
                total: '100', info: 'Info 1', capital: 'Capital 1',
            },
            comarca2: {
                path: 'M30,30L40,40', name: 'Comarca2', url: 'http://example.com/2',
                total: '200', info: 'Info 2', capital: 'Capital 2',
            },
        };

        mapInstance = new CatMap(mockConfig, mockJson);
        mapInstance.debug = false;
        mapInstance.createArrayComarcas();   // seeds mcat with a Raphael set per comarca
        mapInstance.createMap();

        // createMap() paints as it draws; start from a clean slate so the
        // assertions below only see what refreshTheme() does.
        for (const comarca in mapInstance.mcat) {
            mapInstance.mcat[comarca].forEach(el => el.attr.mockClear());
        }
    });

    describe('refreshTheme', () => {
        test('repaints every comarca shape and its capital label', () => {
            mapInstance.refreshTheme();

            for (const comarca of ['comarca1', 'comarca2']) {
                const [shape, , capital] = mapInstance.mcat[comarca];
                expect(shape.attr).toHaveBeenCalledWith(mockConfig.comarcaAttr);
                expect(capital.attr).toHaveBeenCalledWith(mockConfig.nomCapitalAttr);
            }
        });

        test('leaves unselected comarques in their hover-out styling', () => {
            mapInstance.selected = undefined;

            mapInstance.refreshTheme();

            const [, name] = mapInstance.mcat.comarca1;
            expect(name.attr).toHaveBeenCalledWith(mockConfig.nomComcarcaAttr_out);
            expect(name.attr).not.toHaveBeenCalledWith(mockConfig.nomComcarcaAttr_in);
        });

        test('keeps the selected comarca highlighted', () => {
            mapInstance.selected = 'Comarca1';

            mapInstance.refreshTheme();

            const [selShape, selName] = mapInstance.mcat.comarca1;
            expect(selShape.attr).toHaveBeenCalledWith({fill: mockConfig.colorIn});
            expect(selName.attr).toHaveBeenCalledWith(mockConfig.nomComcarcaAttr_in);

            // the other one is still reset
            const [, otherName] = mapInstance.mcat.comarca2;
            expect(otherName.attr).toHaveBeenCalledWith(mockConfig.nomComcarcaAttr_out);
        });

        test('picks up new colours rather than reusing the ones drawn with', () => {
            // Colours reach the config as getters over CSS custom properties, so
            // a theme switch changes what refreshTheme() paints with.
            mockConfig.comarcaAttr = {fill: '#2f2720', stroke: '#6b5a48'};

            mapInstance.refreshTheme();

            expect(mapInstance.mcat.comarca1[0].attr)
                .toHaveBeenCalledWith({fill: '#2f2720', stroke: '#6b5a48'});
        });

        test('skips entries that are missing or incomplete', () => {
            mapInstance.mcat.comarca1 = undefined;
            mapInstance.mcat.comarca2 = [createMockElement()]; // shorter than 3

            expect(() => mapInstance.refreshTheme()).not.toThrow();
            expect(mapInstance.mcat.comarca2[0].attr).not.toHaveBeenCalled();
        });
    });

    describe('watchThemeChanges', () => {
        test('repaints when data-theme changes on <html>', async () => {
            const spy = jest.spyOn(mapInstance, 'refreshTheme').mockImplementation(() => {});
            mapInstance.watchThemeChanges();

            document.documentElement.setAttribute('data-theme', 'dark');
            await Promise.resolve(); // MutationObserver callbacks are microtasks

            expect(spy).toHaveBeenCalled();
            document.documentElement.removeAttribute('data-theme');
        });

        test('ignores attributes other than data-theme', async () => {
            const spy = jest.spyOn(mapInstance, 'refreshTheme').mockImplementation(() => {});
            mapInstance.watchThemeChanges();

            document.documentElement.setAttribute('lang', 'ca');
            await Promise.resolve();

            expect(spy).not.toHaveBeenCalled();
        });

        test('does nothing where MutationObserver is unavailable', () => {
            const original = global.MutationObserver;
            delete global.MutationObserver;

            expect(() => mapInstance.watchThemeChanges()).not.toThrow();

            global.MutationObserver = original;
        });
    });
});
