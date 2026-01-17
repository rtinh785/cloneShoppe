import { defineConfig } from '@lingui/cli'

export default defineConfig({
  locales: ['en', 'vi'],
  sourceLocale: 'vi',
  catalogs: [
    {
      path: 'src/locales/{locale}',
      include: ['src']
    }
  ],
  format: 'po',
  compileNamespace: 'ts'
})
