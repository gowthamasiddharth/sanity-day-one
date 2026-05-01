import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '8ltev99m',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'mq3d4v5siyoy4sj1k5kge54p'
  }
})
