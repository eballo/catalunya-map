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

    test('createArrayComarcas', () => {
        mapInstance.createArrayComarcas()
        expect(Object.keys(mapInstance.mcat).length).toBe(2)
    });

    test('showValues', () => {
        mapInstance.showValues();

        // Check console.log has been called
        expect(consoleLogMock).toHaveBeenCalledWith('ShowValues ...');
        expect(consoleLogMock).toHaveBeenCalledWith(`Win Width: undefined Map with: 800 Map Height: 600 Ratio: undefined`);
    });

    describe('createLlistaComarquesText', () => {
        test('should create list of comarques', () => {
            // Mocking config
            mapInstance.config = {
                useListText: true,
            };

            mapInstance.createLlistaComarquesText();

            // Assertions
            expect(global.$).toHaveBeenCalledTimes(2); // Twice because of loop
        });

        test('should not create list of comarques when useListText is false', () => {
            // Mocking config
            mapInstance.config = {
                useListText: false,
            };

            mapInstance.createLlistaComarquesText();

            // Assertions
            expect(global.$).not.toHaveBeenCalled(); // jQuery should not be called
        });
    });

    describe("CreateMap", () => {
        test('should create map with necessary properties and functions - useListText is true - responsive true', () => {

            let mockObject = {
                hover: jest.fn(),
                click: jest.fn(),
                touchstart: jest.fn(),
            };

            for (let i=0; i<3; ++i) {
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

            for (let i=0; i<3; ++i) {
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

            for (let i=0; i<3; ++i) {
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

    });

    describe('get_comarca_and_capital_positions_label', () => {
        test('should return correct positions for comarca and capital labels', () => {
            // Mocking necessary parameters for testing
            const comarca = 'comarca1';
            const bbox = { x: 100, y: 200, width: 50, height: 30 };

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
            const bbox = { x: 150, y: 250, width: 40, height: 25 };

            // Executing the method to be tested
            const result = mapInstance.get_comarca_and_capital_positions_label(comarca, bbox);

            // Assertions
            expect(result.capital_x).toBe(170);
            expect(result.capital_y).toBe(277.5);

            expect(result.comarca_x).toBe(170);
            expect(result.comarca_y).toBe(262.5);
        });
    });

});

