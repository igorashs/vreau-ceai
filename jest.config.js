module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  modulePaths: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/test/__mocks__/svgrMock.ts',
    '@/icons/(.*)': '<rootDir>/assets/icons/$1',
    '@/layouts/(.*)': '<rootDir>/shared/layouts/$1',
    '@/shared/(.*)': '<rootDir>/shared/$1',
    '@/utils/(.*)': '<rootDir>/utils/$1',
    '@/models/(.*)': '<rootDir>/models/$1',
  },
};
