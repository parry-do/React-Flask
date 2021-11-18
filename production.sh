#!/bin/bash
export MODE=production

cpus=$(grep ^cpu\\scores /proc/cpuinfo | uniq |  awk '{print $4}')
workers=$(expr 2 \* $cpus + 2)

npm run-script build

gunicorn -w $workers main:app -b 0.0.0.0:8080
