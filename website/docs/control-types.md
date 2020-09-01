---
id: control-types
title: Control Types
---

<h3 align="center">
  <a href="#overview">Overview</a>
  <span> • </span>
  <a href="#controls">Controls</a>
  <span> • </span>
  <a href="#validators">Validators</a>
  <span> • </span>
  <a href="#transformers">Transformers</a>
  <span> • </span>
  <a href="#examples">Examples</a>
  <span> • </span>
  <a href="#whats-next">What's next</a>
</h3>

# Overview

A control is used to alter the value of a prop in the inspector when an instance is selected in the stage.
They largely map to specific types defined in editable-props.md

#### Generic options

All controls accept the following options:

| Option                                         | Type                                                  | Description                                                                                    | default |
| :--------------------------------------------- | :---------------------------------------------------- | :--------------------------------------------------------------------------------------------- | ------- |
| <span class="prop-name">key</span>             | <span class="prop-type">String</span>                 | <span class="prop-desc">Unique identifier; usually the `path` where the prop is applied</span> |         |
| <span class="prop-name">value</span>           | <span class="prop-type">any - control-specific</span> | <span class="prop-desc">current value of the prop</span>                                       |         |
| <span class="prop-name">required</span>        | <span class="prop-type">Boolean</span>                | <span class="prop-desc">Flag that indicates if a value is required for the prop</span>         | `false` |
| <span class="prop-name">validate</span>        | <span class="prop-type">String &#124; Function</span> | <span class="prop-desc">Function or a predefined String - see [Validators](#validtors)</span>  |         |
| <span class="prop-name">validateParams</span>  | <span class="prop-type">any</span>                    | <span class="prop-desc">extra param or array of params to be sent to the validator</span>      |         |
| <span class="prop-name">transform</span>       | <span class="prop-type">String &#124; Function</span> | <span class="prop-desc">Function or a predefined String - see [Transformers]</span>            |         |
| <span class="prop-name">transformParams</span> | <span class="prop-type">any</span>                    | <span class="prop-desc">extra param or array of params to be sent to the transformer</span>    |         |

# Controls

## Input

simplest form of text input accepting a String value

Variants: `text` (default), `email`, `password`, `url`, `number`

#### Input Options:

| Option                                     | Type                                                | Description                                                          | default |
| :----------------------------------------- | :-------------------------------------------------- | :------------------------------------------------------------------- | ------- |
| <span class="prop-name">value</span>       | <span class="prop-type">String &#124; Number</span> | <span class="prop-desc">current value of prop</span>                 |         |
| <span class="prop-name">placeholder</span> | <span class="prop-type">String</span>               | <span class="prop-desc">string to show when no value is added</span> |         |

## Textarea

control used for props that reauire longer text values

#### Textarea Options:

| Option                                     |                        Type                         |                             Description                              | default |
| :----------------------------------------- | :-------------------------------------------------: | :------------------------------------------------------------------: | ------- |
| <span class="prop-name">value</span>       | <span class="prop-type">String &#124; Number</span> |         <span class="prop-desc">current value of prop</span>         |         |
| <span class="prop-name">placeholder</span> |        <span class="prop-type">String</span>        | <span class="prop-desc">string to show when no value is added</span> |         |
| <span class="prop-name">colls</span>       |        <span class="prop-type">Number</span>        |        <span class="prop-desc">number of input columns</span>        |         |
| <span class="prop-name">rows</span>        |        <span class="prop-type">Number</span>        |         <span class="prop-desc">number of input rows</span>          | `4`     |

## UnitInput

`TBD in Milestone 2`

## Select

control used to chose values from a predefined list of values.
Best used when the number ov values is greater then 4, or the values cannot be represented with icons.
For 2-4 options, with textual representation [Radio](#radio) is recomended
For 2-4 option, with icon representation [ToggleButton](#togglebutton) is recommended

#### Select Options:

| Option                                     |                                                                      Type                                                                       |                             Description                              | default |
| :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------: | ------- |
| <span class="prop-name">value</span>       |                                               <span class="prop-type">String &#124; Number</span>                                               |         <span class="prop-desc">current value of prop</span>         |         |
| <span class="prop-name">placeholder</span> |                                                      <span class="prop-type">String</span>                                                      | <span class="prop-desc">string to show when no value is added</span> |         |
| <span class="prop-name">options</span>     | <span class="prop-type">Array<String &#124; Number</span> <br />or<br /> <span class="prop-type">Object<{ value: S &#124; N, label: S }></span> |        <span class="prop-desc">number of input columns</span>        | `[]`    |

## Checkbox

control used to alter boolean values (alternative to [Switch](#switch))

## Switch

control used to alter boolean values (alternative to [Checkbox](#checkbox))

## Radio

control used to chose from multiple text based predefined values (alternative to [Select](#select))

#### Radio Options:

| Option                                 |                                                                      Type                                                                       |                      Description                       | default |
| :------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------: | ------- |
| <span class="prop-name">value</span>   |                                               <span class="prop-type">String &#124; Number</span>                                               |  <span class="prop-desc">current value of prop</span>  |         |
| <span class="prop-name">options</span> | <span class="prop-type">Array<String &#124; Number</span> <br />or<br /> <span class="prop-type">Object<{ value: S &#124; N, label: S }></span> | <span class="prop-desc">number of input columns</span> | `[]`    |

## ToggleButton

control used to chose from multiple icon based predefined values

`TBD in Milestone 2`

## ColorPicker

`TBD in Milestone 2`

# Validators

A validator is function having the following signature:

```typescript
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

A transformer is a function that receives a raw value of a control and returns it as a processed one.

Transformer signature:

```typescript
function(value: String, ?params: any | Array<any>): String | Number | Boolean | Object | null
```

By default, all sanitizers defined in [Validator.js](https://github.com/validatorjs/validator.js#sanitizers) are available as transformers.

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
