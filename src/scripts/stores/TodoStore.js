var Fluxxor = require('fluxxor');
var TodoConstants = require('../constants/TodoConstants');

var todoActions = {};
todoActions[TodoConstants.ADD_TODO] = "onAddTodo";
todoActions[TodoConstants.TOGGLE_TODO] = "onToggleTodo";
todoActions[TodoConstants.CLEAR_TODOS] = "onClearTodos";

var TodoStore = Fluxxor.createStore({

  actions: todoActions,

  initialize: function() {
    this.todos = [];
  },

  onAddTodo: function(payload) {
    this.todos.push({text: payload.text, complete: false});
    this.emit('change');
  },

  onToggleTodo: function(payload) {
    payload.todo.complete = !payload.todo.complete;
    this.emit('change');
  },

  onClearTodos: function(payload) {
    this.todos = this.todos.filter(function(todo) {
      return !todo.complete;
    });
    this.emit('change');
  },

  getState: function() {
    return {
      todos: this.todos
    };
  }

});

module.exports = TodoStore;