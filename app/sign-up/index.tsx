import { useRouter } from 'expo-router';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import { BaseInput } from '@/components/ui/BaseInput';
import { BasePicker } from '@/components/ui/BasePicker';
import { BaseText } from '@/components/ui/BaseText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { api } from '@/services/https';
import { RegistraionParams } from '@/types/auth/model';
import { saveTokens } from '@/utils/secure';

export default function SignUp() {
  const { control, handleSubmit } = useForm<RegistraionParams>({
    defaultValues: { sex: 'male' },
  });

  const router = useRouter();

  const onSubmit = async (data: RegistraionParams) => {
    const { data: payload } = await api.post<{
      access_token: string;
      refresh_token: string;
    }>('/auth/register', data);

    if (Platform.OS !== 'web') {
      await saveTokens(payload.access_token, payload.refresh_token);
    } else {
      window.localStorage.setItem('access_token', payload.access_token);
    }

    router.replace('/sign-in');
  };

  return (
    <View style={styles.container}>
      <BaseText variant="headingM" style={styles.title}>
        Регистрация
      </BaseText>

      <Controller
        control={control}
        name="name"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <BaseInput
            style={styles.input}
            placeholder="Имя"
            onChangeText={onChange}
            value={value || ''}
          />
        )}
      />

      <View style={styles.pickerContainer}>
        <Controller
          control={control}
          name="sex"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <BasePicker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
              items={[
                { label: 'Мужской', value: 'male' },
                { label: 'Женский', value: 'female' },
              ]}
              placeholder="Выберите пол"
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="age"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <BaseInput
            style={styles.input}
            placeholder="Возраст"
            onChangeText={onChange}
            value={String(value || '')}
            keyboardType="phone-pad"
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        rules={{
          required: true,
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Неверный email',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <BaseInput
            style={styles.input}
            placeholder="Email"
            onChangeText={onChange}
            value={value || ''}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <BaseInput
            style={styles.input}
            placeholder="Пароль"
            onChangeText={onChange}
            value={value || ''}
            secureTextEntry
          />
        )}
      />

      <PrimaryButton
        title="Зарегистрироваться"
        onPress={handleSubmit(onSubmit)}
        variant="green"
        fluid={false}
      />

      <PrimaryButton
        size="small"
        title="Уже есть аккаунт? Войдите"
        mode="transparent"
        variant="blue"
        onPress={() => router.push('/sign-in')}
      />
    </View>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});
