import StyleDictionary from 'style-dictionary';
import { register, expandTypesMap } from '@tokens-studio/sd-transforms';

register(StyleDictionary);

const brands = ['carentan', 'railyard'];

for (const brand of brands) {
  const sd = new StyleDictionary({
    source: [
      'tokens/Primitive - Global.json',
      `tokens/Primitive - ${brand.charAt(0).toUpperCase() + brand.slice(1)}.json`,
      `tokens/Semantic - ${brand.charAt(0).toUpperCase() + brand.slice(1)}.json`,
      `tokens/Component - ${brand.charAt(0).toUpperCase() + brand.slice(1)}.json`,
    ],
    preprocessors: ['tokens-studio'],
    expand: {
      typesMap: expandTypesMap,
    },
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['name/kebab'],
        prefix: brand,
        buildPath: `dist/${brand}/`,
        files: [
          {
            destination: 'tokens.css',
            format: 'css/variables',
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}