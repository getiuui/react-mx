---
id: editable-props
title: Editable props
---

<h3 align="center">
  <a href="#defintion">Definition</a>
  <span> • </span>
  <a href="#structure">Structure</a>
  <span> • </span>
  <a href="#examples">Examples</a>
  <span> • </span>
  <a href="#whats-next">What's next</a>
</h3>

<h2 id="defintion">Definition</h2>

Editable prop definition is a convention used to describe what kind of UI input has to be used to allow the user to change a prop when an intance of a component is selected.

Each component sould have an associated set of editable props, one for each available props.

For a given prop, the definition will describe:

- the type of the data
- the posible values / accepted values (and potentially transformations to raw input TBD)
- de default value
- the type of the input to be used
- the target where a prop should be applied
- weather the prop's control should be show by default in the inspector (ex: for and Image component `src` should always be show. Same, for a Link the `href` should always be visible in the inspector when selecting an instance.

##### Example

for the following component:

```js
const Card = ({ title, content, link, backgroundColor }) => (
  <div style={{ backgroundColor }}>
    <h1>{title}</h1>
    <p>{content}</p>
    <a href={link}>Access</a>
  </div>
);
```

there will be a prop definision for each 4 props:

| Prop                                           | Type                                  | Control                                          | default                  | accepted values                                                            |
| :--------------------------------------------- | :------------------------------------ | :----------------------------------------------- | :----------------------- | :------------------------------------------------------------------------- |
| <span class="prop-name">title</span>           | <span class="prop-type">String</span> | <span class="prop-type">input type="text"</span> | `test title`             | <span class="prop-desc">any string</span>                                  |
| <span class="prop-name">content</span>         | <span class="prop-type">String</span> | <span class="prop-type">textarea</span>          | `test content`           | <span class="prop-desc">any string</span>                                  |
| <span class="prop-name">link</span>            | <span class="prop-type">String</span> | <span class="prop-type">input type="url"</span>  | `https://www.google.com` | <span class="prop-desc">url compliant string</span>                        |
| <span class="prop-name">backgroundColor</span> | <span class="prop-type">String</span> | <span class="prop-type">ColorPicker</span>       | `#ffffff`                | <span class="prop-desc">hex / rgba / hsl / color or html color name</span> |

<h2 id="structure">Structure</h2>

```
 [propName]: {
   ket: String
   type: String | Numeric | Boolean | Object | Function | ReactElement | Array<T>
   default: valueOfType( T )
   control: {
     default: Boolean
     label: String
     type: Input | Textarea | UnitInput | Select | Checkbox | Switch | Radio | ToggleButton | ColorPicker |
     ?options: {
        ...  // control type specific options
     }
   }
 }
```

Please see ControlTypes file for controlls and their options (link to be added)

<h2 id="examples">Examples</h2>

<h2 id="whats-next">What's next</h2>
<p id="next">

- [x] generic structure of Ediatable props
- [x] Define types
- [ ] add link to Control Types md
- [ ] examples in MD
- [ ] examples is JS
  - [ ] for custom component
  - [ ] embeded in same file as definition (as named export)
  - [ ] in external file as default export
  - [ ] for existing component from lib (MaterialUI, ChakraUI etc)

</p>
