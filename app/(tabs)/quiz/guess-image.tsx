import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { BaseText } from '@/components/ui/BaseText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Sample quiz data - you can replace with actual data
const quizData = [
  {
    id: 1,
    title: "Выберите слово 'хъит1'",
    correctAnswer: 'apple',
    audio: require('../../../assets/audio/quiz/audio-quiz-apple.mp3'), // Add audio file here
    options: [
      { id: 'apple', image: require('../../../assets/images/content/apple.jpg'), name: 'Яблоко' },
      { id: 'banana', image: require('../../../assets/images/content/banana.jpg'), name: 'Банан' },
      { id: 'pear', image: require('../../../assets/images/content/pear.jpg'), name: 'Груша' }
    ]
  },
  {
    id: 2,
    title: "Выберите слово 'Къатта'",
    correctAnswer: 'house',
    options: [
      { id: 'car', image: require('../../../assets/images/content/car.jpg'), name: 'Машина' },
      { id: 'house', image: require('../../../assets/images/content/house.jpg'), name: 'Дом' },
      { id: 'tree', image: require('../../../assets/images/content/tree.jpg'), name: 'Дерево' }
    ]
  },
  {
    id: 3,
    title: "Выберите слово 'ччиту'",
    correctAnswer: 'cat',
    options: [
      { id: 'dog', image: require('../../../assets/images/content/dog.jpg'), name: 'Собака' },
      { id: 'bird', image: require('../../../assets/images/content/bird.jpg'), name: 'Птица' },
      { id: 'cat', image: require('../../../assets/images/content/cat.jpg'), name: 'Кошка' }
    ]
  },
  {
    id: 4,
    title: "Choose the word 'book'",
    correctAnswer: 'book',
    options: [
      { id: 'book', image: require('../../../assets/images/icon.png'), name: 'Book' },
      { id: 'pen', image: require('../../../assets/images/icon.png'), name: 'Pen' },
      { id: 'paper', image: require('../../../assets/images/icon.png'), name: 'Paper' }
    ]
  },
  {
    id: 5,
    title: "Choose the word 'sun'",
    correctAnswer: 'sun',
    options: [
      { id: 'moon', image: require('../../../assets/images/icon.png'), name: 'Moon' },
      { id: 'star', image: require('../../../assets/images/icon.png'), name: 'Star' },
      { id: 'sun', image: require('../../../assets/images/icon.png'), name: 'Sun' }
    ]
  },
  {
    id: 6,
    title: "Choose the word 'water'",
    correctAnswer: 'water',
    options: [
      { id: 'fire', image: require('../../../assets/images/icon.png'), name: 'Fire' },
      { id: 'water', image: require('../../../assets/images/icon.png'), name: 'Water' },
      { id: 'earth', image: require('../../../assets/images/icon.png'), name: 'Earth' }
    ]
  },
  {
    id: 7,
    title: "Choose the word 'flower'",
    correctAnswer: 'flower',
    options: [
      { id: 'flower', image: require('../../../assets/images/icon.png'), name: 'Flower' },
      { id: 'grass', image: require('../../../assets/images/icon.png'), name: 'Grass' },
      { id: 'leaf', image: require('../../../assets/images/icon.png'), name: 'Leaf' }
    ]
  },
  {
    id: 8,
    title: "Choose the word 'mountain'",
    correctAnswer: 'mountain',
    options: [
      { id: 'hill', image: require('../../../assets/images/icon.png'), name: 'Hill' },
      { id: 'mountain', image: require('../../../assets/images/icon.png'), name: 'Mountain' },
      { id: 'valley', image: require('../../../assets/images/icon.png'), name: 'Valley' }
    ]
  },
  {
    id: 9,
    title: "Choose the word 'ocean'",
    correctAnswer: 'ocean',
    options: [
      { id: 'river', image: require('../../../assets/images/icon.png'), name: 'River' },
      { id: 'lake', image: require('../../../assets/images/icon.png'), name: 'Lake' },
      { id: 'ocean', image: require('../../../assets/images/icon.png'), name: 'Ocean' }
    ]
  },
  {
    id: 10,
    title: "Choose the word 'friend'",
    correctAnswer: 'friend',
    options: [
      { id: 'family', image: require('../../../assets/images/icon.png'), name: 'Family' },
      { id: 'friend', image: require('../../../assets/images/icon.png'), name: 'Friend' },
      { id: 'neighbor', image: require('../../../assets/images/icon.png'), name: 'Neighbor' }
    ]
  }
];

const QuizGuessImage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;

  // Function to play audio
  const playSound = async (audioFile: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(audioFile);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowActionPanel(true);
    setAnswerStatus(null);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setAnswerStatus('correct');
      setScore(score + 1);
    } else {
      setAnswerStatus('incorrect');
    }
    setShowActionPanel(false);
  };

  const handleSkip = () => {
    setSelectedOption(null);
    setShowActionPanel(false);
    setAnswerStatus(null);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === quizData.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowActionPanel(false);
      setAnswerStatus(null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowActionPanel(false);
    setAnswerStatus(null);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.completionContainer}>
          <BaseText variant="displayL" style={styles.completionTitle}>
            Викторина завершена!
          </BaseText>
          <BaseText variant="headingM" style={styles.scoreText}>
            Ваш результат: {score} из {quizData.length}
          </BaseText>
          <BaseText variant="body" style={styles.percentageText}>
            {Math.round((score / quizData.length) * 100)}%
          </BaseText>
          <PrimaryButton
            title="Попробовать снова"
            variant="blue"
            size="large"
            mode="filled"
            onPress={handleRestart}
          />
          <PrimaryButton
            title="Вернуться на главную"
            variant="green"
            size="large"
            mode="filled"
            onPress={() => router.push('/dashboard')}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Question Counter and Progress Bar */}
      <View style={styles.header}>
        <BaseText variant="subtitle" style={styles.questionCounter}>
            Вопрос {currentQuestionIndex + 1} из {quizData.length}
        </BaseText>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Question Title */}
      <BaseText variant="headingM" style={styles.questionTitle}>
        {currentQuestion.title}
      </BaseText>

      {/* Audio Play Button */}
      {currentQuestion.audio && (
        <View style={styles.audioContainer}>
          <PrimaryButton
            title="Воспроизвести аудио"
            variant="blue"
            size="medium"
            mode="filled"
            onPress={() => playSound(currentQuestion.audio)}
          />
        </View>
      )}

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option) => (
          <View key={option.id} style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.imageContainer,
                selectedOption === option.id && styles.selectedImage
              ]}
              onPress={() => handleOptionSelect(option.id)}
              disabled={showActionPanel || answerStatus !== null}
            >
              <Image source={option.image} style={styles.optionImage} />
            </TouchableOpacity>
            <BaseText variant="bodyBold" style={styles.optionName}>
              {option.name}
            </BaseText>
          </View>
        ))}
      </View>

      {/* Action Panel */}
      {showActionPanel && selectedOption && (
        <View style={styles.actionPanel}>
          <PrimaryButton
            title="Проверить"
            variant="blue"
            size="medium"
            mode="filled"
            onPress={handleCheckAnswer}
          />
          <PrimaryButton
            title="Пропустить"
            variant="gray"
            size="medium"
            mode="outline"
            onPress={handleSkip}
          />
        </View>
      )}

      {/* Answer Feedback */}
      {answerStatus && (
        <View style={[
          styles.feedbackPanel,
          answerStatus === 'correct' ? styles.correctPanel : styles.incorrectPanel
        ]}>
          <BaseText 
            variant="bodyBold" 
            color={answerStatus === 'correct' ? 'green' : 'red'}
            style={styles.feedbackText}
          >
            {answerStatus === 'correct' 
              ? 'Правильно! Отлично!' 
              : `Неверно. Правильный ответ: "${currentQuestion.correctAnswer}".`
            }
          </BaseText>
          <PrimaryButton
            title={currentQuestionIndex === quizData.length - 1 ? "Завершить викторину" : "Следующий вопрос"}
            variant={answerStatus === 'correct' ? 'green' : 'red'}
            size="medium"
            mode="filled"
            onPress={handleNextQuestion}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
  },
  questionCounter: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#58cc02',
    borderRadius: 4,
  },
  questionTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  audioContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  optionContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: (width - 80) / 3, // Account for padding and gaps
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Square aspect ratio
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedImage: {
    borderColor: '#58cc02',
    borderWidth: 3,
  },
  optionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  optionName: {
    textAlign: 'center',
    color: '#333',
  },
  actionPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    marginHorizontal: 10,
  },
  feedbackPanel: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  correctPanel: {
    backgroundColor: 'rgba(88, 204, 2, 0.1)',
    borderWidth: 2,
    borderColor: '#58cc02',
  },
  incorrectPanel: {
    backgroundColor: 'rgba(234, 43, 43, 0.1)',
    borderWidth: 2,
    borderColor: '#ea2b2b',
  },
  feedbackText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
  },
  nextButton: {
    minWidth: 150,
  },
  completionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  completionTitle: {
    marginBottom: 20,
    color: '#58cc02',
  },
  scoreText: {
    marginBottom: 10,
    color: '#333',
  },
  percentageText: {
    marginBottom: 30,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#58cc02',
  },
  button: {
    marginVertical: 10,
    minWidth: 200,
  },
});

export default QuizGuessImage; 