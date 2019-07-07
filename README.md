# fourier-transform-drawing

Inspired by [3Blue1Brown - Pure Fourier series animations for 12 oddly satisfying minutes
](https://www.youtube.com/watch?v=-qgreAUpPwM)

Example svg from [Wikimedia](https://commons.wikimedia.org/wiki/Category:SVG_musical_notation#/media/File:Do_Mayor_armadura.svg)

You may view the result at [https://skyzh.github.io/fourier-transform-drawing/](https://skyzh.github.io/fourier-transform-drawing/)

## What does it do

Let **f** : R -> R^2, **f** denotes a function from time **t** to complex plane.

**f** represents a svg path. Obtain fourier series of **f**.

On the webpage a blue circle represents one term in the series.

## Generation Steps

0. Install Python, Node.js, etc. Run `yarn start` to start dev server. Replace SVG path in `index.html`. Visit web page at `http://localhost:8080`
1. Edit `transform_point` function, watch pattern in `Original SVG`, adjust until the pattern fills the canvas.
2. Click **Dump SVG Data**. Note that it may take a long time. View progress in console. Copy `fft_data.json` to analysis folder.
3. Adjust `freq_range` in analysis.py. Run `./analysis.py > dump.json`.
4. Run `yarn start` again to see the result. You may see pattern like this

![image](https://user-images.githubusercontent.com/4198311/60770543-87b65b80-a10e-11e9-9de0-01c8f029b094.png)

