import { FontAwesome6 } from '@expo/vector-icons';
import { Image, ImageProps } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface ImageWithFallbackProps extends ImageProps {
  iconSize?: number;
  iconColor?: string;
}

export const ImageWithFallback = ({source, style, iconSize = 26, iconColor = '#94A3B8', ...props}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  const uri = typeof source === 'object' && source !== null && 'uri' in source ? source.uri : null;

  const isValidUrl = Boolean(uri && typeof uri === 'string' && uri.trim().length > 0 && uri.startsWith('http'));

  if (!isValidUrl || hasError) {
    return (
      <View style={[style, styles.fallbackContainer]}>
        <FontAwesome6 name="image" size={iconSize} color={iconColor} />
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={style}
      // fallback jika server merespons 404, 500, Timeout, atau Network Failure
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
