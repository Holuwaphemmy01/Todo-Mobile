jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {}
  return {
    setItem: async (k, v) => {
      store[k] = v
    },
    getItem: async k => store[k] ?? null,
    removeItem: async k => {
      delete store[k]
    },
    clear: async () => {
      store = {}
    },
  }
})