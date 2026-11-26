#!/usr/bin/env bash
# Builds responsive AVIF + WebP variants from photos-src/<slug>.jpeg into public/photos/<slug>-<width>.{avif,webp}.
# Widths are 640/960/1280 below the source width, plus the source width itself.
# Keep this rule in sync with variantWidths() in src/data/photos.ts.
# Requires: sips (macOS), cwebp (brew install webp), avifenc (brew install libavif).
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=photos-src
OUT=public/photos
mkdir -p "$OUT"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

shopt -s nullglob
sources=("$SRC"/*.jpeg)
if [[ ${#sources[@]} -eq 0 ]]; then
  echo "✗ No source photos in $SRC/" >&2
  exit 1
fi

for f in "${sources[@]}"; do
  slug=$(basename "$f" .jpeg)
  srcw=$(sips -g pixelWidth "$f" | awk '/pixelWidth/ {print $2}')
  widths=()
  for w in 640 960 1280; do
    if (( w < srcw )); then widths+=("$w"); fi
  done
  widths+=("$srcw")

  for w in "${widths[@]}"; do
    o="$OUT/$slug-$w"
    # Rebuild only when the source is newer than the output. Metadata (EXIF/GPS) is stripped.
    if [[ ! "$o.webp" -nt "$f" ]]; then
      cwebp -quiet -q 80 -metadata none -resize "$w" 0 "$f" -o "$o.webp"
    fi
    if [[ ! "$o.avif" -nt "$f" ]]; then
      sips -s format png --resampleWidth "$w" "$f" --out "$tmp/in.png" >/dev/null
      avifenc -q 60 -s 6 --ignore-exif --ignore-xmp "$tmp/in.png" "$o.avif" >/dev/null
    fi
  done
  echo "  ✓ $slug (${widths[*]})"
done
