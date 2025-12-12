# Todo Mobile (React Native + Expo)

A simple, polished to‑do app built with React Native and Expo. It supports adding tasks, marking complete/incomplete, deleting, grouping and sorting, persistent storage, voice input via OpenAI Whisper, theming, haptics, and swipe gestures.

## Features

- Task management: add, toggle complete/incomplete, delete
- Task display: grouped sections (Upcoming, No Due Date, Completed), search and filter
- Data persistence: `AsyncStorage` keeps tasks and theme across launches
- Navigation: two screens (Task List, Add Task) via React Navigation
- Voice input: Floating Action Button listens and adds tasks using OpenAI Whisper
- Smart parsing: split natural phrases into multiple tasks ("Buy milk and call mom")
- Date handling: due dates with sorting; native date picker disallows past dates
- Theme: light/dark toggle and accent color presets, persisted
- UI polish: sticky section headers, haptics, animations, swipe to complete/delete, undo snackbar
- Tests: unit tests for storage helpers and task splitting

## Tech Stack

- React Native, Expo SDK 54
- Navigation: `@react-navigation/native` + `@react-navigation/native-stack`
- Storage: `@react-native-async-storage/async-storage`
- Voice: `expo-av` recording + OpenAI Whisper API transcription
- Safe Area: `react-native-safe-area-context`
- Gestures: `react-native-gesture-handler`
- Date Picker: `@react-native-community/datetimepicker`
- Icons: `@expo/vector-icons`
- Testing: `jest` + `jest-expo` + `ts-jest`

## Requirements

- Node.js 18+
- Expo CLI (`npx expo` is used automatically)
- For Android: Android Studio, Android SDK, `adb` on PATH
- For iOS: Xcode (macOS required)
- Optional: physical device with Expo Go installed

## Setup

1. Install dependencies
   - `npm install`
2. Configure OpenAI API key (required for voice input)
   - PowerShell (Windows):
     - `$env:EXPO_PUBLIC_OPENAI_API_KEY = "<your-key>"`
   - macOS/Linux:
     - `export EXPO_PUBLIC_OPENAI_API_KEY="<your-key>"`
3. Android SDK setup (Windows)
   - Install Android Studio and SDK; create/start an emulator in AVD Manager
   - Set environment variables for this session:
     - `$env:ANDROID_HOME = 'C:\\Users\\<you>\\AppData\\Local\\Android\\Sdk'`
     - `$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME`
     - `$env:Path = $env:Path + ';' + $env:ANDROID_HOME + '\\platform-tools'`
   - Verify: `adb version`

## Run

- Web: `npm run web` → open `http://localhost:8081/`
- Android: `npm run android`
- iOS: `npm run ios`
- Start in universal mode: `npm start` (then press `a`/`i`/`w`)

## Testing and Typecheck

- Run tests: `npm test`
- Typecheck: `npx tsc -p tsconfig.json --noEmit`

## How To Use

- Task List
  - Use the search box and filter chips (All/Active/Completed)
  - Tap color chips to change accent color
  - Use quick add field for rapid entry
  - Swipe right to complete/undo; swipe left to delete (Undo available)
  - Tap “Voice Add” to dictate tasks (requires OpenAI key)
- Add Task
  - Enter title and optional description
  - Pick due date (native picker blocks past dates); on web, enter `YYYY-MM-DD`

## Voice Input

- Recording: `expo-av` captures audio (`m4a` / `webm` depending on platform)
- Transcription: uploads to OpenAI Whisper (`/v1/audio/transcriptions`) and uses `data.text`
- Splitting: `extractTasks` in `src/utils/split.ts` turns a sentence into multiple tasks
- Environment: set `EXPO_PUBLIC_OPENAI_API_KEY` before starting the app
- Note: the key must not be committed to source control; keep it in environment variables

## Persistence

- Tasks are saved under key `@todo/tasks`
- Theme (light/dark) under `@todo/theme`
- Accent color under `@todo/accent`

## Architecture Overview

- `App.tsx` — providers, root safe-area, gesture root, navigation container
- `src/navigation/index.tsx` — stack navigator (`TaskList`, `AddTask`)
- `src/store/tasks.tsx` — task context store, actions, persistence hooks
- `src/screens/TaskListScreen.tsx` — list UI, search/filter, quick add, voice FAB, swipe
- `src/screens/AddTaskScreen.tsx` — form with due date; past-date validation
- `src/components/TaskItem.tsx` — task row (icons, overdue label, action buttons)
- `src/components/Snack.tsx` — undo snackbar component
- `src/utils/voice.ts` — record and transcribe with Whisper API
- `src/utils/split.ts` — split natural phrases into tasks
- `src/utils/storage.ts` — helper functions for `AsyncStorage`
- `src/theme/index.tsx` — theme provider, accent persistence
- `__tests__/*.test.ts` — unit tests for split and storage

## Design Decisions

- Context store over Redux for simplicity and small scope
- Sectioned list to improve scannability and sorting by due date
- Heuristic splitting to avoid external NLP dependency; easily swappable later
- Accent color customization for subtle personalization without complex theming
- Gestures implemented with `react-native-gesture-handler`; app wrapped in `GestureHandlerRootView`
- Safe area via `react-native-safe-area-context` for consistency across platforms

## Troubleshooting

- Gesture error: ensure app root uses `GestureHandlerRootView` (done in `App.tsx`)
- Android SDK / `adb` not found: set `ANDROID_HOME` and add `platform-tools` to PATH
- Voice not working: verify `EXPO_PUBLIC_OPENAI_API_KEY` is set and network is available
- Web voice: voice FAB requires the API key and recording; web uses `webm` where available
- Port conflicts: Expo prompts to switch ports; accept when asked

## Roadmap (Optional Enhancements)

- Snackbar undo for complete action
- Language selection for voice input
- Date picker quick chips (Today/Tomorrow/Next Week)
- More unit tests for reducer logic and UI components
- Migrate recording to `expo-audio` to address deprecation notice

## Security

- Do not commit API keys; keep them in environment variables
- Avoid logging sensitive data

## License

MIT