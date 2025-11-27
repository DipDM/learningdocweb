#!/bin/bash

for i in $(seq -w 1 15); do
    filename="chapter-${i}.md"
    touch "$filename"
    echo "Created $filename"
done
