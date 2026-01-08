import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { AVPlaybackSource } from 'expo-av';

interface CachedAudioButtonProps {
  audioUri: string | AVPlaybackSource | null | undefined;
  label?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const CachedAudioButton: React.FC<CachedAudioButtonProps> = ({
  audioUri,
  label,
  onPress,
  style,
}) => {
  const audioPlayer = useAudioPlayer();

  const handlePress = async () => {
    if (!audioUri) return;
    
    const source: AVPlaybackSource = typeof audioUri === 'string' 
      ? { uri: audioUri } 
      : audioUri;
    
    await audioPlayer.play(source);
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={!audioUri}
    >
      <Feather name="volume-2" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#58cc02',
    borderRadius: 12,
    alignSelf: 'center',
  },
});

