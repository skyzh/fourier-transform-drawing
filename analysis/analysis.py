#!/usr/bin/env python3
import json
from numpy import array, exp, sum, arange, pi, linspace, real, imag

fp = open("fft_data.json")
fft_data = json.load(fp)
complex_real = array(list(map(lambda d: d["x"], fft_data)))
complex_imag = array(list(map(lambda d: d["y"], fft_data)))
complex_data = complex_real + 1j * complex_imag

# print(complex_data)

n = len(complex_data)
t = linspace(0, 1, n)

# print(t)

freq_range = 150

freq_map = dict()

for k in arange(-freq_range, freq_range + 1):
    xx = -2 * pi * k * 1j * t
    c_n = sum(complex_data * exp(xx)) / n
    # print(k, c_n)
    freq_map[int(k)] = { 'x': real(c_n), 'y': imag(c_n) }

print(json.dumps(freq_map))
