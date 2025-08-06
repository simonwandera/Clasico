import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'

export default [
  { ignores: ['dist', '**/*.config.js'] },  // Added ignore for config files
  
  // Base JavaScript rules
  js.configs.recommended,
  
  // React specific configuration
  {
    ...reactRecommended,
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,  // Updated to latest ECMAScript version
      globals: {
        ...globals.browser,
        ...globals.node,  // Added Node.js globals if needed
        React: 'readonly',  // Explicit React global
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        jsxPragma: 'React',  // Explicit JSX pragma
      },
    },
    settings: {
      react: {
        version: 'detect',  // Automatically detect React version
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React specific rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',  // Not needed with new JSX transform
      
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      
      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Enhanced JavaScript rules
      'no-unused-vars': [
        'error',
        { 
          varsIgnorePattern: '^_|^[A-Z]',  // Allow unused variables starting with _ or uppercase
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-console': 'warn',  // Warn about console statements
      'semi': ['error', 'always'],  // Enforce semicolons
      'quotes': ['error', 'single'],  // Enforce single quotes
      
      // JSX specific rules
      'react/jsx-curly-spacing': ['error', { 'when': 'never' }],
      'react/jsx-tag-spacing': 'error',
    },
  },
  
  // Optional: Add separate config for test files if needed
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    env: {
      jest: true
    },
    rules: {
      'no-unused-expressions': 'off'
    }
  }
]