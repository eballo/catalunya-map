/**
 * @jest-environment jsdom
 */

import CatMap from '../app/catalunya-map';
import {afterEach, beforeEach, describe, expect, jest, test} from "@jest/globals";
import $ from './mocks/jquery'


global.ScaleRaphael = jest.fn().mockImplementation(() => ({
    path: jest.fn().mockReturnValue({
        attr: jest.fn(),
        animate: jest.fn(),
    }),
    text: jest.fn().mockReturnValue({
        attr: jest.fn(),
    }),
    set: jest.fn().mockReturnValue([]),
    changeSize: jest.fn(),
    scaleAll: jest.fn(),
}));

global.$ = $

describe('CatMap', () => {
    let mapInstance;
    let mockJson;
    let mockConfig;
    let consoleLogMock;

    beforeEach(() => {

        jest.resetModules(); // Ensures that all modules are re-required
        process.env = {...process.env, DEBUG: 'true'}; // Extend process.env with the DEBUG variable

        mockConfig = {
            mapWidth: 800,
            mapHeight: 600,
            useListText: true,
            onClick: true,
            newWindow: false,
            button: true,
            scale: 1.5,
            responsive: true,
        };
        mockJson = {
            comarca1: {
                path: "M10,10L20,20",
                name: "Comarca1",
                url: "http://example.com/comarca1",
                total: "100",
                info: "Info Comarca1",
                capital: "Capital Comarca1"
            },
            comarca2: {
                path: "M30,30L40,40",
                name: "Comarca2",
                url: "http://example.com/comarca2",
                total: "200",
                info: "Info Comarca2",
                capital: "Capital Comarca2"
            }
        };
        consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
        mapInstance = new CatMap(mockConfig, mockJson);
    });

    afterEach(() => {
        consoleLogMock.mockRestore();
    });

    describe("CreateArrayComarcas", () => {
        test('createArrayComarcas - debug enabled', () => {
            mapInstance.createArrayComarcas()
            expect(Object.keys(mapInstance.mcat).length).toBe(2)
            expect(consoleLogMock).toHaveBeenCalledWith('Create Array of Comarques');
        });

        test('createArrayComarcas - debug disabled', () => {
            mapInstance.debug = false
            mapInstance.createArrayComarcas()
            expect(Object.keys(mapInstance.mcat).length).toBe(2)
            expect(consoleLogMock).not.toHaveBeenCalledWith('Create Array of Comarques');
        });
    })

    describe('showValues', () => {
        test('showValues - debug enabled', () => {
            mapInstance.showValues();

            // Check console.log has been called
            expect(consoleLogMock).toHaveBeenCalledWith('ShowValues ...');
            expect(consoleLogMock).toHaveBeenCalledWith(`Win Width: undefined Map with: 800 Map Height: 600 Ratio: undefined`);
        });

        test('showValues - debug disabled', () => {
            mapInstance.debug = false;
            mapInstance.showValues();

            // Check console.log has been called
            expect(consoleLogMock).not.toHaveBeenCalledWith('ShowValues ...');
            expect(consoleLogMock).not.toHaveBeenCalledWith(`Win Width: undefined Map with: 800 Map Height: 600 Ratio: undefined`);
        });


    })

    describe('createLlistaComarquesText', () => {
        test('should create list of comarques enabled - debug enabled', () => {
            // Mocking config
            mapInstance.config = {
                useListText: true,
            };

            mapInstance.createLlistaComarquesText();

            // Assertions
            expect(global.$).toHaveBeenCalledTimes(2); // Twice because of loop
            expect(consoleLogMock).toHaveBeenCalledWith(`Create list of Comarques`);
        });

        test('should create list of comarques enabled - debug disabled', () => {
            // Mocking config
            mapInstance.debug = false
            mapInstance.config = {
                useListText: true,
            };

            mapInstance.createLlistaComarquesText();

            // Assertions
            expect(global.$).toHaveBeenCalledTimes(2); // Twice because of loop
            expect(consoleLogMock).not.toHaveBeenCalledWith(`Create list of Comarques`);
        });

        test('should not create list of comarques when useListText is false - debug enabled', () => {
            // Mocking config
            mapInstance.config = {
                useListText: false,
            };

            mapInstance.createLlistaComarquesText();

            // Assertions
            expect(global.$).not.toHaveBeenCalled(); // jQuery should not be called
            expect(consoleLogMock).toHaveBeenCalledWith(`Create list comarques is disabled`);
        });

        test('should not create list of comarques when useListText is false - debug disabled', () => {
            mapInstance.debug = false;
            // Mocking config
            mapInstance.config = {
                useListText: false,
            };

            mapInstance.createLlistaComarquesText();

            // Assertions
            expect(global.$).not.toHaveBeenCalled(); // jQuery should not be called
            expect(consoleLogMock).not.toHaveBeenCalledWith(`Create list comarques is disabled`);
        });
    });

    describe("CreateMap", () => {
        test('should create map with necessary properties and functions - useListText is true - responsive true', () => {

            let mockObject = {
                hover: jest.fn(),
                click: jest.fn(),
                touchstart: jest.fn(),
            };

            for (let i = 0; i < 3; ++i) {
                mockObject[i] = {
                    hover: jest.fn(),
                    click: jest.fn(),
                    touchstart: jest.fn(),
                };
            }
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.resizeMap = jest.fn();
            mapInstance.win = {
                resize: jest.fn(), // Mocking the resize function
            };

            mapInstance.config.useListText = true;
            mapInstance.config.responsive = true;

            // Executing the method to be tested
            mapInstance.createMap();

            // Assertions
            expect(global.ScaleRaphael).toHaveBeenCalledWith('map', expect.any(Number), expect.any(Number));
            expect(global.console.log).toHaveBeenCalledWith('CreateMap');
            expect(global.console.log).toHaveBeenCalledWith('useText is enabled');
            expect(mapInstance.responsiveResize).toHaveBeenCalled();
        });

        test('should create map with necessary properties and functions - useListText is false - responsive true', () => {
            let mockObject = {
                hover: jest.fn(),
                click: jest.fn(),
                touchstart: jest.fn(),
            };

            for (let i = 0; i < 3; ++i) {
                mockObject[i] = {
                    hover: jest.fn(),
                    click: jest.fn(),
                    touchstart: jest.fn(),
                };
            }
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.resizeMap = jest.fn();
            mapInstance.win = {
                resize: jest.fn(), // Mocking the resize function
            };

            mapInstance.config.useListText = false;
            mapInstance.config.responsive = true;

            // Executing the method to be tested
            mapInstance.createMap();

            // Assertions
            expect(global.ScaleRaphael).toHaveBeenCalledWith('map', expect.any(Number), expect.any(Number));
            expect(global.console.log).toHaveBeenCalledWith('CreateMap');
            expect(global.console.log).not.toHaveBeenCalledWith('useText is enabled');
            expect(mapInstance.responsiveResize).toHaveBeenCalled();
        });

        test('should create map with necessary properties and functions - useListText is true - responsive false', () => {
            let mockObject = {
                hover: jest.fn(),
                click: jest.fn(),
                touchstart: jest.fn(),
            };

            for (let i = 0; i < 3; ++i) {
                mockObject[i] = {
                    hover: jest.fn(),
                    click: jest.fn(),
                    touchstart: jest.fn(),
                };
            }
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.resizeMap = jest.fn();
            mapInstance.win = {
                resize: jest.fn(), // Mocking the resize function
            };

            mapInstance.config.useListText = true;
            mapInstance.config.responsive = false;

            // Executing the method to be tested
            mapInstance.createMap();

            // Assertions
            expect(global.ScaleRaphael).toHaveBeenCalledWith('map', expect.any(Number), expect.any(Number));
            expect(global.console.log).toHaveBeenCalledWith('CreateMap');
            expect(global.console.log).toHaveBeenCalledWith('useText is enabled');
            expect(mapInstance.responsiveResize).not.toHaveBeenCalled();
        });

        test('should create map with necessary properties and functions - useListText is true - responsive false - debug disabled', () => {
            let mockObject = {
                hover: jest.fn(),
                click: jest.fn(),
                touchstart: jest.fn(),
            };

            for (let i = 0; i < 3; ++i) {
                mockObject[i] = {
                    hover: jest.fn(),
                    click: jest.fn(),
                    touchstart: jest.fn(),
                };
            }
            mapInstance.debug = false;
            mapInstance.createRaphaelObject = jest.fn().mockReturnValue(mockObject);
            mapInstance.responsiveResize = jest.fn();
            mapInstance.resizeMap = jest.fn();
            mapInstance.win = {
                resize: jest.fn(), // Mocking the resize function
            };

            mapInstance.config.useListText = true;
            mapInstance.config.responsive = false;

            // Executing the method to be tested
            mapInstance.createMap();

            // Assertions
            expect(global.ScaleRaphael).toHaveBeenCalledWith('map', expect.any(Number), expect.any(Number));
            expect(global.console.log).not.toHaveBeenCalledWith('CreateMap');
            expect(global.console.log).not.toHaveBeenCalledWith('useText is enabled');
            expect(mapInstance.responsiveResize).not.toHaveBeenCalled();
        });

    });

    describe('get_comarca_and_capital_positions_label', () => {
        test('should return correct positions for comarca and capital labels', () => {
            // Mocking necessary parameters for testing
            const comarca = 'comarca1';
            const bbox = {x: 100, y: 200, width: 50, height: 30};

            // Executing the method to be tested
            const result = mapInstance.get_comarca_and_capital_positions_label(comarca, bbox);

            // Assertions
            expect(result.capital_x).toBe(125);
            expect(result.capital_y).toBe(230);

            expect(result.comarca_x).toBe(125);
            expect(result.comarca_y).toBe(215);
        });

        test('should return correct positions for comarca and capital labels when extra_x and extra_y are not provided', () => {
            // Mocking necessary parameters for testing
            const comarca = 'comarca2';
            const bbox = {x: 150, y: 250, width: 40, height: 25};

            // Executing the method to be tested
            const result = mapInstance.get_comarca_and_capital_positions_label(comarca, bbox);

            // Assertions
            expect(result.capital_x).toBe(170);
            expect(result.capital_y).toBe(277.5);

            expect(result.comarca_x).toBe(170);
            expect(result.comarca_y).toBe(262.5);
        });
    });

    describe('onMapClick', () => {
        test('should open link in same window if onClick is true', () => {
            // Mocking necessary parameters for testing
            const comarcaName = 'Comarca1';
            const capitalComarca = 'Capital1';
            const contentText = 'Info1';
            const comarcaLink = 'http://example.com/comarca1';

            // Executing the method to be tested
            mapInstance.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);

            // Assertions
            expect(consoleLogMock).toHaveBeenCalledWith('onClick enabled');
            expect(consoleLogMock).toHaveBeenCalledWith('newWindow disabled');
        });

        test('should open link in same window if onClick is true - debug disabled', () => {
            // Mocking necessary parameters for testing
            const comarcaName = 'Comarca1';
            const capitalComarca = 'Capital1';
            const contentText = 'Info1';
            const comarcaLink = 'http://example.com/comarca1';

            // Executing the method to be tested
            mapInstance.debug = false;
            mapInstance.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);

            // Assertions
            expect(consoleLogMock).not.toHaveBeenCalledWith('onClick enabled');
            expect(consoleLogMock).not.toHaveBeenCalledWith('newWindow disabled');
        });

        test('should open link in new window if onClick is true and newWindow is true', () => {
            // Mocking necessary properties for testing
            mapInstance.config.newWindow = true; // Enable opening in a new window

            // Mocking necessary parameters for testing
            const comarcaName = 'Comarca1';
            const capitalComarca = 'Capital1';
            const contentText = 'Info1';
            const comarcaLink = 'http://example.com/comarca1';
            window.open = jest.fn()

            // Executing the method to be tested
            mapInstance.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);

            // Assertions
            expect(consoleLogMock).toHaveBeenCalledWith('onClick enabled');
            expect(consoleLogMock).toHaveBeenCalledWith('newWindow enabled');
            expect(window.open).toHaveBeenCalled();
        });

        test('should open link in new window if onClick is true and newWindow is true - debug false', () => {
            // Mocking necessary properties for testing
            mapInstance.config.newWindow = true; // Enable opening in a new window

            // Mocking necessary parameters for testing
            const comarcaName = 'Comarca1';
            const capitalComarca = 'Capital1';
            const contentText = 'Info1';
            const comarcaLink = 'http://example.com/comarca1';
            window.open = jest.fn()

            // Executing the method to be tested
            mapInstance.debug = false;
            mapInstance.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);

            // Assertions
            expect(consoleLogMock).not.toHaveBeenCalledWith('onClick enabled');
            expect(consoleLogMock).not.toHaveBeenCalledWith('newWindow enabled');
            expect(window.open).toHaveBeenCalled();
        });

        test('should not open link if onClick is false and button enabled', () => {
            // Mocking necessary properties for testing
            mapInstance.config.onClick = false; // Disable onClick functionality

            // Mocking necessary parameters for testing
            const comarcaName = 'Comarca1';
            const capitalComarca = 'Capital1';
            const contentText = 'Info1';
            const comarcaLink = 'http://example.com/comarca1';

            // Executing the method to be tested
            mapInstance.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);

            // Assertions
            expect(consoleLogMock).toHaveBeenCalledWith('onClick disabled');
            expect(consoleLogMock).toHaveBeenCalledWith('Button functionality enabled');

        });

        test('should not open link if onClick is false and button enabled - debug false', () => {
            // Mocking necessary properties for testing
            mapInstance.config.onClick = false; // Disable onClick functionality

            // Mocking necessary parameters for testing
            const comarcaName = 'Comarca1';
            const capitalComarca = 'Capital1';
            const contentText = 'Info1';
            const comarcaLink = 'http://example.com/comarca1';

            // Executing the method to be tested
            mapInstance.debug = false;
            mapInstance.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);

            // Assertions
            expect(consoleLogMock).not.toHaveBeenCalledWith('onClick disabled');
            expect(consoleLogMock).not.toHaveBeenCalledWith('Button functionality enabled');

        });

        test('should not open link if onClick is false and button disabled', () => {
            // Mocking necessary properties for testing
            mapInstance.config.onClick = false; // Disable onClick functionality
            mapInstance.config.button = false;

            // Mocking necessary parameters for testing
            const comarcaName = 'Comarca1';
            const capitalComarca = 'Capital1';
            const contentText = 'Info1';
            const comarcaLink = 'http://example.com/comarca1';

            // Executing the method to be tested
            mapInstance.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);

            // Assertions
            expect(consoleLogMock).toHaveBeenCalledWith('onClick disabled');
            expect(consoleLogMock).toHaveBeenCalledWith('Button functionality disabled');

        });

        test('should not open link if onClick is false and button disabled - debug false', () => {
            // Mocking necessary properties for testing
            mapInstance.config.onClick = false; // Disable onClick functionality
            mapInstance.config.button = false;

            // Mocking necessary parameters for testing
            const comarcaName = 'Comarca1';
            const capitalComarca = 'Capital1';
            const contentText = 'Info1';
            const comarcaLink = 'http://example.com/comarca1';

            // Executing the method to be tested
            mapInstance.debug = false;
            mapInstance.onMapClick(comarcaName, capitalComarca, contentText, comarcaLink);

            // Assertions
            expect(consoleLogMock).not.toHaveBeenCalledWith('onClick disabled');
            expect(consoleLogMock).not.toHaveBeenCalledWith('Button functionality disabled');

        });
    });

    describe('resizeMap', () => {
        test('should resize map and update CSS properties', () => {
            // Mocking necessary parameters for testing
            const expectedWidth = 600; // Initial width
            const expectedHeight = 400; // Initial height

            mapInstance.config.mapHeight = expectedHeight
            mapInstance.config.mapWidth = expectedWidth

            // Executing the method to be tested
            mapInstance.resizeMap();

            // Assertions
            expect(mapInstance.paper.changeSize).toHaveBeenCalledWith(expectedWidth, expectedHeight, true, false);
            expect(consoleLogMock).toHaveBeenCalledWith('ResizeMap')
        });

    });

    describe('showComarcaName', () => {
        test.skip('should show comarca name', () => {

            mapInstance.showComarcaName();

            expect(global.$().show).toHaveBeenCalled();
        });
    });

    describe('hideMapShowList', () => {
        test('should hide map wrapper and show list of comarques', () => {
            mapInstance.hideMapShowList();
            expect(global.$).toHaveBeenCalledTimes(2);
        });
    });

    describe('hideListShowMap', () => {
        test('should hide list show map of comarques', () => {
            mapInstance.hideListShowMap();
            expect(global.$).toHaveBeenCalledTimes(2);
        });
    });

    describe('loadMapAndText', () => {
        test('should create map, array of comarcas, and list of comarques', () => {

            mapInstance.createArrayComarcas = jest.fn()
            mapInstance.createMap = jest.fn()
            mapInstance.createLlistaComarquesText = jest.fn()

            mapInstance.loadMapAndText();

            expect(mapInstance.paper.scaleAll).toHaveBeenCalledWith(1.5);
            expect(mapInstance.createArrayComarcas).toHaveBeenCalled();
            expect(mapInstance.createMap).toHaveBeenCalled();
            expect(mapInstance.createLlistaComarquesText).toHaveBeenCalled();

            expect(consoleLogMock).toHaveBeenCalledWith("Calling loadMapAndText ...")
        });

        test.skip('should create map, array of comarcas, and list of comarques - debug false', () => {
            mapInstance.debug = false;
            mapInstance.loadMapAndText();

            expect(mapInstance.paper.scaleAll).toHaveBeenCalledWith(1.5);
            expect(mapInstance.createArrayComarcas).toHaveBeenCalled();
            expect(mapInstance.createMap).toHaveBeenCalled();
            expect(mapInstance.createLlistaComarquesText).toHaveBeenCalled();
            expect(consoleLogMock).not.toHaveBeenCalledWith("Calling loadMapAndText ...")
        });
    });

    describe('responsiveResize', () => {
        test('should resize map and update CSS properties for window width > 960', () => {
            mapInstance.win = {
                width: jest.fn().mockReturnValue(1000)
            }

            mapInstance.resizeMap = jest.fn()
            mapInstance.showValues = jest.fn()

            mapInstance.responsiveResize();

            expect(mapInstance.resizeMap).toHaveBeenCalled()
            expect(mapInstance.showValues).toHaveBeenCalled();
            expect(consoleLogMock).toHaveBeenCalledWith('WindowWith > 960')
        });

        test('should hide map and show list of comarques for window width 768 =< WindowWith < 960', () => {
            mapInstance.win = {
                width: jest.fn().mockReturnValue(800)
            }

            mapInstance.hideMapShowList = jest.fn()
            mapInstance.showValues = jest.fn()

            mapInstance.responsiveResize();

            expect(mapInstance.hideMapShowList).toHaveBeenCalled()
            expect(mapInstance.showValues).toHaveBeenCalled();
            expect(consoleLogMock).toHaveBeenCalledWith('768 =< WindowWith < 960 ')
        });

        test('should hide map and show list of comarques for window width 480 =< WindowWith < 768', () => {
            mapInstance.win = {
                width: jest.fn().mockReturnValue(500)
            }

            mapInstance.hideMapShowList = jest.fn()
            mapInstance.showValues = jest.fn()

            mapInstance.responsiveResize();

            expect(mapInstance.hideMapShowList).toHaveBeenCalled()
            expect(mapInstance.showValues).toHaveBeenCalled();
            expect(consoleLogMock).toHaveBeenCalledWith('480 =< WindowWith < 768 ')
        });

        test('should hide map and show list of comarques for window width 480 < WindowWith', () => {
            mapInstance.win = {
                width: jest.fn().mockReturnValue(300)
            }

            mapInstance.hideMapShowList = jest.fn()
            mapInstance.showValues = jest.fn()

            mapInstance.responsiveResize();

            expect(mapInstance.hideMapShowList).toHaveBeenCalled()
            expect(mapInstance.showValues).toHaveBeenCalled();
            expect(consoleLogMock).toHaveBeenCalledWith('480 < WindowWith')
        });

    });

});

