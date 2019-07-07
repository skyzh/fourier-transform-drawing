# fourier-transform-drawing

Inspired by [3Blue1Brown - Pure Fourier series animations for 12 oddly satisfying minutes
](https://www.youtube.com/watch?v=-qgreAUpPwM)

Example svg from [Wikimedia](https://commons.wikimedia.org/wiki/Category:SVG_musical_notation#/media/File:Do_Mayor_armadura.svg)

## Generation Steps

0. Install Python, Node.js, etc. Run `yarn start` to start dev server. Visit web page at `http://localhost:8080`
1. Edit `transform_point` function, click on **Draw Original SVG**, adjust until the pattern fill the canvas.
2. Click **Dump SVG Data**. Note that it may take a long time. Copy `fft_data.json` to analysis folder.
3. Adjust `freq_range` in analysis.py. Run `./analysis.py > dump.json`.
4. Run `yarn start` again to see the result. You may see pattern like this

![image](https://user-images.githubusercontent.com/4198311/60770041-55eec600-a109-11e9-9add-a5db075373b0.png)
