/** @jsx React.DOM */
/*global React*/

var FluxChildMixin = require('fluxxor').FluxChildMixin(React);

var TodoItem = React.createClass({
  mixins: [FluxChildMixin],

  propTypes: {
    todo: React.PropTypes.object.isRequired
  },

  render: function() {

    var style = {
      "text-decoration": this.props.todo.complete ? "line-through" : ""
    };

    return (
      <span style={style} onClick={this.onClick}>{this.props.todo.text}</span>
    );

  },

  onClick: function(e) {
    this.getFlux().actions.toggleTodo(this.props.todo);
  }

});

module.exports = TodoItem;