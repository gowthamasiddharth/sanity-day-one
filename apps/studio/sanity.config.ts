import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
import {
  dashboardTool,
  sanityTutorialsWidget,
  projectUsersWidget,
  projectInfoWidget,
} from "@sanity/dashboard";
import {documentListWidget} from 'sanity-plugin-dashboard-widget-document-list'
import {media} from 'sanity-plugin-media'

export default defineConfig({
  name: 'default',
  title: 'Day One Content Operations New',

  projectId: '8ltev99m',
  dataset: 'production',
 
  plugins: [
    structureTool({structure, defaultDocumentNode}), 
    visionTool(), 
    dashboardTool({
      widgets: [
        sanityTutorialsWidget(), 
        projectUsersWidget({ layout: { width: 'small' } }), 
        projectInfoWidget(), 
        documentListWidget({
          title: 'Last edited',
          order: '_updatedAt desc',
          types: ['event', 'artist', 'venue'],
        }),
      ],
    }),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },

  tools: (prev, {currentUser}) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')

    if (isAdmin) {
      return prev
    }

    return prev.filter((tool) => tool.name !== 'vision')
  },
})
