import * as FileSystem from 'expo-file-system'
import { Audio } from 'expo-av'

type TranscriptionResult = {
  text: string | null
  error?: string
}

export async function recordAndTranscribe(maxSeconds = 10): Promise<TranscriptionResult> {
  const perm = await Audio.requestPermissionsAsync()
  if (!perm.granted) return { text: null, error: 'microphone' }

  await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true })
  const recording = new Audio.Recording()
  const options: Audio.RecordingOptions = {
    android: {
      extension: '.m4a',
      outputFormat: Audio.AndroidOutputFormat.MPEG_4,
      audioEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    web: {
      mimeType: 'audio/webm',
      bitsPerSecond: 128000,
    },
  }
  await recording.prepareToRecordAsync(options)
  await recording.startAsync()

  await new Promise(resolve => setTimeout(resolve, maxSeconds * 1000))
  try {
    await recording.stopAndUnloadAsync()
  } catch {}
  const uri = recording.getURI()
  if (!uri) return { text: null, error: 'record' }

  const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY
  if (!key) return { text: null, error: 'key' }

  const model = 'whisper-1'
  const fileInfo = await FileSystem.getInfoAsync(uri)
  const form = new FormData()
  const isWebm = uri.toLowerCase().endsWith('.webm')
  const name = isWebm ? 'speech.webm' : 'speech.m4a'
  const type = isWebm ? 'audio/webm' : 'audio/m4a'
  form.append('file', { uri, name, type } as any)
  form.append('model', model)

  try {
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    })
    if (!res.ok) return { text: null, error: 'stt' }
    const data = await res.json()
    return { text: typeof data.text === 'string' ? data.text : null }
  } catch {
    return { text: null, error: 'network' }
  } finally {
    if (fileInfo.exists) await FileSystem.deleteAsync(uri, { idempotent: true })
  }
}