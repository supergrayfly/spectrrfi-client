#!/bin/sh
# convert md to html file using markdown-styles, generate-md command with github theme
generate-md --layout github --input guide.md --output guide-pretty/
# build the package to apply changes to dist/
npm run build
