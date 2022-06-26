"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommand = void 0;
const robot = require("robotjs");
const Jimp = require("jimp");
const handleCommand = (ws, command) => {
    const [commandName, ...argsOfCommand] = command.split(' ');
    const { x: currentXPos, y: currentYPos } = robot.getMousePos();
    if (commandName === 'mouse_position') {
        ws.send(`mouse_position ${currentXPos},${currentYPos}`);
        return;
    }
    if (commandName === 'mouse_up') {
        const [moveY] = argsOfCommand;
        robot.moveMouseSmooth(currentXPos, currentYPos - Number(moveY));
        ws.send(commandName);
        return;
    }
    if (commandName === 'mouse_down') {
        const [moveY] = argsOfCommand;
        robot.moveMouseSmooth(currentXPos, currentYPos + Number(moveY));
        ws.send(commandName);
        return;
    }
    if (commandName === 'mouse_left') {
        const [moveX] = argsOfCommand;
        robot.moveMouseSmooth(currentXPos - Number(moveX), currentYPos);
        ws.send(commandName);
        return;
    }
    if (commandName === 'mouse_right') {
        const [moveX] = argsOfCommand;
        robot.moveMouseSmooth(currentXPos + Number(moveX), currentYPos);
        ws.send(commandName);
        return;
    }
    if (commandName === 'draw_circle') {
        const [radius] = argsOfCommand;
        for (let i = 0; i <= Math.PI * 2; i += 0.01) {
            const x = currentXPos - Number(radius) + (Number(radius) * Math.cos(i));
            const y = currentYPos + (Number(radius) * Math.sin(i));
            robot.dragMouse(x, y);
            robot.mouseToggle('down');
        }
        robot.mouseToggle('up');
        ws.send(commandName);
        return;
    }
    if (commandName === 'draw_rectangle') {
        const [width, height] = argsOfCommand;
        let x = currentXPos;
        let y = currentYPos;
        for (let i = 1; i <= 4; ++i) {
            if (i % 2 === 0) {
                for (let j = 0; j <= Number(width); ++j) {
                    robot.dragMouse(x, y);
                    robot.mouseToggle('down');
                    if (i === 2)
                        x = currentXPos - j;
                    if (i === 4)
                        x = currentXPos - Number(width) + j;
                }
            }
            if (i % 2 !== 0) {
                for (let j = 0; j <= Number(height); ++j) {
                    robot.dragMouse(x, y);
                    robot.mouseToggle('down');
                    if (i === 1)
                        y = currentYPos + j;
                    if (i === 3)
                        y = currentYPos + Number(height) - j;
                }
            }
        }
        robot.mouseToggle('up');
        ws.send(commandName);
        return;
    }
    if (commandName === 'draw_square') {
        const [width] = argsOfCommand;
        let x = currentXPos;
        let y = currentYPos;
        for (let i = 1; i <= 4; ++i) {
            if (i % 2 === 0) {
                for (let j = 0; j <= Number(width); ++j) {
                    robot.dragMouse(x, y);
                    robot.mouseToggle('down');
                    if (i === 2)
                        x = currentXPos - j;
                    if (i === 4)
                        x = currentXPos - Number(width) + j;
                }
            }
            if (i % 2 !== 0) {
                for (let j = 0; j <= Number(width); ++j) {
                    robot.dragMouse(x, y);
                    robot.mouseToggle('down');
                    if (i === 1)
                        y = currentYPos + j;
                    if (i === 3)
                        y = currentYPos + Number(width) - j;
                }
            }
        }
        robot.mouseToggle('up');
        ws.send(commandName);
        return;
    }
    if (commandName === 'prnt_scrn') {
        return new Promise(res => {
            const capturedScreen = robot.screen
                .capture(currentXPos - 100, currentYPos, 200, 200);
            const image = new Jimp(capturedScreen.width, capturedScreen.height);
            let pos = 0;
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                image.bitmap.data[idx + 2] = capturedScreen.image.readUInt8(pos++);
                image.bitmap.data[idx + 1] = capturedScreen.image.readUInt8(pos++);
                image.bitmap.data[idx + 0] = capturedScreen.image.readUInt8(pos++);
                image.bitmap.data[idx + 3] = capturedScreen.image.readUInt8(pos++);
            });
            return image
                .getBase64Async(Jimp.MIME_PNG)
                .then((imgStr) => {
                ws.send(`${commandName} ${imgStr.replace('data:image/png;base64,', '')}`);
                res(null);
            });
        });
    }
};
exports.handleCommand = handleCommand;
