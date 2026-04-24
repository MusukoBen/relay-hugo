#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════
# RELAY MARKETING — Multi-Format Renderer
# Renders HTML templates to PNG for all social media formats:
#   • Instagram Post:  1080×1350 (4:5 portrait)
#   • Twitter Card:    1200×675  (16:9)
#   • LinkedIn Post:   1200×627  (~16:9)
#   • Story / Reel:    1080×1920 (9:16 vertical)
#
# Usage:
#   ./render.sh                  # render everything
#   ./render.sh instagram        # render only one format
#   ./render.sh twitter linkedin # render multiple formats
# ════════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/templates"
OUTPUT_DIR="$SCRIPT_DIR/output"

# Locate Chrome
CHROME=""
if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif command -v google-chrome &> /dev/null; then
  CHROME="google-chrome"
elif command -v chromium &> /dev/null; then
  CHROME="chromium"
elif [ -x "/Applications/Chromium.app/Contents/MacOS/Chromium" ]; then
  CHROME="/Applications/Chromium.app/Contents/MacOS/Chromium"
else
  echo "❌ Chrome/Chromium not found. Install Google Chrome and try again."
  exit 1
fi

# Format definitions (bash 3.2 compatible — no assoc arrays)
get_format_size() {
  case "$1" in
    instagram) echo "1080x1350" ;;
    twitter)   echo "1200x675"  ;;
    linkedin)  echo "1200x627"  ;;
    story)     echo "1080x1920" ;;
    lemon)     echo "1600x1200" ;;
    *)         echo "" ;;
  esac
}

render_format() {
  local format="$1"
  local size
  size=$(get_format_size "$format")

  if [ -z "$size" ]; then
    echo "⚠️  Unknown format: $format"
    return
  fi

  local width="${size%x*}"
  local height="${size#*x}"
  local in_dir="$TEMPLATES_DIR/$format"
  local out_dir="$OUTPUT_DIR/$format"

  if [ ! -d "$in_dir" ]; then
    echo "⚠️  Templates folder not found: $in_dir"
    return
  fi

  mkdir -p "$out_dir"

  echo ""
  echo "📦 $format · ${width}×${height}"
  echo "   $in_dir → $out_dir"

  local count=0
  for template in "$in_dir"/*.html; do
    [ -f "$template" ] || continue
    local filename
    filename=$(basename "$template" .html)
    local output="$out_dir/$filename.png"

    echo "  → $filename.png"

    "$CHROME" \
      --headless \
      --disable-gpu \
      --hide-scrollbars \
      --no-sandbox \
      --window-size="$width,$height" \
      --default-background-color=00000000 \
      --screenshot="$output" \
      "file://$template" \
      2>/dev/null

    count=$((count + 1))
  done

  echo "   ✓ $count files"
}

# Determine which formats to render
if [ $# -eq 0 ]; then
  TARGETS=("instagram" "twitter" "linkedin" "story" "lemon")
else
  TARGETS=("$@")
fi

echo "🎨 Relay Marketing Renderer"
echo "   Chrome: $CHROME"

for fmt in "${TARGETS[@]}"; do
  render_format "$fmt"
done

echo ""
echo "✅ Done"
echo ""

# Summary
total=0
for fmt in "${TARGETS[@]}"; do
  if [ -d "$OUTPUT_DIR/$fmt" ]; then
    n=$(find "$OUTPUT_DIR/$fmt" -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
    total=$((total + n))
    printf "   %-12s %d files in output/%s/\n" "$fmt" "$n" "$fmt"
  fi
done
echo ""
echo "   Total: $total images"
