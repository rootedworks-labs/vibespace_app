#!/bin/sh
set -e

# This script prepends a rule to pg_hba.conf to allow md5 connections from any IP.
# This ensures it's checked before the default scram-sha-256 rule.

HBA_FILE="$PGDATA/pg_hba.conf"
TEMP_FILE="/tmp/pg_hba.conf.tmp"

# The rule to add
HBA_LINE="host    all             all             0.0.0.0/0               md5"

# Write the new rule to a temporary file
echo "$HBA_LINE" > "$TEMP_FILE"

# Append the original content to the temporary file
cat "$HBA_FILE" >> "$TEMP_FILE"

# Replace the original file with the new one
mv "$TEMP_FILE" "$HBA_FILE"

