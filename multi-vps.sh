#!/bin/bash

PROJECT_ID="vps-bot-$RANDOM"
REGIONS=("us-central1" "us-east1" "us-east4" "us-west1" "us-west2" "us-west3" "us-west4" "northamerica-northeast1")
ZONE_SUFFIXES=("a" "b" "c")

echo "⏳ Setting up Google Cloud project..."
gcloud projects create $PROJECT_ID
gcloud config set project $PROJECT_ID
gcloud services enable compute.googleapis.com

echo "🔐 Setting default config..."
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

echo "🌐 Creating firewall rule..."
gcloud compute firewall-rules create allow-ssh \
  --allow tcp:22 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=ssh

i=1
for REGION in "${REGIONS[@]}"; do
  ZONE="${REGION}-${ZONE_SUFFIXES[$((RANDOM % 3))]}"
  INSTANCE_NAME="vps-$i"

  echo "🚀 Creating $INSTANCE_NAME in $ZONE..."

  gcloud compute instances create "$INSTANCE_NAME" \
    --zone="$ZONE" \
    --machine-type=f1-micro \
    --tags=ssh \
    --metadata=startup-script='
      sudo apt update -y && sudo apt install -y curl git nodejs npm
      git clone https://github.com/sawaikh/vps-bot.git
      cd vps-bot
      npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth node-telegram-bot-api
      nohup node vpsClient.js > log.txt 2>&1 &
    '

  ((i++))
done

echo "✅  All 8 VPS deployed and bot started."
