# nextjs-react

This project is for exploring Next.js & React + Tailwind CSS!

For components, it will use Shadcn UI [based on Base UI (@base-ui/react)]: 

https://ui.shadcn.com/docs/components

https://base-ui.com/

It will eventually integrate with the dotnet minimal API project. 

## Getting Started

Install modules:

```bash
npm run install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Local API

The local api should be running on https://localhost:5001 (see @/lib/api/api.client.ts)

Currently, a local API can be sourced from the following repo:

https://github.com/eastonjeff/net-core-minimal-api

# File Structure

- /app: NextJS pages
- /components: UI components
    - ./ui: imported Shadcn components
- lib: Custom services & library
    - ./api: api utilities
        - ./models: api models
        - ./entities: entity modules
        - api.client.ts: base fetch client
