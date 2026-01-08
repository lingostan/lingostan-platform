import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseText } from '@/components/ui/BaseText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { BaseCheckbox } from '@/components/ui/BaseCheckbox';
import { useLanguageControllerGetAllLanguages, useUsersControllerGetProfile, useUsersControllerUpdate } from '@/api/generated/lingoStanAPI';
import { saveSelectedLanguageData } from '@/utils/authUtils';
import type { LanguageResponseDto } from '@/api/generated/models';

export default function SelectLanguage() {
  const [selectedLanguage, setSelectedLanguage] = useState<number | null>(null);
  const router = useRouter();

  const { data: languagesResponse, isLoading, error } = useLanguageControllerGetAllLanguages();
  
  // Получаем профиль пользователя для получения userId
  const { data: profileResponse } = useUsersControllerGetProfile();

  // API возвращает массив языков напрямую
  const languages = (languagesResponse?.data as LanguageResponseDto[]) || [];
  
  // Мутация для обновления пользователя
  const updateUserMutation = useUsersControllerUpdate({
    mutation: {
      onSuccess: async () => {
        // После успешного обновления сохраняем язык локально и переходим на dashboard
        const selectedLanguageData = languages.find(lang => lang.id === selectedLanguage);
        if (selectedLanguageData) {
          await saveSelectedLanguageData(selectedLanguageData);
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/(tabs)/dashboard');
        }
      },
      onError: (error: any) => {
        console.error('Ошибка при обновлении пользователя:', error);
        Alert.alert('Ошибка', 'Не удалось сохранить выбранный язык');
      },
    },
  });

  const handleLanguageSelect = (language: LanguageResponseDto) => {
    // Если язык уже выбран, снимаем выбор, иначе выбираем новый
    if (selectedLanguage === language.id) {
      setSelectedLanguage(null);
    } else {
      setSelectedLanguage(language.id);
    }
  };

  const handleContinue = async () => {
    // Проверяем, был ли выбран язык
    if (!selectedLanguage) {
      Alert.alert('Ошибка', 'Выберите язык для обучения');
      return;
    }

    // Проверяем наличие userId
    if (!profileResponse?.data?.id) {
      Alert.alert('Ошибка', 'Не удалось получить данные пользователя');
      return;
    }

    // Находим выбранный язык в списке
    const selectedLanguageData = languages.find(lang => lang.id === selectedLanguage);
    if (!selectedLanguageData) {
      Alert.alert('Ошибка', 'Выбранный язык не найден');
      return;
    }

    try {
      // Отправляем запрос PUT /api/users/{userId} с выбранным языком в поле languages
      // Расширяем UpdateUserDto, так как в типе нет поля languages, но API его принимает
      updateUserMutation.mutate({
        id: profileResponse.data.id,
        data: {
          languages: [selectedLanguageData.id], // Отправляем массив с ID выбранного языка
        } as any, // Используем as any, так как UpdateUserDto не содержит languages в типе
      });
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить выбранный язык');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6CD96C" />
          <BaseText variant="bodyM" color="secondary" style={styles.loadingText}>
            Загрузка языков...
          </BaseText>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <BaseText variant="headingM" color="main" style={styles.errorTitle}>
            Ошибка загрузки
          </BaseText>
          <BaseText variant="bodyM" color="secondary" style={styles.errorText}>
            Не удалось загрузить список языков. Попробуйте позже.
          </BaseText>
          <PrimaryButton
            title="Повторить"
            onPress={() => router.replace('/select-language')}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BaseText variant="headingL" color="main" style={styles.title}>
          Выберите язык для обучения
        </BaseText>
        <BaseText variant="bodyM" color="secondary" style={styles.subtitle}>
          Выберите язык, который вы хотите изучать
        </BaseText>

        <View style={styles.languagesContainer}>
          {languages
            .filter((language) => language.isActive)
            .map((language) => (
              <BaseCheckbox
                key={language.id}
                checked={selectedLanguage === language.id}
                onPress={() => handleLanguageSelect(language)}
                label={language.name}
              />
            ))}
        </View>

        <PrimaryButton
          title={updateUserMutation.isPending ? "Сохранение..." : "Продолжить"}
          onPress={handleContinue}
          disabled={!selectedLanguage || updateUserMutation.isPending}
          style={styles.continueButton}
          fluid
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  languagesContainer: {
    marginBottom: 32,
  },
  continueButton: {
    marginTop: 'auto',
    minHeight: 56,
  },
});

