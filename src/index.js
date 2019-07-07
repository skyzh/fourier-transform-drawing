const path = $('#path')[0]
const path_length = path.getTotalLength()

function get_point(t) {
  return path.getPointAtLength(t * path_length)
}

function transform_point(p) {
  p.x -= 200
  p.y -= 400
  p.x *= 3
  p.y *= 3
  return p
}

const ctx = $('#fft-canvas')[0].getContext('2d')
const ctx_ = $('#original-canvas')[0].getContext('2d')

let t = 0

function progress(t) {
  t += 0.003
  if (t > 1) return t - 1
  return t
}

let draw_original = false

function line_to_point(ctx, p) {
  ctx.lineTo(p.x, p.y)
}

function move_to_point(ctx, p) {
  ctx.moveTo(p.x, p.y)
}

function update_d3(points) {
  const svg = d3.select('#d3-svg')
  svg.selectAll('.vector')
    .data(points)
      .attr('x1', p => p.x)
      .attr('y1', p => p.y)
      .attr('x2', p => p.x + p.p.x)
      .attr('y2', p => p.y + p.p.y)
    .enter()
      .append('line')
      .attr('class', 'vector')
      .attr('stroke', '#292F36')
      .attr('stroke-width', '0.3')
      .attr('stroke-linecap', 'round')
    .exit()
      .remove()
  svg.selectAll('.circle')
    .data(points)
      .attr('cx', p => p.x)
      .attr('cy', p => p.y)
      .attr('r', p => p.r)
    .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('stroke', '#4ECDC4')
      .attr('stroke-width', '0.3')
      .attr('fill', 'none')
    .exit()
      .remove()
}

function run() {
  {
    ctx.beginPath()
    const p = get_point_fft(t)
    move_to_point(ctx, p)
  }
  {
    ctx_.beginPath()
    const p = transform_point(get_point(t))
    move_to_point(ctx_, p)
  }
  t = progress(t)
  {
    const p = get_point_fft(t)
    update_d3(p.points)
    line_to_point(ctx, p)
    ctx.stroke()
  }
  {
    const p = transform_point(get_point(t))
    line_to_point(ctx_, p)
    ctx_.stroke()
  }
  $('#d-status').text(`t = ${Math.round(t * 1000) / 1000}`)
  window.requestAnimationFrame(run)
}

window.requestAnimationFrame(run)

function exp_i(a, t) {
  return {
    x: Math.cos(a * t),
    y: Math.sin(a * t)
  }
}

function complex_mul(a, b) {
  return {
    x: a.x * b.x - a.y * b.y,
    y: a.x * b.y + a.y * b.x
  }
}

const freq_map = require('../analysis/dump.json')
const max_freq = _.max(_.keys(freq_map))
const freq_seq = _.sortBy(_.keys(freq_map), Math.abs)
console.log(freq_map)

function get_point_fft(t) {
  let x = 0, y = 0
  let points = _.map(freq_seq, i => {
    const c_n = freq_map[i]
    const p = complex_mul(
      exp_i(2 * i * Math.PI, t),
      c_n
    )
    const result =  { x, y, p, r: Math.sqrt(c_n.x * c_n.x + c_n.y * c_n.y) }
    x += p.x
    y += p.y
    return result
  })
  return { x, y, points }
}

$(document).ready(() => {
  $('#btn-dump').click(dump_svg)
  $('#btn-original').click(() => draw_original = true)
})

function dump_svg() {
  let i = 0
  const loc = []
  console.log('generation start')
  let cnt = 0
  while (i < 1) {
    i += 0.000001
    const p = transform_point(get_point(i))
    loc.push({ x: p.x, y: p.y })
    if ((cnt++) % 10000 == 0) {
      console.log(`dump progress ${Math.round(i * 10000) / 100}%`)
    }
  }
  window.fft_data = loc
  console.log(loc)
  console.save(loc, 'fft_data.json')
}

// http://bgrins.github.io/devtools-snippets/#console-save
(function (console) {
  console.save = function (data, filename) {

    if (!data) {
      console.error('Console.save: No data')
      return;
    }

    if (!filename) filename = 'console.json'

    if (typeof data === "object") {
      data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], { type: 'text/json' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
  }
})(console)
