#!/bin/bash

for i in $(seq -w 4 20); do
    filename="chapter-${i}.md"
    touch "$filename"
    echo "Created $filename"
done
