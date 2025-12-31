export default {
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'leftTitle',
      title: 'Left Panel Title',
      type: 'string',
    },
    {
      name: 'leftDescription',
      title: 'Left Panel Description',
      type: 'text',
    },
    {
      name: 'emailAddress',
      title: 'Email Address',
      type: 'string',
    },
    {
      name: 'primaryButtonText',
      title: 'Primary Button Text',
      type: 'string',
    },
    {
      name: 'secondaryButtonText',
      title: 'Secondary Button Text',
      type: 'string',
    },
    {
      name: 'submitButtonText',
      title: 'Submit Button Text',
      type: 'string',
    },
    {
      name: 'formLabels',
      title: 'Form Labels',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Name Label',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email Label',
          type: 'string',
        },
        {
          name: 'message',
          title: 'Message Label',
          type: 'string',
        },
      ],
    },
    {
      name: 'formPlaceholders',
      title: 'Form Placeholders',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Name Placeholder',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email Placeholder',
          type: 'string',
        },
        {
          name: 'message',
          title: 'Message Placeholder',
          type: 'string',
        },
      ],
    },
    {
      name: 'termsText',
      title: 'Terms Text',
      type: 'string',
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
    },
  ],
}
