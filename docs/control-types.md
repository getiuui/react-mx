---
id: control-types
title: Control Types
---

<h3 align="center">
  <a href="#overview">Overview</a>
  <span> • </span>
  <a href="#controls">Controls</a>
  <span> • </span>
  <a href="#validators">Validator</a>
  <span> • </span>
  <a href="#transformers">Transformers</a>
  <span> • </span>
  <a href="#examples">Examples</a>
  <span> • </span>
  <a href="#whats-next">What's next</a>
</h3>
<h4 align="center">
 <a href="#input">Input</a>
  <span> • </span>
  <a href="#textarea">Textarea</a>
  <span> • </span>
  <a href="#unitinput">UnitInput</a>
  <span> • </span>
  <a href="#select">Select</a>
  <span> • </span>
  <a href="#checkbox">Checkbox</a>
  <span> • </span>
  <a href="#switch">Switch</a>
  <span> • </span>
  <a href="#radio">Radio</a>
  <span> • </span>
  <a href="#togglebutton">ToggleButton</a>
  <span> • </span>
  <a href="#colorpicker">ColorPicker</a>
  <span> • </span>
</h4>

# Overview

A control is used to alter the value of a prop in the inspector when an instance is selected in the stage.
They largely map to specific types defined in editable-props.md

#### Generic options

All controls accept the following options:

|  Option   |           Type           |                             Description                             | default |
| :-------: | :----------------------: | :-----------------------------------------------------------------: | ------- |
|    key    |         `String`         |   Unique identifier; usually the `path` where the prop is applied   |         |
|   value   | `any` - control-specific |                      current value of the prop                      |         |
| required  |        `Boolean`         |       Flag that indicates if a value is required for the prop       | `false` |
| validate  |   `String \| Function`   |   Function or a predefined String - see [Validators](#validtors)    |         |
| transform |   `String \| Function`   | Function or a predefined String - see [Transformers](#transformers) | `trim`  |

# Controls

## Input

simplest form of text input accepting a String value

Variants: `text` (default), `email`, `password`, `url`, `number`

#### Input Options:

|   Option    |        Type        |              Description              | default |
| :---------: | :----------------: | :-----------------------------------: | ------- |
|    value    | `String \| Number` |         current value of prop         |         |
| placeholder |      `String`      | string to show when no value is added |         |

## Textarea

control used for props that reauire longer text values

#### Textarea Options:

|   Option    |        Type        |              Description              | default |
| :---------: | :----------------: | :-----------------------------------: | ------- |
|    value    | `String \| Number` |         current value of prop         |         |
| placeholder |      `String`      | string to show when no value is added |         |
|    colls    |      `Number`      |        number of input columns        |         |
|    rows     |      `Number`      |         number of input rows          | `4`     |

## UnitInput

`TBD in Milestone 2`

## Select

control used to chose values from a predefined list of values.
Best used when the number ov values is greater then 4, or the values cannot be represented with icons.
For 2-4 options, with textual representation [Radio](#radio) is recomended
For 2-4 option, with icon representation [ToggleButton](#togglebutton) is recommended

## Checkbox

control used to alter boolean values (alternative to [Switch](#switch))

## Switch

control used to alter boolean values (alternative to [Checkbox](#checkbox))

## Radio

control used to chose from multiple text based predefined values

## ToggleButton

control used to chose from multiple icon based predefined values

`TBD in Milestone 2`

## ColorPicker

`TBD in Milestone 2`

# Validators

A validator is function having the following signature:

```
function(value: String): Boolean
```

It returns true or false if the condition checked within the function is meet.

For convenience, some predefined validators are built in. They are implemented using the [Validator.js](https://github.com/validatorjs/validator.js) library.
To use them, pass a string value derived from the name of the validator available in the library.
The values are kebab-case names of validators, with the `is` string stripped.

Examples:

- `alpha => isAlpha`
- `alphanumeric => isAlphanumeric`
- `int => isInt`
- `mobile-phone => isMobilePhone`
- `data-uri => isDataURI`
- `hex-color => isHexColor`
- `function(input) { return input !== 'test' }`

# Transformers

T

#### Predefined

#### Custom Function

# What's next

<p id="next">
  - [x] General
  - [ ] Input (text, email, url)
  - [ ] Textarea
  - [ ] UnitInput
  - [ ] Select
  - [ ] Checkbox
  - [ ] Switch
  - [ ] Radio
  - [ ] ToggleButton
  - [ ] ColorPicker
  - [ ] ?Link (internal / external)
  - [ ] ?Media
  - [ ] examples
  - [ ] screenshots & alinks to Figma
</p>
