#!/usr/bin/env bash
set -e
echo "Creating models directory..."
mkdir -p models
BASE=https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js@0.22.2/weights
FILES=(
  "tiny_face_detector_model-shard1"
  "tiny_face_detector_model-weights_manifest.json"
  "face_expression_model-shard1"
  "face_expression_model-weights_manifest.json"
)
for f in "${FILES[@]}"; do
  echo "Downloading ${f}..."
  curl -L -o "models/${f}" "${BASE}/${f}"
done
echo "Done. Models are in ./models"
