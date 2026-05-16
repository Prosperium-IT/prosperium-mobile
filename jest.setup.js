// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => ({
    getNumber: jest.fn(),
    setNumber: jest.fn(),
    getString: jest.fn(),
    setString: jest.fn(),
    clearAll: jest.fn(),
  })),
}))

// Mock Expo modules
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}))

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {},
  },
}))

// Mock WatermelonDB
jest.mock('@nozbe/watermelondb/react', () => ({
  useDatabase: jest.fn(),
}))
