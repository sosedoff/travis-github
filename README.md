# Travis CI builds in Github

Chrome extension to add Travis CI builds tab to Github

## Install

Download from the [Chrome Store](https://chrome.google.com/webstore/detail/github-travis-ci-builds/dphnhapafaimelkockemokgfdocadbdo)

## Try

Try extension on any of the following repositories:

- https://github.com/twbs/bootstrap
- https://github.com/rails/rails
- https://github.com/docker/docker
- https://github.com/mitchellh/vagrant
- https://github.com/ansible/ansible

## Demo

![demo](demo.gif)

## Private Repos

In order to support private repos built on travis-ci.com, you need to configure 
the extension with a Travis CI API Token. The easiest way to obtain one is to 
run `sessionStorage.getItem('travis.token');` in the Chrome developer tools console, 
while on a travis-ci.com page. Add the token to this extension via the `Options` link 
on the Chrome extensions page OR right-clicking the icon in the menu bar and 
selecting `Options`.

## License

MIT