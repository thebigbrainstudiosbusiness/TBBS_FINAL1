export default {
  name: 'about',
  title: 'About Page Content',
  type: 'document',
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string'
    },
    {
      name: 'body',
      title: 'Body Text',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' }
          ]
        }
      ]
    }
  ]
}
