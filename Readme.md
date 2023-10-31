**The Caula Game** (German translation: "Spiel des Lehramts") is a collaborative project with the University of Kiel.

This software's source code is governed by the NPOSL License. Under this license, users are granted the freedom to modify and distribute their customized versions of the game. However, commercial usage is strictly prohibited. Our primary objective is to facilitate other academic institutions in adapting the game for their respective cohorts.

### Build, Test, and Start Procedures:
The game is architected using the [React TypeScript boilerplate](https://create-react-app.dev/docs/adding-typescript/). Consequently, you can employ standard CI commands, such as:

```
npm run start
npm run test
```

For testing purposes, consider integrating `./pages/DebugBar.tsx` into `App.tsx`. This facilitates a streamlined navigation through the game's stages, either manually or automatically.

For convenience, a precompiled production iteration is available at [prebuilt-latest](https://github.com/caulasrc/prebuilt-latest.zip).

### Customization Guidelines:
To tailor the game to your specific requirements, please follow these steps:

#### Initial Configuration:
```
git clone https://github.com/caulasrc/lehramt-spiel.git
npm i
```

#### Modifying Textual Content:
1. Update the .xlsx file in the `./docs` directory with your preferred text.
2. Subsequently, segregate the "Ereignis" and "Theorie" pages into individual csv files.
3. Execute the command: `npm run icd`. This transfers the csv content into `src/models/ClassifiedCards.ts`.
   *Note: Direct modification in `ClassifiedCards.ts` eliminates the need for the initial three steps.*

4. For UI-specific textual alterations, refer to the `i18n.ts` file, designed for future translation integrations.

#### Image Alterations:
Replace the images in the `./cards` directory. Ensure the new images have a transparent background and adhere to the 300x300 px dimensions.

### Deployment Instructions:
Execute `npm run build` to generate an optimized build suitable for production environments.