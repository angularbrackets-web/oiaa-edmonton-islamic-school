import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'

export default buildConfig({
  admin: {
    user: 'users',
  },
  routes: {
    admin: '/admin',
    api: '/api',
  },
  serverURL: process.env.SERVER_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000',
  editor: lexicalEditor({}),
  collections: [
    // Users collection for admin authentication
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
          required: true,
          defaultValue: 'editor',
        },
      ],
    },
    // Pages collection for static pages
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'metaDescription',
          type: 'text',
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    // News collection for school updates
    {
      slug: 'news',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'excerpt',
          type: 'textarea',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'publishedDate',
          type: 'date',
          required: true,
          defaultValue: () => new Date(),
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    // Events collection for school activities
    {
      slug: 'events',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
        },
        {
          name: 'eventDate',
          type: 'date',
          required: true,
        },
        {
          name: 'eventTime',
          type: 'text',
        },
        {
          name: 'location',
          type: 'text',
        },
        {
          name: 'isRecurring',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    // Staff collection for faculty profiles
    {
      slug: 'staff',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          required: true,
        },
        {
          name: 'department',
          type: 'select',
          options: [
            { label: 'Administration', value: 'administration' },
            { label: 'Elementary', value: 'elementary' },
            { label: 'Middle School', value: 'middle-school' },
            { label: 'High School', value: 'high-school' },
            { label: 'Islamic Studies', value: 'islamic-studies' },
            { label: 'Arabic Language', value: 'arabic-language' },
          ],
          required: true,
        },
        {
          name: 'bio',
          type: 'richText',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'qualifications',
          type: 'array',
          fields: [
            {
              name: 'qualification',
              type: 'text',
            },
          ],
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    // Programs collection for educational programs
    {
      slug: 'programs',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
        },
        {
          name: 'ageRange',
          type: 'text',
          required: true,
        },
        {
          name: 'features',
          type: 'array',
          fields: [
            {
              name: 'feature',
              type: 'text',
            },
          ],
        },
        {
          name: 'tuition',
          type: 'number',
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    // Media collection for file uploads
    {
      slug: 'media',
      upload: {
        staticDir: path.resolve(__dirname, '../../public/uploads'),
        mimeTypes: ['image/*', 'application/pdf'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./database.sqlite',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})