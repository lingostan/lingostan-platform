import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface AvatarUploaderProps {
  onImageSelect: (uri: string, type: string, ext: string) => void;
  initialImageUri?: string; // опционально: уже загруженное изображение
}

export default function AvatarUploader({
  onImageSelect,
  initialImageUri,
}: AvatarUploaderProps) {
  const [imageUri, setImageUri] = useState<string | null>(
    initialImageUri || null
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Нужно разрешение на доступ к фото');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const type = result.assets[0].mimeType || '';
      const ext = type?.split('/')[1];

      setImageUri(uri);
      onImageSelect(uri, type, ext);
    }
  };

  return (
    <TouchableOpacity
      style={styles.infoAvatarContainer}
      onPress={pickImage}
      activeOpacity={0.8}
    >
      {/* Фоновая заливка */}
      <View style={StyleSheet.absoluteFillObject}>
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: '#f0f0f0' },
          ]}
        />

        {/* Изображение, если есть */}
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.infoAvatar}
            resizeMode="cover"
          />
        ) : (
          // Статическая иконка по умолчанию (опционально)
          <Image
            source={require('@/assets/images/avatar.png')}
            style={styles.infoAvatar}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Прозрачный оверлей для клика (не обязателен, но улучшает UX) */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'transparent' },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  infoAvatarContainer: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // pointerEvents: 'auto' по умолчанию — кликабельно
  },
  infoAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
});
