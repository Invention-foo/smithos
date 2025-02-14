#!/bin/bash

# Function for logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function for error logging and exit
error_exit() {
    log "ERROR: $1" >&2
    exit 1
}

# Check for required argument
if [ "$#" -ne 1 ]; then
    error_exit "Usage: $0 [-beta|-prod]"
fi

# Set deploy directory based on argument
case "$1" in
    -beta)
        DEPLOY_DIR="/var/www/smithos-beta"
        ;;
    -prod)
        DEPLOY_DIR="/var/www/smithos-prod"
        ;;
    *)
        error_exit "Invalid argument. Use -beta or -prod"
        ;;
esac

# Build the application
log "Starting Next.js build process..."
if ! npm run build; then
    error_exit "Next.js build failed"
fi
log "Build completed successfully"

# Remove existing build directory
log "Removing existing build directory..."
if ! sudo rm -rf "$DEPLOY_DIR"; then
    error_exit "Failed to remove existing $DEPLOY_DIR directory"
fi
log "Removed existing $DEPLOY_DIR directory"

# Create new directory
log "Creating new build directory..."
if ! sudo mkdir -p "$DEPLOY_DIR"; then
    error_exit "Failed to create $DEPLOY_DIR directory"
fi

# Move and copy required files
log "Moving/copying build files..."
if ! sudo mv .next "$DEPLOY_DIR/"; then
    error_exit "Failed to move .next directory"
fi

if ! sudo cp -r node_modules "$DEPLOY_DIR/"; then
    error_exit "Failed to copy node_modules"
fi

if ! sudo cp package.json "$DEPLOY_DIR/"; then
    error_exit "Failed to copy package.json"
fi

if ! sudo cp next.config.mjs "$DEPLOY_DIR/"; then
    error_exit "Failed to copy next.config.mjs"
fi

if ! sudo cp -r public "$DEPLOY_DIR/"; then
    error_exit "Failed to copy public directory"
fi

# Copy environment file if it exists
if [ -f ".env.production" ]; then
    log "Copying .env.production file..."
    if ! sudo cp .env.production "$DEPLOY_DIR/"; then
        error_exit "Failed to copy .env.production"
    fi
fi

# Set permissions
log "Setting permissions..."
if ! sudo chown -R www-data:www-data "$DEPLOY_DIR"; then
    error_exit "Failed to set ownership"
fi

if ! sudo chmod -R 755 "$DEPLOY_DIR"; then
    error_exit "Failed to set permissions"
fi

log "Next.js build updated successfully"

case "$1" in
    -beta)
        if ! sudo supervisorctl restart smithos_beta; then
            error_exit "Failed to restart smithos_beta"
        fi
        ;;
    -prod)
        if ! sudo supervisorctl restart smithos_prod; then
            error_exit "Failed to restart smithos_prod"
        fi
        ;;
esac

log "Supervisor restart completed successfully"