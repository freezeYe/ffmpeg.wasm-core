#!/bin/bash

set -euo pipefail
source $(dirname $0)/var.sh

FLAGS=(
  "${FFMPEG_CONFIG_FLAGS_BASE[@]}"
  --disable-all
  --enable-gpl            # required by x264
  --enable-libx264        # enable x264
  --enable-avcodec
  --enable-avformat
  --enable-avfilter
  --enable-swresample
  --enable-swscale
  --enable-decoder=h264
  --enable-encoder=rawvideo,libx264
  --enable-parser=h264
  --enable-protocol=file
  --enable-demuxer=mov
  --enable-muxer=rawvideo,mp4
  --enable-filter=scale,format
)
echo "FFMPEG_CONFIG_FLAGS=${FLAGS[@]}"
emconfigure ./configure "${FLAGS[@]}"
