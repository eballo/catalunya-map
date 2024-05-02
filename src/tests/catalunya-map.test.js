import CatMap from '../app/catalunya-map';
import {beforeEach, describe, expect, jest, test} from "@jest/globals";
import $ from "./mocks/jquery";


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


describe('CatMap', () => {
    let config, json, catMap;

    beforeEach(() => {
        config = {
            debug: false,
            mapWidth: 800,
            mapHeight: 600,
            useListText: true,
            onClick: true,
            newWindow: false,
            button: true,
            scale: 1.5
        };
        json = {
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
        catMap = new CatMap(config, json);
    });

    test('createArrayComarcas', () => {
        catMap.createArrayComarcas()
        expect(Object.keys(catMap.mcat).length).toBe(2)
    });

});

