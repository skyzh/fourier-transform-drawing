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

function run() {
  ctx.beginPath()
  const p = transform_point(get_point_fft(t))
  const x = p.x
  const y = p.y
  ctx.moveTo(x, y)
  _t = progress(t)
  const p_ = transform_point(get_point_fft(_t))
  const x_ = p_.x
  const y_ = p_.y
  ctx.lineTo(x_, y_)
  ctx.stroke()
  window.requestAnimationFrame(run)
}

window.requestAnimationFrame(run)

function run2() {
  ctx.beginPath()
  const p = transform_point(get_point(t))
  const x = p.x
  const y = p.y
  ctx.moveTo(x, y)
  _t = progress(t)
  const p_ = transform_point(get_point(_t))
  const x_ = p_.x
  const y_ = p_.y
  ctx.lineTo(x_, y_)
  ctx.stroke()
  t = progress(t)
  window.requestAnimationFrame(run2)
}

window.requestAnimationFrame(run2)

function integrate(f, t1, t2) {
  let sum = { x: 0, y: 0 }
  const n = 100000
  for (let i = 0; i < n; i++) {
    const t = Math.random() * (t2 - t1) + t1
    const p = f(t)
    sum.x += p.x
    sum.y += p.y
  }
  return { x: sum.x / n, y: sum.y / n }
}

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

freq_map = {}
const freq_max = 50
/*
for (let i = -freq_max; i <= freq_max; i++) {
  const fn = t => complex_mul(get_point(t), exp_i(-2 * i * Math.PI, t))
  freq_map[i] = integrate(fn, 0, 1)
  console.log(i, freq_map[i])
}
*/

freq_map = require('../analysis/dump.json')

// console.log(freq_map)

function get_point_fft(t) {
  let x = 0, y = 0
  for (let i = -freq_max; i <= freq_max; i++) {
    const p = complex_mul(
      exp_i(2 * i * Math.PI, t),
      freq_map[i]
    )
    x += p.x
    y += p.y
  }
  return { x, y }
}

/*

let i = 0
const loc = []
while(i < 1) {
  i += 0.00001
  const p = get_point(i)
  loc.push({x:p.x, y:p.y})
}

console.log(loc)
*/