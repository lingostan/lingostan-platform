# Директория для аудиофайлов викторин

## Описание
Эта директория предназначена для хранения всех аудиофайлов, используемых в различных типах викторин приложения.

## Структура
```
assets/audio/quiz/
├── README.md (этот файл)
├── audio-quiz-1.mp3
├── audio-quiz-2.mp3
├── image-quiz-1.mp3
├── image-quiz-2.mp3
└── ... (другие аудиофайлы)
```

## Типы викторин
- **Audio Quiz** - аудиофайлы для викторин с прослушиванием
- **Image Quiz** - аудиофайлы для викторин с изображениями
- **Mixed Quiz** - аудиофайлы для комбинированных викторин

## Рекомендации по именованию
- Используйте понятные имена файлов
- Включайте тип викторины в название (например: `audio-quiz-`, `image-quiz-`)
- Добавляйте номер или описание: `audio-quiz-apple.mp3`, `image-quiz-house.mp3`

## Форматы файлов
- **Основной формат**: MP3
- **Качество**: 128-320 kbps
- **Частота дискретизации**: 44.1 kHz
- **Длительность**: Рекомендуется 1-10 секунд для одного слова/фразы

## Использование в коде
```typescript
// Пример импорта аудиофайла для викторины
const audioFile = require('@/assets/audio/quiz/audio-quiz-apple.mp3');

// В компоненте QuizGuessImage
const quizData = [
  {
    id: 1,
    title: "Choose the word 'apple'",
    correctAnswer: 'apple',
    audio: require('@/assets/audio/quiz/audio-quiz-apple.mp3'),
    options: [
      { id: 'apple', image: require('@/assets/images/apple.png'), name: 'Apple' },
      { id: 'banana', image: require('@/assets/images/banana.png'), name: 'Banana' },
      { id: 'orange', image: require('@/assets/images/orange.png'), name: 'Orange' }
    ]
  }
];
```

## Организация контента
- Группируйте файлы по темам или уровням сложности
- Используйте префиксы для категоризации
- Поддерживайте единообразие в именовании

## Примеры файлов
- `audio-quiz-basic-words.mp3` - базовые слова
- `audio-quiz-animals.mp3` - животные
- `audio-quiz-colors.mp3` - цвета
- `audio-quiz-numbers.mp3` - числа
- `image-quiz-food.mp3` - еда
- `image-quiz-objects.mp3` - предметы

## Примечания
- Все аудиофайлы должны быть оптимизированы для мобильных устройств
- Проверяйте качество звука перед добавлением
- Следите за размером файлов (рекомендуется < 100KB на файл)
