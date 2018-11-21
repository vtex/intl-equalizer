# Intl-Equalizer

A VTEX CLI for linting locale string files

Easy tool to compare between locale files and find missing keys

# Installation

Install Intl-Equalizer using yarn:

`yarn add --dev @vtex/intl-equalizer`

Or via npm:

`npm install --save-dev @vtex/intl-equalizer`

# Configuration

**1)** Add a new script to your package.json:

```json
"scripts": {
  "lint:locales": "intl-equalizer"
}
```

**2)** And Intl-Equalizer config in your `package.json`:

```json
"intl-equalizer": {
  "referenceLocale": "pt",
  "localeDirectory": "src/locales/"
}
```
