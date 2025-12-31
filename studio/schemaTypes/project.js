export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {        
      name: 'description',
      title: 'Short Description',
      type: 'string'
    },
    {
      name: 'details',
      title: 'Full Details',
      type: 'text'
    },
    {
      name: 'image',
      title: 'Cover Image URL',
      type: 'url'
    },
    {
      name: 'images',
      title: 'Project Image Gallery URLs',
      type: 'array',
      of: [
        {
          type: 'url'
        }
      ]
    },
    {
      name: 'video',
      title: 'Video Embed URL',
      type: 'url'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Cinematic', value: 'Cinematic' },
          { title: 'CGI', value: 'CGI' },
          { title: 'Campaigns', value: 'Campaigns' },
          { title: 'Experiential', value: 'Experiential' },
          { title: 'Realtime', value: 'Realtime' }
        ]
      }
    },
    {
      name: 'deliveryRhythm',
      title: 'Delivery Rhythm',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text'
        },
        {
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', title: 'Label', type: 'string' },
                { name: 'value', title: 'Value', type: 'string' }
              ]
            }
          ]
        },
        {
          name: 'progressBars',
          title: 'Progress Bars',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', title: 'Label', type: 'string' },
                { name: 'percentage', title: 'Percentage', type: 'number', validation: Rule => Rule.min(0).max(100) }
              ]
            }
          ]
        }
      ]
    }
  ]
}
