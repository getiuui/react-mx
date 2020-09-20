<p align="center">
  <a href="https://gitpoint.co/">
    <img alt="React MX" title="React MX" src="http://i.imgur.com/n7UZNjk.png" width="450">
  </a>
</p>
<h1 align="center"> React MX </h1> <br>
<p align="center">
  Visually create React components
</p>

<h3 align="center">
  <a href="#what-is-react-mx">React MX?</a>
  <span> • </span>
  <a href="#how-it-works">How it works</a>
  <span> • </span>
  <a href="#features">Features</a>
  <span> • </span>
  <a href="#setup">Setup</a>
  <span> • </span>
  <a href="#usage">Usage</a>
</h3>

<h2 id="what-is-react-mx">🤔 What is React MX?</h2>

React-MX is a drop-in visual component editor that lets you build new React components from scratch, by using your already existing components or any 3rd party libraries.

<h2 id="how-it-works">⚙️ How it works?</h2>

Once installed, import the `ReactMX` component from the `react-mx` package and place it on a new page of your react app. You can specify the components to use by manually passing the `components` prop to the `ReactMX` instance (see below) or automatically by adding your `react-mx-watcher` script to your npm package.json

ReactMX will allow you to drag-and-drop your componets to the "stage", modify their props, aggregate them and then save the result as a new compoponent

<h2 id="features">🔥 Features</h2>

- _directly integrated in your project_ - ReactMX runs _inside_ your project environment
- _100% offline_ - build, mock and tweak your components from anywhere, no internet or external resources needed
- _Preview your components_ - Present your components
- _Easy prop values manipulation_ - react-mx lets you define the type of control to be used to alter a specific prop
- _automatic prop controls_ - out of the box, most common props are automatically mapped to controlls (eg: styles, children, key etc)

<h2 id="setup">🚀 Setup</h2>

Install the `react-mx` package:

```
yarn add react-mx

or

npm i react-mx
```
