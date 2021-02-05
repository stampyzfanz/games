# Goals
## This file's goal

To put into writing what I want to do with this game so that I don't overengineer it and my plan is clear and straightforward

## Gameplan for NeuroTetris
- [x] Measure aggregate height (Sum of all column heights)
- [x] Measure complete lines
- [x] Measure holes
- [x] Measure bumpiness
- [x] Use takes these measurements for every orientation of every position of the tetromino.
- [x] Times these values by weights determined by GA
- [x] Try to visualise it somehow

## Goals
- [x] Remove NN code
- [x] Do algorithms for the measurements
- [x] Make GA
- [] Does it clear 10 lines?
- [] Does it beat me and clear 1000 lines?
- [] Does it beat human champion?
- [] Include next tetromino to factor into decision.

## Bugs
- [] Does it work?

## Steps
- [x] run piece picking algorithm every generation
- [x] fix when it randomly restarts
- [x] check bumpiness and debug maybe
- [] do GA
- [] make it faster
- [x] visualise it picking
- [] remove unnessessary code (eg debug var, console logs, all the extra code for clone.js)
- [] rename repo to reflect the mode of ML used (ie GA Tetris rather than Neuro or NEAR Tetris)
