import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInput from '../Components/Custominput';

const ProjectSelectionScreen = ({ navigation, route }) => {
  const [projects, setProjects] = useState([]); // Initialize with an empty array
  const [newProjectName, setNewProjectName] = useState('');

  // Load projects from AsyncStorage when the screen loads
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const savedProjects = await AsyncStorage.getItem('projects');
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects)); // Parse and set saved projects
        } else {
          // If no saved projects, initialize with default projects
          setProjects(['Project A', 'Project B']);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };

    loadProjects();
  }, []);

  // Save projects to AsyncStorage whenever they are updated
  useEffect(() => {
    const saveProjects = async () => {
      try {
        await AsyncStorage.setItem('projects', JSON.stringify(projects));
      } catch (error) {
        console.error('Failed to save projects:', error);
      }
    };

    saveProjects();
  }, [projects]);

  const handleSelectProject = (project) => {
    // Pass the selected project back to the HomeScreen
    route.params.onProjectSelect(project);
    navigation.goBack();
  };

  const handleAddProject = () => {
    if (!newProjectName.trim()) {
      Alert.alert('Error', 'Project name cannot be empty');
      return;
    }
    setProjects([...projects, newProjectName]); // Add the new project to the list
    setNewProjectName('');
    Alert.alert('Success', 'Project added successfully!');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => handleSelectProject(item)}
    >
      <Text style={styles.projectText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select or Create a Project</Text>
      <FlatList
        data={projects}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <View style={styles.addProjectContainer}>
        <CustomInput
          placeholder="Enter new project name"
          style={styles.input}
          value={newProjectName}
          onChangeText={setNewProjectName}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    marginBottom: 20,
  },
  projectItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  projectText: {
    fontSize: 18,
    color: '#333',
  },
  addProjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent:'center'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#03CF65',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:16
  },
});

export default ProjectSelectionScreen;