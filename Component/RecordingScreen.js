import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  Platform
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { FontAwesome } from '@expo/vector-icons';

const RecordingScreen = () => {
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState(null);
  const [selectedRecordingId, setSelectedRecordingId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('Ready to record');
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (recording) {
        stopRecording();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Start recording function
  const startRecording = async () => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        setStatus('Permission to record was denied');
        return;
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const newRecording = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      
      setRecording(newRecording.recording);
      setIsRecording(true);
      setStatus('Recording...');
    } catch (err) {
      console.error('Failed to start recording', err);
      setStatus('Failed to start recording');
    }
  };

  // Stop recording function
  const stopRecording = async () => {
    try {
      if (!recording) return;

      // Stop the recording
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      // Get recording info
      const info = await FileSystem.getInfoAsync(uri);
      
      // Create a new recording object
      const newRecording = {
        id: Date.now().toString(),
        uri: uri,
        name: `Recording ${recordings.length + 1}`,
        date: new Date().toLocaleString(),
        duration: 0, // This would be calculated from the audio file
        size: info.size,
      };

      // Add to recordings list
      setRecordings([...recordings, newRecording]);
      
      // Reset state
      setRecording(null);
      setIsRecording(false);
      setStatus('Recording saved');
      setSelectedRecordingId(newRecording.id);
      
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch (err) {
      console.error('Failed to stop recording', err);
      setStatus('Failed to stop recording');
    }
  };

  // Play recording
  const playRecording = async (recordingId) => {
    try {
      // If something is playing, stop it
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Find selected recording
      const selectedRecording = recordings.find(r => r.id === recordingId);
      if (!selectedRecording) return;
      
      // Load and play the audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: selectedRecording.uri },
        { shouldPlay: true }
      );
      
      // Set state
      setSound(newSound);
      setIsPlaying(true);
      setSelectedRecordingId(recordingId);
      setStatus('Playing...');
      
      // When finished playing
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setStatus('Ready');
        }
      });
    } catch (err) {
      console.error('Failed to play recording', err);
      setStatus('Failed to play recording');
    }
  };

  // Pause recording
  const pauseRecording = async () => {
    try {
      if (!sound) return;
      
      await sound.pauseAsync();
      setIsPlaying(false);
      setStatus('Paused');
    } catch (err) {
      console.error('Failed to pause', err);
    }
  };

  // Toggle play/pause
  const togglePlayback = async () => {
    if (isPlaying) {
      await pauseRecording();
    } else if (selectedRecordingId) {
      await playRecording(selectedRecordingId);
    }
  };

  // Delete recording
  const deleteRecording = async (recordingId) => {
    try {
      // If the recording is currently playing, stop it
      if (sound && selectedRecordingId === recordingId) {
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }
      
      // Find recording object
      const recordingToDelete = recordings.find(r => r.id === recordingId);
      if (recordingToDelete) {
        // Delete file
        await FileSystem.deleteAsync(recordingToDelete.uri).catch(e => console.log('File may have already been deleted'));
        
        // Update state
        setRecordings(recordings.filter(r => r.id !== recordingId));
        
        if (selectedRecordingId === recordingId) {
          setSelectedRecordingId(null);
          setStatus('Recording deleted');
        }
      }
    } catch (err) {
      console.error('Failed to delete recording', err);
      setStatus('Failed to delete recording');
    }
  };

  // Confirmation dialog for deletion
  const confirmDelete = (recordingId) => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRecording(recordingId) }
      ]
    );
  };

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={[
      styles.recordingItem, 
      selectedRecordingId === item.id && styles.selectedRecording
    ]}>
      <TouchableOpacity 
        style={styles.recordingInfo}
        onPress={() => setSelectedRecordingId(item.id)}
      >
        <Text style={styles.recordingName}>{item.name}</Text>
        <Text style={styles.recordingDate}>{item.date}</Text>
      </TouchableOpacity>
      
      <View style={styles.recordingActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => playRecording(item.id)}
        >
          <FontAwesome name="play" size={18} color="#4CAF50" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => confirmDelete(item.id)}
        >
          <FontAwesome name="trash" size={18} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Audio Recorder</Text>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isRecording ? 
            <Text style={styles.recordingStatusText}>● Recording...</Text> : 
            status
          }
        </Text>
      </View>
      
      <View style={styles.controlsContainer}>
        {!isRecording ? (
          <TouchableOpacity 
            style={[styles.button, styles.recordButton]}
            onPress={startRecording}
          >
            <FontAwesome name="microphone" size={24} color="white" />
            <Text style={styles.buttonText}>Start Recording</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.stopButton]}
            onPress={stopRecording}
          >
            <FontAwesome name="stop" size={24} color="white" />
            <Text style={styles.buttonText}>Stop Recording</Text>
          </TouchableOpacity>
        )}

        {selectedRecordingId && (
          <View style={styles.playbackControls}>
            <TouchableOpacity 
              style={[styles.button, styles.playButton]}
              onPress={togglePlayback}
              disabled={!selectedRecordingId}
            >
              <FontAwesome name={isPlaying ? "pause" : "play"} size={24} color="white" />
              <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]}
              onPress={() => confirmDelete(selectedRecordingId)}
              disabled={!selectedRecordingId}
            >
              <FontAwesome name="trash" size={24} color="white" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Your Recordings</Text>
        {recordings.length === 0 ? (
          <Text style={styles.emptyText}>No recordings yet</Text>
        ) : (
          <FlatList
            data={recordings}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  statusText: {
    fontSize: 16,
    color: '#666666',
  },
  recordingStatusText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  controlsContainer: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  recordButton: {
    backgroundColor: '#f44336',
  },
  stopButton: {
    backgroundColor: '#555555',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ff9800',
    flex: 1,
    marginLeft: 8,
  },
  playbackControls: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#dddddd',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  list: {
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888888',
    marginTop: 32,
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedRecording: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  recordingDate: {
    fontSize: 12,
    color: '#888888',
  },
  recordingActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default RecordingScreen;