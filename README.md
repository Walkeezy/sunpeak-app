# Sunpeak

This interactive map displays webcams from all over Switzerland, giving you a real-time glimpse of the current weather conditions and helping you plan your next outdoor adventure. So why wait? Let's find out where the sun is shining today!

Available here: [sunpeak.app](https://sunpeak.app)

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) with React and TypeScript
- [Leaflet](https://leafletjs.com/) / [react-leaflet](https://react-leaflet.js.org/) for the interactive map, with tiles from [Mapbox](https://www.mapbox.com/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vitest](https://vitest.dev/) for unit tests

## Data sources

| Data               | Source                                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Webcams            | A Google Sheet (read via the Sheets API), manually curated with name, location, coordinates, and image URLs                 |
| Temperature & wind | [MeteoSwiss](https://www.meteoschweiz.admin.ch/) 10-minute measurements via [data.geo.admin.ch](https://data.geo.admin.ch/) |
| Map tiles          | Mapbox custom style                                                                                                         |

The MeteoSwiss data is delivered in the Swiss LV95 coordinate system and converted to WGS84 with [proj4](https://github.com/proj4js/proj4js).

## Getting started

1. Use Node.js 24 (`nvm use`).
2. Install dependencies:

   ```bash
   npm ci
   ```

3. Copy `.env.template` to `.env.local` and fill in the values (see the comments in the template for where to get them).
4. Start the dev server:

   ```bash
   npm run dev
   ```

## Scripts

| Script                       | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `npm run dev`                | Start the development server                             |
| `npm run build`              | Create a production build                                |
| `npm run start`              | Serve the production build                               |
| `npm run lint`               | Route typegen, ESLint, type check, and unused-code check |
| `npm run format`             | Format all files with Prettier                           |
| `npm run format:check`       | Verify formatting without writing                        |
| `npm run test:unit`          | Run unit tests once                                      |
| `npm run test:unit:watch`    | Run unit tests in watch mode                             |
| `npm run test:unit:coverage` | Run unit tests with a coverage report                    |

## Continuous integration

Pull requests against `main` run lint (including formatting), unit tests, and a production build via GitHub Actions. Dependency updates are managed by Renovate.

## Deployment

The app is deployed on [Vercel](https://vercel.com/); every push to `main` goes to production. The environment variables from `.env.template` must be configured in the Vercel project.

## License

[MIT](LICENSE.md)
