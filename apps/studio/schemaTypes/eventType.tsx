import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import { DoorsOpenInput } from './components/DoorsOpenInput'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'},
  ],
  fieldsets: [
    {name: 'eventBase', title: 'Event Base', options: {columns: 1}},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Event Name',
      type: 'string',
      group: 'details',
      fieldset: 'eventBase',
      validation: rule => 
        rule
          .min(10)
          .max(100)
          .warning('For consistency, this name should be between 10-100 characters')
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule
        .required()
        .error(`Slug is required to generate a page on the website`),
      hidden: ({document}) => !document?.name,
      readOnly: ({value, currentUser}) => {
        // Anyone can set the initial slug
        if (!value) {
          return false
        }
    
        const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')
    
        // Only admins can change the slug
        return !isAdmin
      },
      group: 'details',
      fieldset: 'eventBase',
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      deprecated: {
        reason: 'Use the "Event format" field instead.'
      },
      readOnly: true,
      hidden: true,
      options: {
        list: ['in-person', 'virtual'],
        layout: 'radio',
      },
      group: 'details',
    }),  
    defineField({
      name: 'format',
      type: 'string',
      options: {
        list: ['in-person', 'virtual'],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),  
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'details',
      description: (
        <details>
          <summary>Why is this important when publishing an event?</summary>
          The date and time of the event are used to display the event on the website and in the event listings.
        </details>
      ),
      /* validation: rule => 
        rule.required().info('This field is important when publishing an event.') */
    }),
    defineField({
      name: 'doorsOpen',
      description: 'Number of minutes before the start time for admission',
      type: 'number',
      initialValue: 60,
      group: 'details',
      components: {
        input: DoorsOpenInput
      }
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{type: 'venue'}],
      readOnly: ({value, document}) => !value && document?.eventType === 'in-person',
      /* hidden: ({value, document}) => !value && document?.eventType === 'in-person', */
      validation: (rule) =>
        rule.custom((value, context) => {
          console.log('value', value)
          console.log('context', context)
          if (value && context?.document?.eventType === 'virtual') {
            return 'Only in-person events can have a venue'
          }
    
          return true
        }),
      group: 'details',
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      to: [{type: 'artist'}],
      group: 'editorial',
    }),
    defineField({
      name: 'image',
      type: 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
      group: 'editorial',
    }),
    defineField({
      name: 'tickets',
      type: 'url',
      group: 'editorial',
    }),
    defineField({
      name: 'firstPublished',
      type: 'datetime',
      readOnly: true,
      group: 'details',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'headline.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : ''
  
      return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} @ ${venue}` : dateFormatted,
        media: image || CalendarIcon,
      }
    },
  },  
})