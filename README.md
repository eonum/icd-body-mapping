# icd-body-mapping
Web app for the mapping of ICD-codes to the human body

# Authors

Aaron Sägesser, Linn Haeffner, Joshua Felder, Marius Asadauskas

# Documentation

Required frameworks

Ruby on Rails, PostgreSQL ReactJS, Node.js, npm (included in most Node.js installers), yarn

User handbook available in Root directory (german)

## Installation guide (Always control versions, given versions are currently in use for this project)

### Linux (Ubuntu) (requires configured git account)

Always update & upgrade before installing new software

#### Install Node.js (12.16.1)

Open Terminal (ctrl+alt+t)

```
sudo apt install nodejs
sudo apt install npm
```

#### Add Webpacker support by yarn (v1.22.4) repositories

Open Terminal (ctrl+alt+t)

```
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update
sudo apt-get install git-core zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libffi-dev nodejs yarn
```

#### Install Ruby (2.6.0) via rbenv (rbenv install included)

```
cd
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

rbenv install 2.6.5
rbenv global 2.6.5
ruby -v
```

#### Install additional bundler

```
gem install bundler
```

#### Install Rails (6.0.2.2)

```
gem install rails -v 6.0.2.2
rbenv rehash

check version

rails -v
```

#### nokogiri (2.9.10) might come preinstalled with rails

```sudo apt-get install build-essential patch ruby-dev zlib1g-dev liblzma-dev
gem install nokogiri
```

#### Install PostgreSQL (12.2):
```
sudo apt install postgresql-10 libpq-dev
```

### Windows

#### Node.js (12.16.1):

Download Node.js from 'https://nodejs.org/en/download/' and install, npm (6.13.4) is included

#### Yarn (v1.22.4):

Download yarn from 'https://classic.yarnpkg.com/en/docs/install/#windows-stable' and install

Alternatively use Chocolatey (Package manager for windows)

#### Ruby (2.6.5):

Download Ruby from 'https://rubyinstaller.org/downloads/' and install

Check version:
```
C:\ ruby -v
```

#### Rails (6.0.2.2):

Open CMD to install Rails (windows + R, type "cmd", hit enter)
```
C:\> gem install rails
```
If you installed Ruby on a drive other than your C:\ (as in not your system drive), change directory to the Ruby drive:
```
C:\> cd\
C:\> d:         (as example for changing to drive D:\
```
Check version:
```
C:\> rails -v
```

#### nokogiri (2.9.10)

Some installers include nokogiri, in case of errors due to wrong version or absence try the following commands
```
gem install nokogiri
gem install nokogiri -v '2.9.10'         (as of this moment the latest version is '2.9.10'
gem install nokogiri --platform=ruby
```
Check version:
```
C:\> nokogiri -v
```

#### PostgreSQL (12.2)

Download PostgreSQL from 'https://www.postgresql.org/download/windows/' and install

## Application run guide

### Linux

Open Terminal in $YOUR_PATH/icd-body-mapping/bin and execute the start.sh file

```
sh start.sh
```

### Windows

Open Terminal in $YOUR_PATH/icd-body-mapping and install dependencies

```
bundle install
```

Start the application

```
rails server
```
