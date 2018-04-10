# Scraper

## Getting started on macOS

```bash
# open terminal and run this command to check if you have node installed and which version
# node.js >= 8.x is required
node -v

# if node is not installed run this
brew install node

# or alternatively
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"

# once node is available clone repo package using git
git clone https://github.com/itemsapi/scraper.git

# go into package
cd ./scraper

# install libraries using npm
npm install

# run tool
PORT=3007 npm start
```

## Getting started on Ubuntu 14.04

```bash
# check if you have node installed and which version
# node.js >= 8.x is required
node -v

# install node
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# clone repo
git clone https://github.com/itemsapi/scraper.git

# go into package
cd ./scraper

# install libraries using npm
npm install

# run tool
PORT=3007 npm start
```
