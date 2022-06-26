import * as robot from 'robotjs';

export const mouseActions: {
  [key: string]: (move: string, x: number, y: number) => void
} = {
  up(move, x, y) {
    robot.moveMouse(x, y - Number(move));
  },

  down(move, x, y) {
    robot.moveMouse(x, y + Number(move));
  },

  left(move, x, y) {
    robot.moveMouse(x - Number(move), y);
  },

  right(move, x, y) {
    robot.moveMouse(x + Number(move), y);
  }, 
};