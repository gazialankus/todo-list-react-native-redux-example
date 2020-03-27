/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text, TextInput,
  View, Alert, FlatList, TouchableHighlight
} from 'react-native';
import { combineReducers } from 'redux'
import { createStore } from 'redux'
import {connect, Provider} from 'react-redux'


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
      'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
      'Shake or press menu button for dev menu',
});

const sampleState = {
  todos: [{
    key: "0",
    text: 'Eat food',
    completed: true
  }, {
    key: "1",
    text: 'Exercise',
    completed: false
  }, {
    key: "2",
    text: 'Exercise',
    completed: false
  }, {
    key: "3",
    text: 'Exercise',
    completed: false
  }, {
    key: "4",
    text: 'Exercise',
    completed: false
  }, {
    key: "5",
    text: 'Exercise',
    completed: false
  }, {
    key: "6",
    text: 'Exercise',
    completed: false
  }, {
    key: "7",
    text: 'Exercise',
    completed: false
  }, {
    key: "8",
    text: 'Exercise',
    completed: false
  }, {
    key: "9",
    text: 'Exercise',
    completed: false
  }, {
    key: "10",
    text: 'Exercise',
    completed: false
  }, {
    key: "11",
    text: 'Exercise',
    completed: false
  }, {
    key: "12",
    text: 'Exercise',
    completed: false
  }, {
    key: "13",
    text: 'Exercise',
    completed: false
  }, {
    key: "14",
    text: 'Exercise',
    completed: false
  }, {
    key: "15",
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_ALL'
};

// action types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

const SHOW_ALL = 'SHOW_ALL';
const SHOW_ACTIVE = 'SHOW_ACTIVE';
const SHOW_COMPLETED = 'SHOW_COMPLETED';

// sample actions. not actually used.
const action1 = { type: ADD_TODO, text: 'Go to swimming pool' };
const action2 = { type: TOGGLE_TODO, index: 1 };
const action3 = { type: SET_VISIBILITY_FILTER, filter: SHOW_ALL };

// reducers
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === SET_VISIBILITY_FILTER) {
    return action.filter;
  } else {
    return state;
  }
}

function todos(state = [], action) {
  let newArray;
  switch (action.type) {
    case ADD_TODO:
      newArray = state.slice();
      newArray.push({key: newArray.length.toString(), text: action.text, completed: false});
      return newArray;
      break;
    case TOGGLE_TODO:
      newArray = state.slice();
      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i].key == action.index) {
          newArray[i] = {key: newArray[i].key, text: newArray[i].text, completed: !newArray[i].completed};
          break;
        }
      }
      return newArray;
      break;
    default:
      return state;
  }
}

const todoApp = combineReducers({
  visibilityFilter,
  todos
});

let store = createStore(todoApp, sampleState);



class AddTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  buttonWasClicked = () => {
    this.props.dispatch({ type: ADD_TODO, text: this.state.text });
  };

  render() {
    return (
        <View style={{backgroundColor: '#6eaa3d', height: 100}}>
          <TextInput
              onChangeText={(text) => this.setState({text})}
          />
          <Button title="Add" onPress={this.buttonWasClicked}/>
        </View>
    );
  }
}

AddTodo = connect()(AddTodo);


class Todo extends Component {

  render() {
    return (
        <View style={{backgroundColor: 'red'}}>
          <TouchableHighlight underlayColor="white" onPress={() => {this.props.onClick();}}>
            <Text style={this.props.completed ? [styles.item, styles.completed] : styles.item}>{this.props.text}</Text>
          </TouchableHighlight>
        </View>
    )
  }
}

class TodoList extends Component {
  render() {
    return (
        <View style={{flex: 1, backgroundColor: '#667caa'}}>
          <FlatList
              data={this.props.todos}
              renderItem={(o) => <Todo text={o.item.text} completed={o.item.completed} onClick={()=>{this.props.onTodoClick(o.item.key);}}/>}
          />
        </View>
    )
  }
}

class Link extends Component {
  render() {
    return (

        <Button color={this.props.active==true ? 'red': 'blue'} title={this.props.children} onPress={this.props.onClick}/>
    )
  }
}

class Footer extends Component {
  render() {
    return (
        <View style={{backgroundColor: '#aa4978', height: 60, flexDirection: 'row', padding: 10}}>
          <FilterLink filter={SHOW_ALL}>All</FilterLink>
          <FilterLink filter={SHOW_COMPLETED}>Complete</FilterLink>
          <FilterLink filter={SHOW_ACTIVE}>Active</FilterLink>
        </View>
    )
  }
}



const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case SHOW_COMPLETED:
      return todos.filter(t => t.completed);
    case SHOW_ACTIVE:
      return todos.filter(t => !t.completed);
    case SHOW_ALL:
    default:
      return todos
  }
};

const mapStateToProps_TodoList = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
};

const mapDispatchToProps_TodoList = dispatch => {
  return {
    onTodoClick: (id) => {
      dispatch({ type: TOGGLE_TODO, index: id });
    }
  }
};

const VisibleTodoList = connect(
    mapStateToProps_TodoList,
    mapDispatchToProps_TodoList
)(TodoList);


const mapStateToProps_FilterLink = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
};

const mapDispatchToProps_FilterLink = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch({ type: SET_VISIBILITY_FILTER, filter: ownProps.filter })
    }
  }
};

const FilterLink = connect(
    mapStateToProps_FilterLink,
    mapDispatchToProps_FilterLink
)(Link);



// onTodoClick={(id) => {Alert.alert(id + " was clicked");}
// <TodoList todos={sampleState.todos} onTodoClick={(id) => {Alert.alert("you clicked " + id)}}/>

export default class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <View style={{flex: 1}}>
            <AddTodo/>
            <VisibleTodoList/>
            <Footer/>
          </View>
        </Provider>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  completed: {
    textDecorationLine: 'line-through'
  }
});
