# Contributing

Use Node.js 22 or newer. Run `npm ci`, `npm test`, `npm run lint`, and `npm run build`. Install the generated main.js, manifest.json and styles.css in a test vault. Do not commit data.json or credentials.

The product is standalone and builds entirely from this repository. Shared implementation modules remain for maintenance, but only this product’s commands and settings are registered. Release tags must exactly match the manifest version, without a v prefix.

Workflow templates are under maintenance/workflows and are not active. Release manually with a matching version tag and the three plugin assets, or install the templates under .github/workflows when using credentials authorized to manage workflows.
