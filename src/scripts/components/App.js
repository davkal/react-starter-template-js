/** @jsx React.DOM */
/*global React*/

var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TodoItem = require('./TodoItem');

var App = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("TodoStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();

    return flux.store("TodoStore").getState();
  },

  render: function() {

    return (
      <div>
        <ul>
          {this.state.todos.map(function(todo, i) {
            return <li key={i}><TodoItem todo={todo} /></li>;
          })}
        </ul>
        <form onSubmit={this.onSubmitForm}>
          <input ref="input" type="text" size="30" placeholder="New Todo" />
          <input className="btn btn-default" type="submit" value="Add Todo" />
        </form>
        <button className="btn btn-default" onClick={this.clearCompletedTodos}>Clear Completed</button>
      </div>
    );

  },

  onSubmitForm: function(e) {
    e.preventDefault();
    var node = this.refs.input.getDOMNode();
    this.getFlux().actions.addTodo(node.value);
    node.value = "";
  },

  clearCompletedTodos: function(e) {
    this.getFlux().actions.clearTodos();
  }
});

module.exports = App;