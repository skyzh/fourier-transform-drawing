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

window.ctx = ctx

let t = 0

function progress(t) {
  t += 0.003
  if (t > 1) return t - 1
  return t
}

let draw_original = false

function dispatch_get_point(t) {
  if (draw_original) {
    return transform_point(get_point(t))
  } else {
    return get_point_fft(t)
  }
}
function run() {
  ctx.beginPath()
  const p = dispatch_get_point(t)
  const x = p.x
  const y = p.y
  ctx.moveTo(x, y)
  t = progress(t)
  const p_ = dispatch_get_point(t)
  const x_ = p_.x
  const y_ = p_.y
  ctx.lineTo(x_, y_)
  ctx.stroke()
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

console.log(freq_map)

function get_point_fft(t) {
  let x = 0, y = 0
  _.forIn(freq_map, (c_n, i) => {
    const p = complex_mul(
      exp_i(2 * i * Math.PI, t),
      c_n
    )
    x += p.x
    y += p.y
  })
  return { x, y }
}

$(document).ready(() => {
  $('#btn-dump').click(dump_svg)
  $('#btn-original').click(() => draw_original = true)
})

function dump_svg() {
  let i = 0
  const loc = []
  console.log('generation start')
  while (i < 1) {
    i += 0.000005
    const p = transform_point(get_point(i))
    loc.push({ x: p.x, y: p.y })
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
