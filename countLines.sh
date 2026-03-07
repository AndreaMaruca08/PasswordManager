#!/bin/bash

# Trova tutti i file .ts sotto src, conta le linee per file, ordina e poi somma

# Ottieni numero di linee per file
line_counts=$(find src -name '*.ts' -type f -exec wc -l {} + | sort -n)

echo "$line_counts"

# Calcola la somma totale delle linee
total=$(echo "$line_counts" | awk '{sum += $1} END {print sum}')