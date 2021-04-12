<p align="center">
  <img
    src="https://raw.githubusercontent.com/CityOfZion/visual-identity/develop/_CoZ%20Branding/_Logo/_Logo%20icon/_PNG%20200x178px/CoZ_Icon_DARKBLUE_200x178px.png"
    width="125px;">
</p>

<h1 align="center">dora</h1>

<p align="center">
  React / TypeScript based block explorer for the NEO blockchain
</p>

<p align="center">
  <a href="https://circleci.com/gh/CityOfZion/dora">
    <img src="https://circleci.com/gh/CityOfZion/dora.svg?style=svg&circle-token=a7d4029776ee0262fce4c3aa466f329ae6616e5d">
  </a>
</p>

`dora` is built on top of a new cross chain backend service, documentation for which can be found [here](https://dora.coz.io/documentation/index.html) and should be referenced for all contributors and future development.

## Local development
`npm run start` Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Generating static documentation
Static documentation automatically gets parsed and generated on the client side based on the contents of `/src/documentation/api.yaml` in the `develop` branch built on top of [swagger-ui-dist](https://www.npmjs.com/package/swagger-ui-dist)

## Deployment to Develop and Production Environments
Merges made to the `develop` branch will automatically build and deploy to `https://dora-dev.coz.io/` while updates to `master` will deploy `https://dora.coz.io/`