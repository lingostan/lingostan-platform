# React Native Debugger Setup

## Установка React Native Debugger

React Native Debugger - это standalone приложение для отладки React Native приложений.

### macOS

1. Скачайте и установите React Native Debugger:
   ```bash
   brew install --cask react-native-debugger
   ```
   
   Или скачайте вручную с [GitHub Releases](https://github.com/jhen0409/react-native-debugger/releases)

### Windows/Linux

Скачайте установщик с [GitHub Releases](https://github.com/jhen0409/react-native-debugger/releases)

## Использование

1. **Запустите React Native Debugger** (отдельное приложение)

2. **Запустите Expo приложение**:
   ```bash
   npm start
   # или для отладки
   npm run start:debug
   ```

3. **В приложении откройте Dev Menu**:
   - **iOS Simulator**: `Cmd + D` или встряхните устройство
   - **Android Emulator**: `Cmd + M` (Mac) или `Ctrl + M` (Windows/Linux) или встряхните устройство
   - **Физическое устройство**: Встряхните устройство

4. **Выберите "Debug"** в Dev Menu

5. React Native Debugger автоматически подключится к приложению

## Возможности

- ✅ React DevTools - инспектор компонентов
- ✅ Redux DevTools - отладка состояния (если используется Redux)
- ✅ Network Inspector - просмотр сетевых запросов
- ✅ Console - консоль JavaScript
- ✅ Breakpoints - точки останова для отладки

## Настройка порта

По умолчанию React Native Debugger использует порт `8081`. Если нужно изменить:

1. В React Native Debugger: `Debugger` → `New Window` → введите порт
2. В приложении: установите порт через переменную окружения:
   ```bash
   REACT_NATIVE_PACKAGER_PORT=8081 npm start
   ```

## Troubleshooting

### Debugger не подключается

1. Убедитесь, что React Native Debugger запущен
2. Проверьте, что порт 8081 свободен
3. Перезапустите Metro bundler: `npm start -- --reset-cache`
4. Перезапустите приложение

### Сетевые запросы не видны

Сетевые запросы логируются в консоль приложения (см. `utils/apiClient.ts`). 
Для просмотра в React Native Debugger используйте Network Inspector.

## Альтернатива: React DevTools (встроенный)

В проекте уже установлен `react-devtools` как зависимость. Для использования:

```bash
# Запустите React DevTools
npm run devtools
# или
npx react-devtools
```

Затем в Dev Menu приложения выберите "Debug" для подключения.

### Преимущества React DevTools:
- ✅ Не требует установки отдельного приложения
- ✅ Легко запускается через npm скрипт
- ✅ Интегрируется с React компонентами
- ✅ Показывает дерево компонентов и пропсы

### Преимущества React Native Debugger:
- ✅ Включает React DevTools + Redux DevTools
- ✅ Network Inspector встроен
- ✅ Более полный набор инструментов отладки

