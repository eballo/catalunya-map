/**
 * @jest-environment jsdom
 */

import CatMap from '../app/catalunya-map';
import {afterEach, beforeEach, describe, expect, jest, test} from "@jest/globals";
import $ from './mocks/jquery'

function createMockElement() {
    return {
        attr:       jest.fn().mockReturnThis(),
        animate:    jest.fn(),
        getBBox:    jest.fn().mockReturnValue({ x: 10, y: 20, width: 50, height: 40 }),
        node:       { id: 0 },
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

describe('CatMap', () => {
    let mapInstance;
    let mockJson;
    let mockConfig;
    let consoleLogMock;

    beforeEach(() => {
        jest.resetModules();
        process.env = {...process.env, DEBUG: 'true'};

        mockConfig = {
            mapWidth:    800,
            mapHeight:   600,
            useListText: true,
            onClick:     true,
            newWindow:   false,
            button:      true,
            scale:       1.5,
            responsive:  true,
            colorIn:     '#fee8cb',
            colorOut:    '#fff',
            nomComcarcaAttr_in:  { fill: '#a07a49' },
            nomComcarcaAttr_out: { fill: '#a07a49' },
            textInitWidth: 280,
        };
        mockJson = {
            comarca1: {
                path:    "M10,10L20,20",
                name:    "Comarca1",
                url:     "http://example.com/comarca1",
                total:   "100",
                info:    "Info Comarca1",
                capital: "Capital Comarca1"
            },
            comarca2: {
                path:    "M30,30L40,40",
                name:    "Comarca2",
                url:     "http://example.com/comarca2",
                total:   "200",
                info:    "Info Comarca2",
                capital: "Capital Comarca2"
            }
        };
        consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
        mapInstance = new CatMap(mockConfig, mockJson);
    });

    afterEach(() => {
        consoleLogMock.mockRestore();
    });

    // ── createArrayComarcas ────────────────────────────────────────────────────

    describe("createArrayComarcas", () => {
        test('createArrayComarcas - debug enabled', () => {
            mapInstance.createArrayComarcas();
            expect(Object.keys(mapInstance.mcat).length).toBe(2);
            expect(consoleLogMock).toHaveBeenCalledWith('Create Array of Comarques');
        });

        test('createArrayComarcas - debug disabled', () => {
            mapInstance.debug = false;
            mapInstance.createArrayComarcas();
            expect(Object.keys(mapInstance.mcat).length).toBe(2);
            expect(consoleLogMock).not.toHaveBeenCalledWith('Create Array of Comarques');
        });
    });

    // ── showValues ─────────────────────────────────────────────────────────────

    describe('showValues', () => {
        test('showValues - debug enabled', () => {
            mapInstance.showValues();
            expect(consoleLogMock).toHaveBeenCalledWith('ShowValues ...');
            expect(consoleLogMock).toHaveBeenCalledWith(`Win Width: undefined Map with: 800 Map Height: 600 Ratio: undefined`);
        });

        test('showValues - debug disabled', () => {
            mapInstance.debug = false;
            mapInstance.showValues();
            expect(consoleLogMock).not.toHaveBeenCalledWith('ShowValues ...');
        });
    });

    // ── createLlistaComarquesText ──────────────────────────────────────────────

    describe('createLlistaComarquesText', () => {
        test('useListText true - debug enabled', () => {
            mapInstance.config = { useListText: true };
            mapInstance.createLlistaComarquesText();
            expect(global.$).toHaveBeenCalledTimes(2);
            expect(consoleLogMock).toHaveBeenCalledWith(`Create list of Comarques`);
        });

        test('useListText true - debug disabled', () => {
            mapInstance.debug = false;
            mapInstance.config = { useListText: true };
            mapInstance.createLlistaComarquesText();
            expect(global.$).toHaveBeenCalledTimes(2);
            expect(consoleLogMock).not.toHaveBeenCalledWith(`Create list of Comarques`);
        });

        test('useListText false - debug enabled', () => {
            mapInstance.config = { useListText: false };
            mapInstance.createLlistaComarquesText();
            expect(global.$).not.toHaveBeenCalled();
            expect(consoleLogMock).toHaveBeenCalledWith(`Create list comarques is disabled`);
        });

        test('useListText false - debug disabled', () => {
            mapInstance.debug = false;
            mapInstance.config = { useListText: false };
            mapInstance.createLlistaComarquesText();
            expect(global.$).not.toHaveBeenCalled();
            expect(consoleLogMock).not.toHaveBeenCalledWith(`Create list comarques is disabled`);
        });

        test('useListText true - comarca without total skips badge', () => {
            mapInstance.mappaths = {
                comarca1: { name: 'NoTotal', url: 'http://url', capital: 'Cap' }
            };
            mapInstance.config = { useListText: true };
            $.mockClear();
            mapInstance.createLlistaComarquesText();
            expect(global.$).toHaveBeenCalled();
        });
    });

    // ── createRaphaelObject ───────────────────────────────────────────────────

    describe('createRaphaelObject', () => {
        beforeEach(() => {
            mapInstance.createArrayComarcas();
        });

        test('should create raphael object with all comarca properties', () => {
            const obj = mapInstance.createRaphaelObject('comarca1', 0);

            expect(mapInstance.paper.path).toHaveBeenCalledWith(mockJson.comarca1.path);
            expect(mapInstance.paper.text).toHaveBeenCalledTimes(2);

            expect(obj[0].comarcaName).toBe('Comarca1');
            expect(obj[0].capitalComarca).toBe('Capital Comarca1');
            expect(obj[0].contentText).toBe('Info Comarca1');
            expect(obj[0].comarcaLink).toBe('http://example.com/comarca1');
            expect(obj[0].node.id).toBe(0);

            expect(obj[0].toBack).toHaveBeenCalled();
            expect(obj[1].toFront).toHaveBeenCalled();
            expect(obj[2].toFront).toHaveBeenCalled();
            expect(obj[1].hide).toHaveBeenCalled();
            expect(obj[2].hide).toHaveBeenCalled();
        });

        test('should use extra_x when defined in comarca data', () => {
            mapInstance.mappaths.comarca1.extra_x = 20;
            const bbox = { x: 100, y: 200, width: 50, height: 30 };
            const result = mapInstance.get_comarca_and_capital_positions_label('comarca1', bbox);
            // comarca_x = 100 + (50 + 20) / 2 = 135
            expect(result.comarca_x).toBe(135);
            delete mapInstance.mappaths.comarca1.extra_x;
        });

        test('should use extra_y when defined in comarca data', () => {
            mapInstance.mappaths.comarca1.extra_y = 10;
            const bbox = { x: 100, y: 200, width: 50, height: 30 };
            const result = mapInstance.get_comarca_and_capital_positions_label('comarca1', bbox);
            // comarca_y = 200 + (30 + 10) / 2 = 220
            expect(result.comarca_y).toBe(220);
            delete mapInstance.mappaths.comarca1.extra_y;
        });
    });

    // ── get_comarca_and_capital_positions_label ────────────────────────────────

    describe('get_comarca_and_capital_positions_label', () => {
        test('returns correct positions without extra offsets', () => {
            const result = mapInstance.get_comarca_and_capital_positions_label(
                'comarca1', { x: 100, y: 200, width: 50, height: 30 }
            );
            expect(result.comarca_x).toBe(125);
            expect(result.comarca_y).toBe(215);
            expect(result.capital_x).toBe(125);
            expect(result.capital_y).toBe(230);
        });

        test('returns correct positions for comarca2 without extra offsets', () => {
            const result = mapInstance.get_comarca_and_capital_positions_label(
                'comarca2', { x: 150, y: 250, width: 40, height: 25 }
            );
            expect(result.comarca_x).toBe(170);
            expect(result.comarca_y).toBe(262.5);
            expect(result.capital_x).toBe(170);
            expect(result.capital_y).toBe(277.5);
        });
    });

    // ── CreateMap ──────────────────────────────────────────────────────────────

    describe("CreateMap", () => {
        function buildMockObject() {
            const obj = { hover: jest.fn(), click: jest.fn(), touchstart: jest.fn() };
            for (let i = 0; i < 3; i++) {
                obj[i] = {
                    animate:    jest.fn(),
                    attr:       jest.fn(),
                    show:       jest.fn(),
                    hide:       jest.fn(),
                    click:      jest.fn(),
                    touchstart: jest.fn(),
                    comarcaName: 'Comarca1',
                };
            }
            return obj;
        }

        test('useListText true - responsive true', () => {
            const mockObject = buildMockObject();
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.win = { resize: jest.fn() };
            mapInstance.config.useListText = true;
            mapInstance.config.responsive = true;

            mapInstance.createMap();

            expect(consoleLogMock).toHaveBeenCalledWith('CreateMap');
            expect(consoleLogMock).toHaveBeenCalledWith('useText is enabled');
            expect(mapInstance.responsiveResize).toHaveBeenCalled();
        });

        test('useListText false - responsive true', () => {
            const mockObject = buildMockObject();
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.win = { resize: jest.fn() };
            mapInstance.config.useListText = false;
            mapInstance.config.responsive = true;

            mapInstance.createMap();

            expect(consoleLogMock).toHaveBeenCalledWith('CreateMap');
            expect(consoleLogMock).not.toHaveBeenCalledWith('useText is enabled');
            expect(mapInstance.responsiveResize).toHaveBeenCalled();
        });

        test('useListText true - responsive false', () => {
            const mockObject = buildMockObject();
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.resizeMap = jest.fn();
            mapInstance.win = { resize: jest.fn() };
            mapInstance.config.useListText = true;
            mapInstance.config.responsive = false;

            mapInstance.createMap();

            expect(consoleLogMock).toHaveBeenCalledWith('CreateMap');
            expect(mapInstance.responsiveResize).not.toHaveBeenCalled();
            expect(mapInstance.resizeMap).toHaveBeenCalled();
        });

        test('debug disabled', () => {
            const mockObject = buildMockObject();
            mapInstance.debug = false;
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.win = { resize: jest.fn() };
            mapInstance.config.useListText = true;
            mapInstance.config.responsive = false;

            mapInstance.createMap();

            expect(consoleLogMock).not.toHaveBeenCalledWith('CreateMap');
        });

        test('hover in callback animates comarca fill', () => {
            const mockObject = buildMockObject();
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.win = { resize: jest.fn() };
            mapInstance.config.useListText = false;
            mapInstance.config.responsive = true;

            mapInstance.createMap();

            const [hoverIn] = mockObject.hover.mock.calls[0];
            hoverIn.call(mockObject);

            expect(mockObject[0].animate).toHaveBeenCalledWith({ fill: '#fee8cb' }, 100);
            expect(mockObject[1].attr).toHaveBeenCalledWith(mockConfig.nomComcarcaAttr_in);
            expect(mockObject[2].show).toHaveBeenCalled();
        });

        test('hover out callback resets non-selected comarca', () => {
            const mockObject = buildMockObject();
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.win = { resize: jest.fn() };
            mapInstance.config.useListText = false;
            mapInstance.config.responsive = true;
            mapInstance.selected = 'OtherComarca';

            mapInstance.createMap();

            const [, hoverOut] = mockObject.hover.mock.calls[0];
            hoverOut.call(mockObject);

            expect(mockObject[0].animate).toHaveBeenCalledWith({ fill: '#fff' }, 100);
            expect(mockObject[1].attr).toHaveBeenCalledWith(mockConfig.nomComcarcaAttr_out);
            expect(mockObject[2].hide).toHaveBeenCalled();
        });

        test('hover out callback does nothing extra when comarca is selected', () => {
            const mockObject = buildMockObject();
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.win = { resize: jest.fn() };
            mapInstance.config.useListText = false;
            mapInstance.config.responsive = true;
            mapInstance.selected = 'Comarca1'; // matches mockObject[0].comarcaName

            mapInstance.createMap();

            const [, hoverOut] = mockObject.hover.mock.calls[0];
            hoverOut.call(mockObject);

            expect(mockObject[0].animate).not.toHaveBeenCalled();
        });

        test('win resize callback calls responsiveResize', () => {
            const mockObject = buildMockObject();
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.win = { resize: jest.fn() };
            mapInstance.config.responsive = true;

            mapInstance.createMap();

            const resizeCb = mapInstance.win.resize.mock.calls[0][0];
            resizeCb();

            expect(mapInstance.responsiveResize).toHaveBeenCalledTimes(2);
        });

        test('click handler on map object triggers onMapClick', () => {
            const mockObject = buildMockObject();
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.win = { resize: jest.fn() };
            mapInstance.remove_background = jest.fn();
            mapInstance.onMapClick = jest.fn();
            mapInstance.config.useListText = true;
            mapInstance.config.responsive = true;

            mapInstance.createMap();

            const clickHandler = mockObject[0].click.mock.calls[0][0];
            clickHandler.call({ comarcaName: 'Comarca1', capitalComarca: 'Capital1', contentText: 'Info', comarcaLink: 'http://url' });

            expect(mapInstance.selected).toBe('Comarca1');
            expect(mapInstance.remove_background).toHaveBeenCalled();
            expect(mapInstance.onMapClick).toHaveBeenCalledWith('Comarca1', 'Capital1', 'Info', 'http://url');
        });

        test('touchstart handler on map object triggers onMapClick', () => {
            const mockObject = buildMockObject();
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.win = { resize: jest.fn() };
            mapInstance.remove_background = jest.fn();
            mapInstance.onMapClick = jest.fn();
            mapInstance.config.useListText = true;
            mapInstance.config.responsive = true;

            mapInstance.createMap();

            const touchHandler = mockObject[0].touchstart.mock.calls[0][0];
            touchHandler.call({ comarcaName: 'Comarca1', capitalComarca: 'Capital1', contentText: 'Info', comarcaLink: 'http://url' });

            expect(mapInstance.selected).toBe('Comarca1');
            expect(mapInstance.remove_background).toHaveBeenCalled();
            expect(mapInstance.onMapClick).toHaveBeenCalledWith('Comarca1', 'Capital1', 'Info', 'http://url');
        });
    });

    // ── remove_background ─────────────────────────────────────────────────────

    describe('remove_background', () => {
        beforeEach(() => {
            mapInstance.mcat = {
                comarca1: [
                    { comarcaName: 'Comarca1', animate: jest.fn() },
                    { attr: jest.fn() },
                    { hide: jest.fn() }
                ],
                comarca2: [
                    { comarcaName: 'Comarca2', animate: jest.fn() },
                    { attr: jest.fn() },
                    { hide: jest.fn() }
                ]
            };
        });

        test('resets only non-selected comarcas', () => {
            mapInstance.selected = 'Comarca1';
            mapInstance.remove_background();

            expect(mapInstance.mcat.comarca1[0].animate).not.toHaveBeenCalled();
            expect(mapInstance.mcat.comarca2[0].animate).toHaveBeenCalledWith({ fill: '#fff' }, 100);
            expect(mapInstance.mcat.comarca2[1].attr).toHaveBeenCalledWith(mockConfig.nomComcarcaAttr_out);
            expect(mapInstance.mcat.comarca2[2].hide).toHaveBeenCalled();
        });

        test('resets all comarcas when none is selected', () => {
            mapInstance.selected = undefined;
            mapInstance.remove_background();

            expect(mapInstance.mcat.comarca1[0].animate).toHaveBeenCalled();
            expect(mapInstance.mcat.comarca2[0].animate).toHaveBeenCalled();
        });
    });

    // ── onMapClick ────────────────────────────────────────────────────────────

    describe('onMapClick', () => {
        const params = ['Comarca1', 'Capital1', 'Info1', 'http://example.com/comarca1'];

        test('onClick true - newWindow false', () => {
            mapInstance.onMapClick(...params);
            expect(consoleLogMock).toHaveBeenCalledWith('onClick enabled');
            expect(consoleLogMock).toHaveBeenCalledWith('newWindow disabled');
        });

        test('onClick true - debug disabled', () => {
            mapInstance.debug = false;
            mapInstance.onMapClick(...params);
            expect(consoleLogMock).not.toHaveBeenCalledWith('onClick enabled');
        });

        test('onClick true - newWindow true', () => {
            mapInstance.config.newWindow = true;
            window.open = jest.fn();
            mapInstance.onMapClick(...params);
            expect(consoleLogMock).toHaveBeenCalledWith('newWindow enabled');
            expect(window.open).toHaveBeenCalled();
        });

        test('onClick true - newWindow true - debug false', () => {
            mapInstance.config.newWindow = true;
            mapInstance.debug = false;
            window.open = jest.fn();
            mapInstance.onMapClick(...params);
            expect(consoleLogMock).not.toHaveBeenCalledWith('newWindow enabled');
            expect(window.open).toHaveBeenCalled();
        });

        test('onClick false - button enabled', () => {
            mapInstance.config.onClick = false;
            mapInstance.onMapClick(...params);
            expect(consoleLogMock).toHaveBeenCalledWith('onClick disabled');
            expect(consoleLogMock).toHaveBeenCalledWith('Button functionality enabled');
        });

        test('onClick false - button enabled - debug false', () => {
            mapInstance.config.onClick = false;
            mapInstance.debug = false;
            mapInstance.onMapClick(...params);
            expect(consoleLogMock).not.toHaveBeenCalledWith('onClick disabled');
        });

        test('onClick false - button disabled', () => {
            mapInstance.config.onClick = false;
            mapInstance.config.button = false;
            mapInstance.onMapClick(...params);
            expect(consoleLogMock).toHaveBeenCalledWith('Button functionality disabled');
        });

        test('onClick false - button disabled - debug false', () => {
            mapInstance.config.onClick = false;
            mapInstance.config.button = false;
            mapInstance.debug = false;
            mapInstance.onMapClick(...params);
            expect(consoleLogMock).not.toHaveBeenCalledWith('Button functionality disabled');
        });

        test('on_click_disabled button click handler invokes navigation', () => {
            $.mockClear();
            mapInstance.config.onClick = false;
            mapInstance.config.button = true;
            mapInstance.on_click_disabled('http://example.com/comarca1', 'Comarca1', 'Capital1', 'Info');

            const showResult = $.mock.results[0].value.show.mock.results[0].value;
            const clickHandler = showResult.click.mock.calls[0][0];
            const result = clickHandler.call({});

            expect(result).toBe(false);
        });
    });

    // ── resizeMap ──────────────────────────────────────────────────────────────

    describe('resizeMap', () => {
        test('resizes paper and updates CSS', () => {
            mapInstance.config.mapWidth  = 600;
            mapInstance.config.mapHeight = 400;
            mapInstance.resizeMap();
            expect(mapInstance.paper.changeSize).toHaveBeenCalledWith(600, 400, true, false);
            expect(consoleLogMock).toHaveBeenCalledWith('ResizeMap');
        });

        test('mouseenter handler calls showComarcaName', () => {
            $.mockClear();
            mapInstance.showComarcaName = jest.fn();
            mapInstance.hideComarcaName = jest.fn();
            mapInstance.resizeMap();
            // calls: [0] $('.map'), [1] $('.map-wrapper'), [2] $('#map') mouseenter, [3] $('#map') mouseleave
            const mouseenterHandler = $.mock.results[2].value.mouseenter.mock.calls[0][0];
            mouseenterHandler();
            expect(mapInstance.showComarcaName).toHaveBeenCalled();
        });

        test('mouseleave handler calls hideComarcaName', () => {
            $.mockClear();
            mapInstance.showComarcaName = jest.fn();
            mapInstance.hideComarcaName = jest.fn();
            mapInstance.resizeMap();
            const mouseleaveHandler = $.mock.results[3].value.mouseleave.mock.calls[0][0];
            mouseleaveHandler();
            expect(mapInstance.hideComarcaName).toHaveBeenCalled();
        });
    });

    // ── showComarcaName ────────────────────────────────────────────────────────

    describe('showComarcaName', () => {
        test('shows text label for all comarques', () => {
            const t1 = { show: jest.fn(), comarcaName: 'Comarca1' };
            const t2 = { show: jest.fn(), comarcaName: 'Comarca2' };
            mapInstance.mcat = {
                comarca1: [null, t1, null],
                comarca2: [null, t2, null]
            };

            mapInstance.showComarcaName();

            expect(t1.show).toHaveBeenCalled();
            expect(t2.show).toHaveBeenCalled();
        });
    });

    // ── hideComarcaName ────────────────────────────────────────────────────────

    describe('hideComarcaName', () => {
        test('hides non-selected comarca names', () => {
            const t1 = { hide: jest.fn(), comarcaName: 'Comarca1' };
            const t2 = { hide: jest.fn(), comarcaName: 'Comarca2' };
            mapInstance.mcat = {
                comarca1: [null, t1, null],
                comarca2: [null, t2, null]
            };
            mapInstance.selected = 'Comarca1';

            mapInstance.hideComarcaName();

            expect(t1.hide).not.toHaveBeenCalled();
            expect(t2.hide).toHaveBeenCalled();
        });

        test('hides all comarca names when none selected', () => {
            const t1 = { hide: jest.fn(), comarcaName: 'Comarca1' };
            const t2 = { hide: jest.fn(), comarcaName: 'Comarca2' };
            mapInstance.mcat = {
                comarca1: [null, t1, null],
                comarca2: [null, t2, null]
            };
            mapInstance.selected = undefined;

            mapInstance.hideComarcaName();

            expect(t1.hide).toHaveBeenCalled();
            expect(t2.hide).toHaveBeenCalled();
        });
    });

    // ── hideMapShowList / hideListShowMap ─────────────────────────────────────

    describe('hideMapShowList', () => {
        test('hides map wrapper and shows comarca list', () => {
            mapInstance.hideMapShowList();
            expect(global.$).toHaveBeenCalledTimes(2);
        });
    });

    describe('hideListShowMap', () => {
        test('hides comarca list and shows map wrapper', () => {
            mapInstance.hideListShowMap();
            expect(global.$).toHaveBeenCalledTimes(2);
        });
    });

    // ── recalcPositions ───────────────────────────────────────────────────────

    describe('recalcPositions', () => {
        test('skips zero-size bbox comarca and updates non-zero-size comarca', () => {
            const zeroBbox = { getBBox: jest.fn().mockReturnValue({ x: 0, y: 0, width: 0, height: 0 }) };
            const nonZeroBbox = { getBBox: jest.fn().mockReturnValue({ x: 10, y: 20, width: 50, height: 40 }) };
            const label1 = { attr: jest.fn() };
            const label2 = { attr: jest.fn() };
            const label3 = { attr: jest.fn() };
            const label4 = { attr: jest.fn() };

            mapInstance.mcat = {
                comarca1: [zeroBbox, label1, label2],
                comarca2: [nonZeroBbox, label3, label4],
            };

            mapInstance.recalcPositions();

            expect(label1.attr).not.toHaveBeenCalled();
            expect(label2.attr).not.toHaveBeenCalled();
            expect(label3.attr).toHaveBeenCalled();
            expect(label4.attr).toHaveBeenCalled();
        });
    });

    // ── jQuery mock coverage ──────────────────────────────────────────────────

    describe('jQuery mock', () => {
        test('find executes its lambda and returns a jQuery instance', () => {
            const result = $('parent').find('child');
            expect(result).toBeDefined();
        });

        test('each calls the provided callback', () => {
            const cb = jest.fn();
            $('selector').each(cb);
            expect(cb).toHaveBeenCalled();
        });

        test('each does not throw when callback is not a function', () => {
            expect(() => $('selector').each(42)).not.toThrow();
        });
    });

    // ── loadMapAndText ────────────────────────────────────────────────────────

    describe('loadMapAndText', () => {
        test('scales, creates array, map and list', () => {
            mapInstance.createArrayComarcas    = jest.fn();
            mapInstance.createMap              = jest.fn();
            mapInstance.createLlistaComarquesText = jest.fn();

            mapInstance.loadMapAndText();

            expect(mapInstance.paper.scaleAll).toHaveBeenCalledWith(1.5);
            expect(mapInstance.createArrayComarcas).toHaveBeenCalled();
            expect(mapInstance.createMap).toHaveBeenCalled();
            expect(mapInstance.createLlistaComarquesText).toHaveBeenCalled();
            expect(consoleLogMock).toHaveBeenCalledWith("Calling loadMapAndText ...");
        });

        test('debug false - skips logging', () => {
            mapInstance.debug = false;
            mapInstance.createArrayComarcas       = jest.fn();
            mapInstance.createMap                 = jest.fn();
            mapInstance.createLlistaComarquesText = jest.fn();

            mapInstance.loadMapAndText();

            expect(mapInstance.createArrayComarcas).toHaveBeenCalled();
            expect(consoleLogMock).not.toHaveBeenCalledWith('Calling loadMapAndText ...');
        });
    });

    // ── responsiveResize ──────────────────────────────────────────────────────

    describe('responsiveResize', () => {
        test('window > 960 calls resizeMap', () => {
            mapInstance.win = { width: jest.fn().mockReturnValue(1000) };
            mapInstance.resizeMap  = jest.fn();
            mapInstance.showValues = jest.fn();
            mapInstance.responsiveResize();
            expect(mapInstance.resizeMap).toHaveBeenCalled();
            expect(consoleLogMock).toHaveBeenCalledWith('WindowWith > 960');
        });

        test('768 <= width < 960 hides map, shows list', () => {
            mapInstance.win = { width: jest.fn().mockReturnValue(800) };
            mapInstance.hideMapShowList = jest.fn();
            mapInstance.showValues      = jest.fn();
            mapInstance.responsiveResize();
            expect(mapInstance.hideMapShowList).toHaveBeenCalled();
            expect(consoleLogMock).toHaveBeenCalledWith('768 =< WindowWith < 960 ');
        });

        test('480 <= width < 768 hides map, shows list', () => {
            mapInstance.win = { width: jest.fn().mockReturnValue(500) };
            mapInstance.hideMapShowList = jest.fn();
            mapInstance.showValues      = jest.fn();
            mapInstance.responsiveResize();
            expect(mapInstance.hideMapShowList).toHaveBeenCalled();
            expect(consoleLogMock).toHaveBeenCalledWith('480 =< WindowWith < 768 ');
        });

        test('width < 480 hides map, shows list', () => {
            mapInstance.win = { width: jest.fn().mockReturnValue(300) };
            mapInstance.hideMapShowList = jest.fn();
            mapInstance.showValues      = jest.fn();
            mapInstance.responsiveResize();
            expect(mapInstance.hideMapShowList).toHaveBeenCalled();
            expect(consoleLogMock).toHaveBeenCalledWith('480 < WindowWith');
        });

        test('debug false - width >= 960 calls resizeMap without logging', () => {
            mapInstance.debug = false;
            mapInstance.win = { width: jest.fn().mockReturnValue(1000) };
            mapInstance.resizeMap = jest.fn();
            mapInstance.showValues = jest.fn();
            mapInstance.config.mapInitWidth = 825;
            mapInstance.config.mapInitHeight = 800;
            mapInstance.responsiveResize();
            expect(mapInstance.resizeMap).toHaveBeenCalled();
            expect(consoleLogMock).not.toHaveBeenCalledWith('ResponsiveResize');
        });

        test('debug false - 768 <= width < 960 hides map without logging', () => {
            mapInstance.debug = false;
            mapInstance.win = { width: jest.fn().mockReturnValue(800) };
            mapInstance.hideMapShowList = jest.fn();
            mapInstance.showValues = jest.fn();
            mapInstance.responsiveResize();
            expect(mapInstance.hideMapShowList).toHaveBeenCalled();
            expect(consoleLogMock).not.toHaveBeenCalledWith('768 =< WindowWith < 960 ');
        });

        test('debug false - 480 <= width < 768 hides map without logging', () => {
            mapInstance.debug = false;
            mapInstance.win = { width: jest.fn().mockReturnValue(500) };
            mapInstance.hideMapShowList = jest.fn();
            mapInstance.showValues = jest.fn();
            mapInstance.responsiveResize();
            expect(mapInstance.hideMapShowList).toHaveBeenCalled();
            expect(consoleLogMock).not.toHaveBeenCalledWith('480 =< WindowWith < 768 ');
        });

        test('debug false - width < 480 hides map without logging', () => {
            mapInstance.debug = false;
            mapInstance.win = { width: jest.fn().mockReturnValue(300) };
            mapInstance.hideMapShowList = jest.fn();
            mapInstance.showValues = jest.fn();
            mapInstance.responsiveResize();
            expect(mapInstance.hideMapShowList).toHaveBeenCalled();
            expect(consoleLogMock).not.toHaveBeenCalledWith('480 < WindowWith');
        });

        test('NaN winWidth skips all else-if branches', () => {
            mapInstance.win = { width: jest.fn().mockReturnValue(NaN) };
            mapInstance.hideMapShowList = jest.fn();
            mapInstance.showValues = jest.fn();
            mapInstance.responsiveResize();
            expect(mapInstance.hideMapShowList).not.toHaveBeenCalled();
        });
    });
});
