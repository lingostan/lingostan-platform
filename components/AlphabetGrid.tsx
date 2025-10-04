import { Audio } from 'expo-av'
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'

// Пример данных. Можно импортировать из JSON или хука
const lettersData = [
  {
    id: 1,
    letter: 'А',
    transcription: 'ажари',
    audioUrl: require('../assets/audio/alphabet/lakku/1.mp3'),
  },
  {
    id: 2,
    letter: 'Аь',
    transcription: 'аньак|и',
    audioUrl: require('../assets/audio/alphabet/lakku/2.mp3'),
  },
  {
    id: 3,
    letter: 'Б',
    transcription: 'бак|',
    audioUrl: require('../assets/audio/alphabet/lakku/3.mp3'),
  },
  {
    id: 4,
    letter: 'В',
    transcription: 'варани',
    audioUrl: require('../assets/audio/alphabet/lakku/4.mp3'),
  },
  {
    id: 5,
    letter: 'Г',
    transcription: 'гунгуми',
    audioUrl: require('../assets/audio/alphabet/lakku/5.mp3'),
  },
  {
    id: 6,
    letter: 'Гъ',
    transcription: 'гъарал',
    audioUrl: require('../assets/audio/alphabet/lakku/6.mp3'),
  },
  {
    id: 7,
    letter: 'Гь',
    transcription: 'гьану',
    audioUrl: require('../assets/audio/alphabet/lakku/7.mp3'),
  },
  {
    id: 8,
    letter: 'Д',
    transcription: 'даву',
    audioUrl: require('../assets/audio/alphabet/lakku/8.mp3'),
  },
  {
    id: 9,
    letter: 'Е',
    transcription: 'е',
    audioUrl: require('../assets/audio/alphabet/lakku/9.mp3'),
  },
  {
    id: 10,
    letter: 'Ё',
    transcription: 'ё',
    audioUrl: require('../assets/audio/alphabet/lakku/10.mp3'),
  },
  {
    id: 11,
    letter: 'Ж',
    transcription: 'жалин',
    audioUrl: require('../assets/audio/alphabet/lakku/11.mp3'),
  },
  {
    id: 12,
    letter: 'З',
    transcription: 'зимиз',
    audioUrl: require('../assets/audio/alphabet/lakku/12.mp3'),
  },
  {
    id: 13,
    letter: 'И',
    transcription: 'инт',
    audioUrl: require('../assets/audio/alphabet/lakku/13.mp3'),
  },
  {
    id: 15,
    letter: 'К',
    transcription: 'инт',
    audioUrl: require('../assets/audio/alphabet/lakku/15.mp3'),
  },
  {
    id: 16,
    letter: 'Кк',
    transcription: 'ккунук',
    audioUrl: require('../assets/audio/alphabet/lakku/16.mp3'),
  },
  {
    id: 17,
    letter: 'Къ',
    transcription: 'къалпуз',
    audioUrl: require('../assets/audio/alphabet/lakku/17.mp3'),
  },
  {
    id: 18,
    letter: 'Кь',
    transcription: 'кьини',
    audioUrl: require('../assets/audio/alphabet/lakku/18.mp3'),
  },
  {
    id: 19,
    letter: 'К|',
    transcription: 'к|улу',
    audioUrl: require('../assets/audio/alphabet/lakku/19.mp3'),
  },
  {
    id: 20,
    letter: 'Л',
    transcription: 'ламу',
    audioUrl: require('../assets/audio/alphabet/lakku/20.mp3'),
  },
  {
    id: 21,
    letter: 'М',
    transcription: 'миллат',
    audioUrl: require('../assets/audio/alphabet/lakku/21.mp3'),
  },
  {
    id: 22,
    letter: 'Н',
    transcription: 'нину',
    audioUrl: require('../assets/audio/alphabet/lakku/22.mp3'),
  },
  {
    id: 24,
    letter: 'Оъ',
    transcription: 'оърч|',
    audioUrl: require('../assets/audio/alphabet/lakku/24.mp3'),
  },
  {
    id: 26,
    letter: 'Пп',
    transcription: 'ппал',
    audioUrl: require('../assets/audio/alphabet/lakku/26.mp3'),
  },
  {
    id: 28,
    letter: 'Р',
    transcription: 'рик|',
    audioUrl: require('../assets/audio/alphabet/lakku/28.mp3'),
  },
  {
    id: 29,
    letter: 'C',
    transcription: 'Симан',
    audioUrl: require('../assets/audio/alphabet/lakku/29.mp3'),
  },
  {
    id: 30,
    letter: 'Сс',
    transcription: 'ссихьу',
    audioUrl: require('../assets/audio/alphabet/lakku/30.mp3'),
  },
  {
    id: 31,
    letter: 'Т',
    transcription: 'талих|',
    audioUrl: require('../assets/audio/alphabet/lakku/31.mp3'),
  },
  {
    id: 32,
    letter: 'Тт',
    transcription: 'ттукку',
    audioUrl: require('../assets/audio/alphabet/lakku/32.mp3'),
  },
  {
    id: 33,
    letter: 'Т|',
    transcription: 'т|абиаьт',
    audioUrl: require('../assets/audio/alphabet/lakku/33.mp3'),
  },
  {
    id: 34,
    letter: 'У',
    transcription: 'уссу',
    audioUrl: require('../assets/audio/alphabet/lakku/34.mp3'),
  },
  {
    id: 35,
    letter: 'Ф',
    transcription: 'ф',
    audioUrl: require('../assets/audio/alphabet/lakku/35.mp3'),
  },
  {
    id: 36,
    letter: 'Х',
    transcription: 'хиял',
    audioUrl: require('../assets/audio/alphabet/lakku/36.mp3'),
  },
  {
    id: 37,
    letter: 'Хх',
    transcription: 'ххуллу',
    audioUrl: require('../assets/audio/alphabet/lakku/37.mp3'),
  },
  {
    id: 38,
    letter: 'Хъ',
    transcription: 'хъува',
    audioUrl: require('../assets/audio/alphabet/lakku/38.mp3'),
  },
  {
    id: 39,
    letter: 'Хь',
    transcription: 'хьулу',
    audioUrl: require('../assets/audio/alphabet/lakku/39.mp3'),
  },
  {
    id: 40,
    letter: 'Хьхь',
    transcription: 'хьхьири',
    audioUrl: require('../assets/audio/alphabet/lakku/40.mp3'),
  },
  {
    id: 41,
    letter: 'Х|',
    transcription: 'х|акин',
    audioUrl: require('../assets/audio/alphabet/lakku/41.mp3'),
  },
  {
    id: 42,
    letter: 'Ц',
    transcription: 'цулч|а',
    audioUrl: require('../assets/audio/alphabet/lakku/42.mp3'),
  },
  {
    id: 43,
    letter: 'Цц',
    transcription: 'ццац',
    audioUrl: require('../assets/audio/alphabet/lakku/43.mp3'),
  },
  {
    id: 44,
    letter: 'Ц|',
    transcription: 'ц|улит',
    audioUrl: require('../assets/audio/alphabet/lakku/44.mp3'),
  },
  {
    id: 45,
    letter: 'Ч',
    transcription: 'чани',
    audioUrl: require('../assets/audio/alphabet/lakku/45.mp3'),
  },
  {
    id: 46,
    letter: 'Чч',
    transcription: 'ччан',
    audioUrl: require('../assets/audio/alphabet/lakku/46.mp3'),
  },
  {
    id: 47,
    letter: 'Ч|',
    transcription: 'ч|елму',
    audioUrl: require('../assets/audio/alphabet/lakku/47.mp3'),
  },
  {
    id: 48,
    letter: 'Ш',
    transcription: 'шагьру',
    audioUrl: require('../assets/audio/alphabet/lakku/48.mp3'),
  },
  {
    id: 49,
    letter: 'Щ',
    transcription: 'щин',
    audioUrl: require('../assets/audio/alphabet/lakku/49.mp3'),
  },
  {
    id: 53,
    letter: 'Э',
    transcription: 'эшкьи',
    audioUrl: require('../assets/audio/alphabet/lakku/53.mp3'),
  },
  {
    id: 54,
    letter: 'Ю',
    transcription: 'ю',
    audioUrl: require('../assets/audio/alphabet/lakku/54.mp3'),
  },
  {
    id: 55,
    letter: 'Я',
    transcription: 'яру',
    audioUrl: require('../assets/audio/alphabet/lakku/55.mp3'),
  },

  // ...остальные 47 букв
]

type Props = {
  setProgress: Dispatch<SetStateAction<number>>
  setCounter: Dispatch<SetStateAction<{ total: number; progress: number }>>
}

export default function AlphabetGrid(props: Props) {
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playedLetters, setPlayedLetters] = useState<Set<string>>(new Set())
  const [sound, setSound] = useState<Audio.Sound | null>(null)

  const { setProgress, setCounter } = props

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync()
    }
  }, [sound])

  useEffect(() => {
    console.log(
      playedLetters.size / lettersData.length,
      playedLetters.size,
      lettersData.length
    )
    setProgress(playedLetters.size / lettersData.length)
    setCounter({
      total: lettersData.length,
      progress: playedLetters.size,
    })
  }, [playedLetters])

  const playSound = async (letterId: string, audioUrl: any) => {
    if (isPlaying) return

    setActiveLetter(letterId)
    setIsPlaying(true)

    try {
      const { sound } = await Audio.Sound.createAsync(audioUrl)
      setSound(sound)

      sound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) {
          setIsPlaying(false)
          setActiveLetter(null)
          setPlayedLetters(prev => new Set(prev).add(letterId))
        }
      })

      await sound.playAsync()
    } catch (error) {
      console.error('Ошибка воспроизведения:', error)
      setIsPlaying(false)
      setActiveLetter(null)
    }
  }

  const isLetterPlayed = (letterId: string) => playedLetters.has(letterId)

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {lettersData.map(item => {
        const isActive = activeLetter === item.id
        const isDisabled = isPlaying && !isActive
        const isPlayed = isLetterPlayed(item.id)

        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.button,
              isActive && styles.activeButton,
              isPlayed && styles.playedButton,
              isDisabled && styles.disabledButton,
            ]}
            onPress={() => playSound(item.id, item.audioUrl)}
            disabled={isDisabled}
          >
            <Text style={styles.letter}>{item.letter}</Text>
            <Text style={styles.transcription}>{item.transcription}</Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  activeButton: {
    backgroundColor: '#ffd700',
    borderColor: '#ffaa00',
  },
  button: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    margin: 5,
    width: '20%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  playedButton: {
    backgroundColor: '#d0f0c0',
    borderColor: '#a0e0b0',
  },
  transcription: {
    color: '#666',
    fontSize: 12,
  },
})
