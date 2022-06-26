import * as robot from 'robotjs';

export const drawActions: {
  [key: string]: (x: number, y: number, size: string, length?: string) => void
} = {
  circle(x, y, radius) {
    for (let i = 0; i <= Math.PI * 2; i += 0.01) {
      const newX = x - Number(radius) + (Number(radius) * Math.cos(i));
      const newY = y + (Number(radius) * Math.sin(i));
      
      robot.dragMouse(newX, newY);
      robot.mouseToggle('down');
    }

    robot.mouseToggle('up');
  },

  rectangle(x, y, width, height) {
    let newX = x;
    let newY = y;

    for (let i = 1; i <= 4; ++i) {
      if (i % 2 === 0) {
        for (let j = 0; j <= Number(width); ++j) {
          robot.dragMouse(newX, newY);
          robot.mouseToggle('down');
          if (i === 2) newX = x - j;
          if (i === 4) newX = x - Number(width) + j;
        }
      }
      if (i % 2 !== 0) {
        for (let j = 0; j <= Number(height); ++j) {
          robot.dragMouse(newX, newY);
          robot.mouseToggle('down');
          if (i === 1) newY = y + j;
          if (i === 3) newY = y + Number(height) - j;
        }
      }
    }

    robot.mouseToggle('up');
  },

  square(x, y, width) {
    this.rectangle(x, y, width, width);
  }
}