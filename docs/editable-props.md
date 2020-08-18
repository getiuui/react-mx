# Editable props

<h3 align="center">
  <a href="#defintion">Definition</a>
  <span> • </span>
  <a href="#structure">Generic structure</a>
  <span> • </span>
  <a href="#types">Generic Types</a>
  <span> • </span>
  <a href="#types-special">Special Types</a>
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
 
##### Example

for the following component: 
```js
const Card = ({title, content, link, backgroundColor}) => (
  <div style={{backgroundColor}}>
    <h1>{title}</h1>
    <p>{content}</p>
    <a href={link}>Access</a>
  </div>
)
```

there will be a prop definision for each 4 props:

|        Prop       	|  Type  	|        Control       	|         default        	|               accepted values               	|
|:-----------------:	|:------:	|:-------------------:	|:----------------------:	|:-------------------------------------------:	|
| `title`           	| String 	| `input type="text"` 	| test title             	| any string                                  	|
| `content`         	| String 	| `textarea`          	| test content           	| any string                                  	|
| `link`            	| String 	| `input type="url"`  	| https://www.google.com 	| url compliant string                        	|
| `backgroundColor` 	| String 	| `ColorPicker`       	| #ffffff                	| hex / rgba / hsl / color or html color name 	|

<h2 id="structure">Structure</h2>

```
 [propName]: {
   ket: String
   type: oneOf: String | Numeric | Object
   default: valueOfType( String | Numeric | Object )
   control: {
     label: String
     type: oneOf: Input | Textarea | UnitInput | Select | ColorPicker (etc)
     ?options: {
        ...  // type specific options 
     }
   }
 }
```

<h2 id="types">Generic Types</h2>

<h2 id="types-special">Special Types</h2>

<h2 id="examples">Examples</h2>

<h2 id="whats-next">What's next</h2>
<p id="next">

  - [ ] generic structure of Ediatable props
  - [ ] Define types:
    - [ ] free text (short and long)
    - [ ] numeric
    - [ ] object
    - [ ] predefined options (enum based)
    - [ ] special types:
      - [ ] color
      - [ ] unit (px / em / rem / %)
      - [ ] media types
  - [ ] examples in MD
  - [ ] examples is JS
    - [ ] for custom component
    - [ ] for existing component from lib (MaterialUI, ChakraUI etc)

</p>
