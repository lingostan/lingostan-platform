import { SettingsIcon } from '@/components/icons/SettingsIcon';
import { BaseInput } from '@/components/ui/BaseInput';
import { BaseText } from '@/components/ui/BaseText';
import { IconButton } from '@/components/ui/IconButton';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUsersControllerGetProfile, useLanguageControllerGetAllLanguages } from '@/api/generated/lingoStanAPI';
import { useAuthControllerLogout } from '@/api/generated/lingoStanAPI';
import { clearTokens, getSelectedLanguage } from '@/utils/authUtils';

export default function Profile() {
  const router = useRouter()
  // Состояния для хранения данных пользователя
  const [isEditing, setIsEditing] = useState(false); // Режим редактирования
  const [name, setName] = useState(''); // ФИО
  const [gender, setGender] = useState(''); // Пол
  const [age, setAge] = useState(''); // Возраст
  const [email, setEmail] = useState('');
  const [selectedLanguageName, setSelectedLanguageName] = useState<string | null>(null);

  // Получаем отступы для безопасной области
  const insets = useSafeAreaInsets();
  
  // Получаем данные пользователя через API
  const { data: userProfileResponse, isLoading, error } = useUsersControllerGetProfile();
  
  // Получаем список языков для отображения выбранного языка
  const { data: languagesResponse } = useLanguageControllerGetAllLanguages(undefined);
  const languages = (languagesResponse?.data as any[]) || [];

  // Мутация для выхода
  const logoutMutation = useAuthControllerLogout({
    mutation: {
      onSuccess: async () => {
        try {
          await clearTokens();
          Alert.alert('Успех', 'Вы успешно вышли из аккаунта');
          router.replace('/sign-in'); // Переход на страницу авторизации
        } catch (error) {
          console.error('Ошибка при выходе:', error);
          Alert.alert('Ошибка', 'Что-то пошло не так');
        }
      },
      onError: async (error: any) => {
        console.error('Ошибка при выходе:', error);
        // Даже если API вернул ошибку, очищаем локальные токены
        try {
          await clearTokens();
          router.replace('/sign-in');
        } catch (clearError) {
          console.error('Ошибка при очистке токенов:', clearError);
        }
        Alert.alert('Выход выполнен', 'Вы вышли из аккаунта');
      },
    },
  });

  // Обновляем локальное состояние при получении данных
  useEffect(() => {
    if (userProfileResponse?.data) {
      const user = userProfileResponse.data as any;
      setName(user.name || '');
      setEmail(user.email || '');
      setGender(user.sex || '');
      setAge(user.age?.toString() || '');
    }
  }, [userProfileResponse]);

  // Получаем выбранный язык и его название
  useEffect(() => {
    const loadSelectedLanguage = async () => {
      const languageId = await getSelectedLanguage();
      if (languageId && languages.length > 0) {
        const language = languages.find((lang: any) => lang.id.toString() === languageId);
        if (language) {
          setSelectedLanguageName(language.name);
        }
      }
    };
    loadSelectedLanguage();
  }, [languages]);

  // Функция для сохранения изменений
  const handleSave = () => {
    if (!name || !gender || !age) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    setIsEditing(false);
    Alert.alert('Успех', 'Профиль успешно обновлен');
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error || !userProfileResponse?.data) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <BaseText variant="bodyBold" color="red">
          {'Не удалось загрузить профиль'}
        </BaseText>
      </SafeAreaView>
    );
  }

  const user = userProfileResponse.data as any;
  const userLanguages = user.languages || [];
  const primaryLanguage = userLanguages[0];


  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
            showsVerticalScrollIndicator={false} // Убирает вертикальную полосу
            showsHorizontalScrollIndicator={false} // Если нужен горизонтальный скролл>
          >
      <View style={styles.header}>
        <BaseText variant="subtitle" color="secondary" style={styles.title}>Профиль</BaseText>
        <SettingsIcon />
      </View>


      <View style={styles.infoAvatarContainer}>
        {user.avatarUrl ? (
          <Image
            style={styles.infoAvatar}
            resizeMode="cover"
            source={{ uri: user.avatarUrl.startsWith('http') || user.avatarUrl.startsWith('/') 
              ? (user.avatarUrl.startsWith('/') ? `${user.avatarUrl}` : user.avatarUrl)
              : user.avatarUrl }}
          />
        ) : (
          <Image
            style={styles.infoAvatar}
            resizeMode="cover"
            source={require('@/assets/images/avatar.png')}
          />
        )}
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoBody}>
          {
            !isEditing ?
            <>
              <BaseText variant='subtitle' style={styles.infoName}>{name}</BaseText>
              <BaseText variant='body' style={styles.infoEmail} color='secondary'>{email}</BaseText>
              {selectedLanguageName && (
                <BaseText variant='body' style={styles.infoLanguage} color='secondary'>
                  Выбранный язык: {selectedLanguageName}
                </BaseText>
              )}
              {primaryLanguage && (
                <BaseText variant='body' style={styles.infoLanguage} color='secondary'>
                  Изучаю: {primaryLanguage.language?.name || 'Неизвестный язык'} ({Math.round(primaryLanguage.progress || 0)}%)
                </BaseText>
              )}
              {user.createdAt && (
                <BaseText variant='caption' style={styles.infoDate} color='secondary'>
                  Регистрация: {new Date(user.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                </BaseText>
              )}
              {primaryLanguage && (
                <>
                  <BaseText variant='body' style={styles.infoLanguage} color='secondary'>
                    Уровень: {primaryLanguage.level || 0}
                  </BaseText>
                  <BaseText variant='body' style={styles.infoLanguage} color='secondary'>
                    Серия дней: {primaryLanguage.streak || 0}
                  </BaseText>
                  <BaseText variant='body' style={styles.infoLanguage} color='secondary'>
                    Очки: {primaryLanguage.totalPoints || 0}
                  </BaseText>
                </>
              )}
              <BaseText variant='bodyBold' style={styles.infoFriends}>0 друзей</BaseText>
            </> :
            <>
                {/* Отображение ФИО */}
              <BaseInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              {/* Отображение пола */}
              <BaseInput
                  style={styles.input}
                  value={gender}
                  onChangeText={setGender}
                />
              {/* Отображение возраста */}
              <BaseInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
              />
            </>
          }
          
        </View>
        <View style={styles.infoFlag}>

        </View>
      </View>
      
      {/* Кнопки управления режимом редактирования */}
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <PrimaryButton variant='blue' title="Сохранить" onPress={handleSave} />
        ) : (
          <PrimaryButton variant='blue' title="Редактировать" onPress={() => setIsEditing(true)} />
        )}
      </View>

      {/* СТАТИСТИКА */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <BaseText color="main" variant="headingM">Статистика</BaseText>
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.statsGrid}>
            <View style={styles.statsGridItem}>
              <View style={styles.box}>
                <View style={styles.stats}>
                  <Image style={styles.statsImage} resizeMode='contain' source={require('@/assets/images/icons/hexagon.svg')} /> 
                  <View style={styles.statsBody}>
                    <View style={styles.statsTitle}>
                      <BaseText variant='bodyBold'>0</BaseText>
                    </View>
                    <View style={styles.statsDesc}>
                      <BaseText variant='body'>Ударный режим</BaseText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.statsGridItem}>
              <View style={styles.box}>
                <View style={styles.stats}>
                  <Image style={styles.statsImage} resizeMode='contain' source={require('@/assets/images/icons/heart.svg')} /> 
                  <View style={styles.statsBody}>
                    <View style={styles.statsTitle}>
                      <BaseText variant='bodyBold'>{primaryLanguage?.totalPoints || 0}</BaseText>
                    </View>
                    <View style={styles.statsDesc}>
                      <BaseText variant='body'>Очки опыта</BaseText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.statsGridItem}>
              <View style={styles.box}>
                <View style={styles.stats}>
                  <Image style={styles.statsImage} resizeMode='contain' source={require('@/assets/images/icons/clock.svg')} /> 
                  <View style={styles.statsBody}>
                    <View style={styles.statsTitle}>
                      <BaseText variant='bodyBold'>0</BaseText>
                    </View>
                    <View style={styles.statsDesc}>
                      <BaseText variant='body'>Текущая лига</BaseText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.statsGridItem}>
              <View style={styles.box}>
                <View style={styles.stats}>
                  <Image style={styles.statsImage} resizeMode='contain' source={require('@/assets/images/icons/lightning.svg')} /> 
                  <View style={styles.statsBody}>
                    <View style={styles.statsTitle}>
                      <BaseText variant='bodyBold'>0</BaseText>
                    </View>
                    <View style={styles.statsDesc}>
                      <BaseText variant='body'>ТОП 3</BaseText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>


      {/* ДРУЗЬЯ */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <BaseText color="main" variant="headingM">Друзья</BaseText>
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.box}>
            <Image style={styles.friendsBg} resizeMode='contain' source={require('@/assets/images/friends.svg')} />
            <BaseText style={styles.friendsDesc} color="secondary" variant="subtitle">Учиться вместе намного интереснее и эффективнее</BaseText>
          </View>
          
          <View style={styles.inviteContainer}>
            <View style={styles.box}>
              <View style={styles.invite}>
                <Image style={styles.inviteImage} source={require('@/assets/images/owl.svg')} />
                <View style={styles.inviteBody}>
                  <View style={styles.inviteTitle}>
                    <BaseText variant='bodyBold' color="main">Пригласить друзей</BaseText>
                  </View>
                  <View style={styles.inviteDescription}>
                    <BaseText variant='body' color='secondary'>
                      Расскажите друзьям о бесплатных игровых уроках иностранного на Duolingo!
                    </BaseText>
                  </View>
                </View>
              </View>
              <View style={styles.inviteButtonContainer}>
                <PrimaryButton variant='blue' title="Пригласить друзей" onPress={() => {}} fluid={true}/>
              </View>
            </View>
          </View>
          
        </View>
      </View>

      {/* ДОСТИЖЕНИЯ */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <BaseText color="main" variant="headingM">Достижения</BaseText>
        </View>
        
        <View style={[styles.sectionContent, styles.achivementsList]}>
          <View style={styles.achivementsListItem}>
              <View style={styles.achivementImage}>
                <Image source={require('@/assets/images/achivements/enthusiast.svg')} style={styles.flag} />
              </View>
              <View style={styles.achivementBody}>
                <View style={styles.achivementHeader}>
                  <View><BaseText variant='bodyBold' color="main">Энтузиаст</BaseText></View>
                  <View><BaseText variant='body' color='secondary'>2/3</BaseText></View>
                </View>
                <View>
                  <Progress.Bar progress={0.7} width={150} height={10} color="#6CD96C" unfilledColor="#E0E0E0" borderColor="transparent" />
                </View>
                <View><BaseText variant='body' color='secondary'>Удержите ударный режим 3 дня</BaseText></View>
              </View>
          </View>
          <View style={styles.achivementsListItem}>
              <View style={styles.achivementImage}>
                <Image source={require('@/assets/images/achivements/sage.svg')} style={styles.flag} />
              </View>
              <View style={styles.achivementBody}>
                <View style={styles.achivementHeader}>
                  <View><BaseText variant='bodyBold' color="main">Мудрец</BaseText></View>
                  <View><BaseText variant='body' color='secondary'>1/3</BaseText></View>
                </View>
                <View>
                  <Progress.Bar progress={0.3} width={150} height={10} color="#6CD96C" unfilledColor="#E0E0E0" borderColor="transparent" />
                </View>
                <View><BaseText variant='body' color='secondary'>Заработайте 100 очков опыта</BaseText></View>
              </View>
          </View>
          <View style={[styles.achivementsListItem, styles.achivementsListItemLast]}>
              <View style={styles.achivementImage}>
                <Image source={require('@/assets/images/achivements/erudite.svg')} style={styles.flag} />
              </View>
              <View style={styles.achivementBody}>
                <View style={styles.achivementHeader}>
                  <View><BaseText variant='bodyBold' color="main">Эрудит</BaseText></View>
                  <View><BaseText variant='body' color='secondary'>0/3</BaseText></View>
                </View>
                <View>
                  <Progress.Bar progress={0.0} width={150} height={10} color="#6CD96C" unfilledColor="#E0E0E0" borderColor="transparent" />
                </View>
                <View style={styles.achivementDesc}><BaseText variant='body' color='secondary'>Изучите 50 новых слов в рамках одного курса</BaseText></View>
              </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton 
          mode="outline" 
          variant='red' 
          title={logoutMutation.isPending ? "Выход..." : "Выйти"} 
          onPress={handleLogout}
          disabled={logoutMutation.isPending}
        />
      </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// Стили
const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    padding: 10,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    marginBottom: 20
  },

  title: {
    alignSelf: 'center',
    alignContent: 'center',
    fontWeight: 'bold',
    color: '#ccc',
  },

  infoContainer: {
    flexDirection: 'row',
  },

  infoBody: {
    flexDirection: 'column',
    gap: 2
  },

  infoName: {
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },

  infoAge: {

  },

  infoEmail: {

  },

  infoDate: {

  },
  infoLanguage: {
    marginTop: 4,
  },

  infoFriends: {
    color:' rgb(33, 150, 243)'
  },

  infoFlag: {
    alignContent: 'center'
  },

  infoAvatarContainer: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    overflow: 'hidden', // важно — чтобы скругление применялось ко всей картинке
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // опционально: фон на случай, если изображение не загрузилось
    marginBottom: 20
  },
  infoAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },

  friends: {

  },
  friendsBg: {
    width: '100%',
  },
  friendsDesc: {
    textAlign: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'center'
  },
  statsGrid: {
    flexDirection: 'row',
    gap: '16px',
    flexWrap: 'wrap'
  },
  statsGridItem: {
    flexBasis: '47%',
    flexGrow: 0,
    flexShrink: 0
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start'
  },
  statsImage: {
    width: 16,
    height: 20,
  },
  statsBody: {

  },
  statsTitle: {
    alignItems: 'flex-start',
  },
  statsDesc: {

  },
  box: {
    padding: 16,
    borderRadius: 16,
    borderColor: '#ccc',
    borderWidth: 2,
    flex: 1
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  input: {
    fontSize: 16,
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#6CD96C', // Ярко-зеленый цвет
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25, // Закругленные углы
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    elevation: 5, // Для Android
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FFC107', // Ярко-желтый цвет
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    elevation: 5, // Для Android
    marginBottom: 20,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4D4D', // Ярко-красный цвет
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    elevation: 5, // Для Android
  },
  iconButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  avatar: {
    flexGrow: 1,
    borderRadius: 16,
    marginBottom: 20,
  },
  section: {
    flexDirection: 'column',
    marginBottom: 20
  },
  sectionTitle: {
    marginBottom: 10
  },
  sectionContent: {

  },
  achivementsList: {
    gap: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ccc',
    width: '100%'
  },
  achivementsListItem: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    width: '100%',
  },
  achivementsListItemLast: {
    borderBottomWidth: 0,
  },
  achivementImage: {
    padding: 20,
    paddingRight: 0,
  },
  achivementBody: {
    padding: 20,
    flex: 1,
    boxSizing: 'border-box',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%'
  },
  achivementHeader: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  inviteContainer: {
    marginTop: 20,
    marginBottom: 20,
  },

  invite: {
    flexDirection: 'row',
    gap: 12
  },
  inviteImage: {
    width: 56,
    height: 50,
    flexShrink: 0
  },
  inviteBody: {
    flexDirection: 'column',
    gap: 12,
    flex: 1,
    width: '100%'
  },
  inviteTitle: {
    // fontSize применяется к тексту внутри, а не к View
  },

  inviteDescription: {
    flex: 1,
    width: '100%'
  }, 

  inviteButtonContainer: {

  },
  flag: {
    width: 48,
    height: 48,
  },
  achivementDesc: {
    flex: 1,
  },
});
