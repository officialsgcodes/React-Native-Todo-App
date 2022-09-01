import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function App() {
  const intialState = {
    id: 0,
    title: '',
    description: '',
    completed: false,
  };

  const [todo, setTodo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTodo, setNewTodo] = useState(intialState);

  const getTodos = async () => {
    const todos = await AsyncStorage.getItem('todo');
    setTodo(JSON.parse(todos) ? JSON.parse(todos) : []);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleChange = (title, value) =>
    setNewTodo({...newTodo, [title]: value});

  const clear = () => setNewTodo(intialState);

  const addTodo = () => {
    if (!newTodo.title || !newTodo.description) {
      alert('Please enter all the values.');
      return;
    }

    newTodo.id = todo.length + 1;
    const updatedTodo = [newTodo, ...todo];
    setTodo(updatedTodo);
    AsyncStorage.setItem('todo', JSON.stringify(updatedTodo));
    clear();
    setShowModal(false);
  };

  const updateTodo = item => {
    const itemToBeUpdated = todo.filter(todoItem => todoItem.id == item.id);
    itemToBeUpdated[0].completed = !itemToBeUpdated[0].completed;

    const remainingTodos = todo.filter(todoItem => todoItem.id != item.id);
    const updatedTodo = [...itemToBeUpdated, ...remainingTodos];

    setTodo(updatedTodo);
    AsyncStorage.setItem('todo', JSON.stringify(updatedTodo));
  };

  const displayTodo = item => (
    <TouchableOpacity
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingVertical: 16,
      }}
      onPress={() =>
        Alert.alert(`${item.title}`, `${item.description}`, [
          {
            text: item.completed ? 'Mark InProgress' : 'Mark Completed',
            onPress: () => updateTodo(item),
          },
          {
            text: 'Ok',
            style: 'cancel',
          },
        ])
      }>
      <BouncyCheckbox
        isChecked={item.completed ? true : false}
        fillColor="blue"
        onPress={() => updateTodo(item)}
      />
      <Text
        style={{
          color: '#000',
          width: '90%',
          fontSize: 16,
          textDecorationLine: item.completed ? 'line-through' : 'none',
        }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{paddingHorizontal: 20}}>
      <View
        style={{
          paddingVertical: 20,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={{color: '#000', fontWeight: 'bold', fontSize: 28}}>
            Hey, S.G. 👋
          </Text>
          <Text style={{fontSize: 16}}>
            {todo.length} {todo.length == 1 ? 'task' : 'tasks'} for you
          </Text>
        </View>
        <Image
          source={require('./assets/SGCodes.jpg')}
          style={{height: 50, width: 50, borderRadius: 10}}
        />
      </View>

      <Text style={{color: '#000', fontSize: 28, fontWeight: 'bold'}}>
        To do 📄
      </Text>
      <ScrollView>
        <View style={{height: 250}}>
          {todo.map(item => (!item.completed ? displayTodo(item) : null))}
        </View>
      </ScrollView>

      <Text style={{color: '#000', fontSize: 28, fontWeight: 'bold'}}>
        Completed ✅
      </Text>
      <ScrollView>
        <View style={{height: 250}}>
          {todo.map(item => (item.completed ? displayTodo(item) : null))}
        </View>
      </ScrollView>

      <View style={{width: '100%', alignItems: 'flex-end'}}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            backgroundColor: 'lightblue',
            borderRadius: 100,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: 60,
          }}>
          <Text style={{fontSize: 46}}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View style={{paddingHorizontal: 20}}>
          <View
            style={{
              paddingVertical: 20,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{color: '#000', fontWeight: 'bold', fontSize: 28}}>
                Hey, S.G. 👋
              </Text>
              <Text style={{fontSize: 16}}>
                {todo.length} {todo.length == 1 ? 'task' : 'tasks'} for you
              </Text>
            </View>
            <Image
              source={require('./assets/SGCodes.jpg')}
              style={{height: 50, width: 50, borderRadius: 10}}
            />
          </View>

          <Text
            style={{
              color: '#000',
              fontSize: 28,
              fontWeight: 'bold',
              marginVertical: 10,
            }}>
            Add a Todo Item
          </Text>
          <TextInput
            placeholder="Title"
            value={newTodo.title}
            onChangeText={title => handleChange('title', title)}
            style={{
              backgroundColor: 'rgb(240, 240, 240)',
              paddingHorizontal: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}
          />
          <TextInput
            placeholder="Description"
            value={newTodo.description}
            onChangeText={desc => handleChange('description', desc)}
            style={{
              backgroundColor: 'rgb(240, 240, 240)',
              paddingHorizontal: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}
            multiline={true}
            numberOfLines={6}
          />

          <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
            <TouchableOpacity
              onPress={addTodo}
              style={{
                backgroundColor: 'blue',
                width: 100,
                borderRadius: 10,
                alignItems: 'center',
                padding: 10,
              }}>
              <Text style={{fontSize: 22, color: '#fff'}}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
