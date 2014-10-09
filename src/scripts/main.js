/** @jsx React.DOM */

// Bring in jQuery and React as a Bower component in the global namespace
require("script!react/react-with-addons.js")
require("script!jquery/jquery.js")
require("script!bootstrap/dist/js/bootstrap.js");

React.renderComponent(
    <h1>Hello, world!</h1>,
    document.getElementById('app')
);

