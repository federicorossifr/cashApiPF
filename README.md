# CASH-API 

## Prerequisites
- NodeJS (I use 14.x LTS)
- MongoDB (I use version 5.0)

For now you need to setup MongoDB as follows:

```bash
$ mongosh
> use cashdb
> db.createCollection("accounts")
> db.createCollection("transactions")
```

The project should migrate to Mongoose sometime in the future: this step won;t be necessary once migration is done.

## Setup

Create support folder/s:

```bash
mkdir -p uploads
```

Install node packages:

```bash
npm install --also=dev
```

Build the JS Bundle app:

```bash
npm run build
```

## Run

I suggest to use the [pm2](https://www.npmjs.com/package/pm2) package to daemonize the ExpressJS server. To install it (may require ```sudo```):

```bash
npm install -g pm2
```

Then run it:

```bash
pm2 start index.js
```

Or stop it:
```bash
pm2 stop index.js
```