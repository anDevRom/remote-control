import robot from 'robotjs';
 
export const handleCommand = (ws, command) => {
  const [commandName, ...argsOfCommand] = command.split(' ');
  const { 
    x: currentXPos, 
    y: currentYPos 
  } = robot.getMousePos();

  if (commandName === 'mouse_position') {
    ws.send(`mouse_position ${currentXPos},${currentYPos}`);
    return;
  }

  if (commandName === 'mouse_up') {
    const [moveY] = argsOfCommand;

    robot.moveMouseSmooth(currentXPos, currentYPos - moveY);
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

    robot.moveMouseSmooth(currentXPos - moveX, currentYPos);
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
      const x = currentXPos - radius + (radius * Math.cos(i));
      const y = currentYPos + (radius * Math.sin(i));
      
      robot.dragMouse(x, y);
      robot.mouseToggle('down');
    }

    robot.mouseToggle('up')
    ws.send(commandName);
    return;
  }

  if (commandName === 'draw_rectangle') {
    const [width, height] = argsOfCommand;

    let x = currentXPos;
    let y = currentYPos;

    for (let i = 1; i <= 4; ++i) {
      if (i % 2 === 0) {
        for (let j = 0; j <= width; ++j) {
          robot.dragMouse(x, y);
          robot.mouseToggle('down');
          if (i === 2) x = currentXPos - j;
          if (i === 4) x = currentXPos - Number(width) + j;
        }
      }
      if (i % 2 !== 0) {
        for (let j = 0; j <= height; ++j) {
          robot.dragMouse(x, y);
          robot.mouseToggle('down');
          if (i === 1) y = currentYPos + j;
          if (i === 3) y = currentYPos + Number(height) - j;
        }
      }
    }

    robot.mouseToggle('up')
    ws.send(commandName);
    return;
  }

  if (commandName === 'draw_square') {
    const [width] = argsOfCommand;

    let x = currentXPos;
    let y = currentYPos;

    for (let i = 1; i <= 4; ++i) {
      if (i % 2 === 0) {
        for (let j = 0; j <= width; ++j) {
          robot.dragMouse(x, y);
          robot.mouseToggle('down');
          if (i === 2) x = currentXPos - j;
          if (i === 4) x = currentXPos - Number(width) + j;
        }
      }
      if (i % 2 !== 0) {
        for (let j = 0; j <= width; ++j) {
          robot.dragMouse(x, y);
          robot.mouseToggle('down');
          if (i === 1) y = currentYPos + j;
          if (i === 3) y = currentYPos + Number(width) - j;
        }
      }
    }

    robot.mouseToggle('up')
    ws.send(commandName);
    return;
  }
};