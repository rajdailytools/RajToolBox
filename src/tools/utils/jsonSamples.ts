/**
 * Curated Safe JSON Sample Datasets for Testing & Educational Demonstration
 * All names, emails, IDs, and records are fictitious.
 */

export interface JsonSampleItem {
  id: string;
  name: string;
  category: 'valid' | 'invalid' | 'api' | 'schema';
  description: string;
  content: string;
  schema?: string;
}

export const JSON_SAMPLES: JsonSampleItem[] = [
  {
    id: 'api-response',
    name: 'REST API User Profile & Preferences',
    category: 'api',
    description: 'Standard REST API response containing nested user metadata, authentication claims, and preferences.',
    content: JSON.stringify(
      {
        status: 'success',
        statusCode: 200,
        timestamp: '2026-10-11T08:30:00Z',
        data: {
          user: {
            id: 'usr_984712',
            username: 'alex_developer',
            email: 'alex.developer@example.com',
            verified: true,
            roles: ['developer', 'editor'],
            profile: {
              fullName: 'Alex Morgan',
              avatarUrl: 'https://images.example.com/avatars/usr_984712.png',
              bio: 'Full-stack software engineer and open-source enthusiast.',
              location: 'New Delhi, India',
              timezone: 'Asia/Kolkata'
            },
            security: {
              mfaEnabled: true,
              lastLoginAt: '2026-10-10T22:15:42Z',
              failedAttempts: 0
            },
            preferences: {
              theme: 'dark',
              notifications: {
                email: true,
                push: false,
                sms: false
              },
              indentation: 2
            }
          }
        },
        meta: {
          requestId: 'req_87d031f0',
          executionTimeMs: 14.8
        }
      },
      null,
      2
    )
  },
  {
    id: 'product-catalog',
    name: 'E-Commerce Product Catalog Array',
    category: 'valid',
    description: 'Array of multi-variant product objects with pricing, stock counts, tags, and ratings.',
    content: JSON.stringify(
      {
        store: 'RajTech Gear',
        currency: 'INR',
        totalProducts: 3,
        products: [
          {
            sku: 'RT-KB-01',
            title: 'Mechanical Ergonomic Keyboard',
            category: 'Peripherals',
            price: 4999.0,
            inStock: true,
            inventory: 45,
            rating: 4.8,
            reviewsCount: 128,
            tags: ['wireless', 'rgb', 'mechanical', 'bluetooth'],
            dimensions: { widthCm: 35.5, depthCm: 14.0, heightCm: 3.8, weightG: 850 }
          },
          {
            sku: 'RT-MS-02',
            title: 'Ultra-Lightweight Precision Gaming Mouse',
            category: 'Peripherals',
            price: 2499.0,
            inStock: true,
            inventory: 82,
            rating: 4.6,
            reviewsCount: 94,
            tags: ['optical', 'high-dpi', 'ergonomic'],
            dimensions: { widthCm: 6.8, depthCm: 12.5, heightCm: 4.1, weightG: 68 }
          },
          {
            sku: 'RT-HP-03',
            title: 'Active Noise Cancelling Studio Headphones',
            category: 'Audio',
            price: 8999.0,
            inStock: false,
            inventory: 0,
            rating: 4.9,
            reviewsCount: 310,
            tags: ['bluetooth-5.3', 'anc', 'lossless', 'usb-c'],
            dimensions: { widthCm: 18.0, depthCm: 20.0, heightCm: 8.5, weightG: 250 }
          }
        ]
      },
      null,
      2
    )
  },
  {
    id: 'system-config',
    name: 'Application Environment Configuration',
    category: 'valid',
    description: 'Hierarchical server configuration with database pool settings, rate limits, and caching rules.',
    content: JSON.stringify(
      {
        appName: 'RajToolBox-Gateway',
        environment: 'production',
        server: {
          host: '0.0.0.0',
          port: 3000,
          ssl: true,
          keepAliveTimeoutMs: 65000
        },
        database: {
          driver: 'postgresql',
          pool: {
            minConnections: 5,
            maxConnections: 25,
            idleTimeoutMillis: 30000
          },
          readReplicas: ['db-replica-1.local', 'db-replica-2.local']
        },
        security: {
          corsOrigins: ['https://rajtoolbox.com'],
          rateLimiting: {
            windowMinutes: 1,
            maxRequestsPerIp: 120
          }
        },
        features: {
          enablePwa: true,
          enableLocalCaching: true,
          betaToolsVisible: false
        }
      },
      null,
      2
    )
  },
  {
    id: 'invalid-trailing-comma',
    name: '[Invalid] Trailing Comma Syntax Error',
    category: 'invalid',
    description: 'Demonstrates a common syntax error: trailing comma before the closing brace or bracket.',
    content: `{\n  "service": "Authentication Gateway",\n  "status": "online",\n  "ports": [\n    80,\n    443,\n  ],\n  "timeout": 5000,\n}`
  },
  {
    id: 'invalid-single-quotes',
    name: '[Invalid] Single Quotes & Unquoted Keys',
    category: 'invalid',
    description: 'Demonstrates single quotes and missing double quotes around keys (common JavaScript syntax mistaken for JSON).',
    content: `{\n  serviceName: 'Database Service',\n  host: 'localhost',\n  'port': 5432,\n  sslRequired: true\n}`
  },
  {
    id: 'invalid-comments',
    name: '[Invalid] JavaScript Comments in JSON',
    category: 'invalid',
    description: 'Demonstrates invalid inline comments in standard JSON (prohibited by RFC 8259).',
    content: `{\n  // Primary Application Configuration\n  "appName": "RajToolBox",\n  "version": "2.4.0",\n  /* Database credentials (prohibited in standard JSON) */\n  "maxWorkers": 8,\n  "debug": false\n}`
  },
  {
    id: 'schema-validation-demo',
    name: 'JSON Schema Validation Sample',
    category: 'schema',
    description: 'Data object paired with JSON Schema Draft-07 to demonstrate real-time constraint checking.',
    content: JSON.stringify(
      {
        userId: 1045,
        name: 'Raj Singh',
        email: 'raj@rajtoolbox.com',
        age: 26,
        role: 'admin',
        skills: ['TypeScript', 'React', 'Physics', 'Python']
      },
      null,
      2
    ),
    schema: JSON.stringify(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'User Record Schema',
        type: 'object',
        required: ['userId', 'name', 'email', 'age', 'role'],
        properties: {
          userId: {
            type: 'integer',
            minimum: 1
          },
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 50
          },
          email: {
            type: 'string',
            format: 'email'
          },
          age: {
            type: 'integer',
            minimum: 18,
            maximum: 100
          },
          role: {
            type: 'string',
            enum: ['admin', 'developer', 'viewer']
          },
          skills: {
            type: 'array',
            items: {
              type: 'string'
            },
            minItems: 1
          }
        },
        additionalProperties: false
      },
      null,
      2
    )
  }
];
