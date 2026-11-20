import nextVitals from 'eslint-config-next/core-web-vitals'

// eslint-config-next 16 ya viene en formato "flat config": se usa directo (FlatCompat ya no funciona con él)
const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
]

export default eslintConfig
