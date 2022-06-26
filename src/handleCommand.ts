import * as Jimp from 'jimp';
import * as robot from 'robotjs';
import { drawActions } from './actions.ts/draw.actions';
import { mouseActions } from './actions.ts/mouse.actions';
 
export const handleCommand = async (command: string) => {
  const [commandName, ...argsOfCommand] = command.split(' ');
  const [commandType, direction] = commandName.split('_')

  const { 
    x: currentXPos, 
    y: currentYPos 
  } = robot.getMousePos();

  if (commandName === 'mouse_position') {
    return `mouse_position ${currentXPos},${currentYPos}`;
  }

  if (commandType === 'mouse') {
    const [move] = argsOfCommand;

    mouseActions[direction](move, currentXPos, currentYPos);

    return commandName;
  }

  if (commandType === 'draw') {
    drawActions[direction](
      currentXPos, 
      currentYPos, 
      ...argsOfCommand as [string]
    );

    return commandName;
  }

  if (commandName === 'prnt_scrn') {
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

      const imgStr = await image.getBase64Async(Jimp.MIME_PNG);

      return `${commandName} ${imgStr.replace('data:image/png;base64,', '')}`;
  }
};