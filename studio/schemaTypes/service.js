export default {
  name: 'service',
  title: 'Service',
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
      title: 'Preview Image URL',
      type: 'url'
    },
    {
      name: 'samples',
      title: 'Sample Image URLs',
      type: 'array',
      of: [
        {
          type: 'url'
        }
      ]
    },
    {
      name: 'whyChooseUs',
      title: 'Why Choose Us Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'items',
          title: 'Why Choose Us Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'icon',
                  title: 'Icon (emoji or text)',
                  type: 'string'
                },
                {
                  name: 'text',
                  title: 'Item Text',
                  type: 'string'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
