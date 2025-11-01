import { api } from '@/services/https';
import { useLangStore } from '@/store/useLangStore';
import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Lang, UserLang } from '@/types/lang/model';
import { router } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';

export default function Languages() {
  const { setData, data } = useLangStore();
  const { setActiveLang } = useUserStore();

  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLanguage = (id: number) => {
    setSelectedLanguages((prev) =>
      prev.includes(id) ? prev.filter((langId) => langId !== id) : [...prev, id]
    );
  };

  const fetchLangs = async () => {
    const { data } = await api.get('/languages');

    setData(data);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);

      const promises = selectedLanguages.map((id) =>
        api.post<UserLang>(`/languages/${id}/start`)
      );

      const [{ data }] = await Promise.all(promises);

      setActiveLang(data.language);

      router.replace('/dashboard');
    } catch (error) {
      console.error('Ошибка при добавлении языков:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLangs();
  }, []);

  const renderLanguage = ({ item }: { item: Lang }) => {
    const isChecked = selectedLanguages.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.languageItem}
        onPress={() => toggleLanguage(item.id)} // ← обработчик на всю строку
        activeOpacity={0.7}
      >
        <Checkbox
          value={isChecked}
          color={isChecked ? '#4630EB' : undefined}
          style={styles.checkbox}
        />
        <Text style={styles.languageName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите языки для изучения</Text>

      <FlatList
        data={data}
        renderItem={renderLanguage}
        keyExtractor={(item) => item.code}
        style={styles.list}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleConfirm}
        disabled={!selectedLanguages.length}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Сохранение...' : 'Подтвердить выбор'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 23,
  },
  list: {
    flex: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    marginRight: 12,
    width: 24,
    height: 24,
  },
  languageName: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4630EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
