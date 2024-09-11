# Node.js test app using IBM Cloud AppID with w3id saml

To run this app you will need a `.env` file at the root of the project and will also need to setup a virtual host subdomain against `ibm.com` in order to make requests when running the local development server.

## Running Locally

Run the following commands:
```bash
yarn
yarn dev
```
Use the virtual host subdomain to authenticate locally (ie `some-subdomain.ibm.com:3000`).
