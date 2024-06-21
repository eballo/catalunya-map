import {jest} from "@jest/globals";

const mockSvgElement = () => ({
    animate: jest.fn(),
    attr: jest.fn(),
    hide: jest.fn(),
    show: jest.fn(),
    toFront: jest.fn(),
    toBack: jest.fn(),
    node: {id: ''}
});

const ScaleRaphael = jest.fn().mockImplementation((containerId, width, height) => {
    return {
        path: jest.fn().mockReturnValue(mockSvgElement()),
        text: jest.fn().mockReturnValue(mockSvgElement()),
        set: jest.fn(() => []),
        changeSize: jest.fn(),
        scaleAll: jest.fn(),
        paper: {
            path: jest.fn().mockReturnValue(mockSvgElement()),
            text: jest.fn().mockReturnValue(mockSvgElement()),
        }
    };
});

export default ScaleRaphael;
