// __mocks__/jquery.js
import {jest} from "@jest/globals";

const $ = jest.fn().mockImplementation(selector => {
    return {
        html: jest.fn(),
        append: jest.fn(),
        text: jest.fn(),
        find: jest.fn(() => $(selector)),
        each: jest.fn((callback) => {
            $(selector).each(callback);
        }),
        on: jest.fn(),
        off: jest.fn(),
        css: jest.fn(),
        attr: jest.fn(),
        data: jest.fn(),
        val: jest.fn(),
        hide: jest.fn(),
        show: jest.fn(),
        animate: jest.fn(),
        fadeIn: jest.fn(),
        fadeOut: jest.fn(),
        click: jest.fn(),
        ready: jest.fn((callback) => callback()),
        length: 0
    };
});

export default $;
