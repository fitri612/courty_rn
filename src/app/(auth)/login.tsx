import { getApiErrorMessage } from '@/api/client';
import { useLogin } from '@/api/hooks/useAuth';
import { showToast } from '@/components/ui/toast';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});
type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const login = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    setServerError(null);
    login.mutate(values, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast('Login successful', 'success');
        router.replace('/(tabs)');
      },
      onError: (err) => {
        showToast('Login failed', 'error');
        setServerError(getApiErrorMessage(err, 'Login failed'));
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: 'https://ik.imagekit.io/newfemme/courty_login.png' }}
            style={styles.illustration}
          />
          <Text style={styles.title}>Welcome to Courty</Text>
          <Text style={styles.subtitle}>
            Find and book courts for all your favorite sports with friends.
          </Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
              />

              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#64748B"
                />
              </Pressable>
            </View>
          )}
        />

        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        {serverError && <Text style={styles.error}>{serverError}</Text>}

        <Pressable
          style={styles.button}
          disabled={login.isPending}
          onPress={handleSubmit(onSubmit)}
        >
          {login.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log in</Text>
          )}
        </Pressable>

        <Link href="/(auth)/register" style={styles.link}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkHighlight}>Sign up</Text>
          </Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: { marginBottom: 24 },
  illustration: { width: 200, height: 200, alignSelf: 'center', marginBottom: 20, resizeMode: 'contain' },
  title: { fontFamily: 'Poppins-Bold', fontSize: 28, marginBottom: 4 },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#666' },
  input: {
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    fontSize: 12,
  },
  error: { fontFamily: 'Poppins-Regular', color: '#e11d48', marginBottom: 8, fontSize: 11 },
  button: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { fontFamily: 'Poppins-Bold', color: '#fff', fontSize: 16 },
  link: {
    marginTop: 20,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  linkHighlight: {
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
    textDecorationLine: 'underline',
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 8,
  },

  passwordInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    paddingRight: 45,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
  },

  eyeButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});