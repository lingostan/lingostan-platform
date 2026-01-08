import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Image, ImageSourcePropType, StyleSheet, ActivityIndicator, View } from 'react-native';

interface CachedImageProps {
  source: ImageSourcePropType | { uri: string };
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  onPress?: () => void;
}

export const CachedImage: React.FC<CachedImageProps> = ({
  source,
  style,
  resizeMode = 'cover',
  onPress,
}): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const previousUriRef = useRef<string | null>(null);

  // Извлекаем URI из source для сравнения
  const sourceUri = typeof source === 'object' && source !== null && 'uri' in source ? source.uri : null;
  
  // Мемоизируем URI из source, чтобы избежать пересоздания объекта
  const uri = useMemo(() => sourceUri, [sourceUri]);

  // Сбрасываем состояние загрузки только если URI изменился
  useEffect(() => {
    if (uri && uri !== previousUriRef.current) {
      previousUriRef.current = uri;
      setIsLoading(true);
      setHasError(false);
    } else if (!uri) {
      previousUriRef.current = null;
    }
  }, [uri]);

  // Мемоизируем нормализованный source объект на основе URI
  const normalizedSource = useMemo(() => {
    if (uri) {
      return { uri };
    }
    return source;
  }, [uri, source]);

  return (
    <View style={style}>
      {isLoading && !hasError && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="#6CD96C" />
        </View>
      )}
      <Image
        source={normalizedSource}
        style={style}
        resizeMode={resizeMode}
        onLoadStart={() => {
          // Устанавливаем loading только если URI действительно изменился
          if (uri !== previousUriRef.current) {
            setIsLoading(true);
            setHasError(false);
          }
        }}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </View>
  ) as React.ReactElement;
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

