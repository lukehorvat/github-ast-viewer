# GitHub AST Viewer [![Version](https://img.shields.io/github/release/lukehorvat/github-ast-viewer.svg?style=flat-square)](https://github.com/lukehorvat/github-ast-viewer/releases)

Google Chrome extension for viewing the abstract syntax tree (AST) of code on GitHub.

Currently only JavaScript code is supported, but more language support to come in the future!

## Installation

Install the extension from the Google Chrome Web Store:

https://chrome.google.com/webstore/detail/github-ast-viewer/kgncjlmmhhmhbiiacajdmpnhplahelkh

## Usage

The extension adds an **AST** button to the GitHub page of any file in a repository. Clicking it will display the abstract syntax tree representation of the code. Demonstration:

![Screenshot](http://i.imgur.com/jumGRMd.gif)

## Contributing

All contributions are welcome.

After cloning the repository using Git, execute `npm install` to fetch the dependencies, and `npm start` to auto-build the extension while you work. Once you've committed your changes, just open a pull request on GitHub.

In particular, a few things I'd like help with:

- Adding support for more programming languages. This isn't easy, because all parsing has to be done in the web browser via JavaScript, which drastically reduces our choice of parsers. So if you know of any robust JavaScript-based parsers for other languages (that are as good as [Esprima](https://github.com/jquery/esprima)), let me know.
- Implementing handling of GitHub Gists.
- Investigating feasibility of AST *editing* via the GitHub interface. [Woah](http://i.imgur.com/dOr884t.gif).

## Disclaimer

The extension is not officially affiliated with GitHub in any way. Use at own risk.
