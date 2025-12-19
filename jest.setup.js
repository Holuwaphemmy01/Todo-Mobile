jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {}
  return {
    setItem: async (key, value) => {
      store[key] = value
    },
    getItem: async key => store[key] ?? null,
    removeItem: async key => {
      delete store[key]
    },
    clear: async () => {
      store = {}
    },
  }
})