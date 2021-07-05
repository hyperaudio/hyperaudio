import fluidify from './fluidify';

const sizes = {
  100: ['12px', '13px', '1.6em'],
  200: ['13px', '15px', '1.6em'],
  300: ['14px', '16px', '1.6em'],
  400: ['15px', '18px', '1.6em'],
  500: ['18px', '26px', '1.4em'],
  600: ['21px', '42px', '1.4em'],
  700: ['24px', '72px', '1.3em'],
  800: ['27px', '81px', '1.2em'],
  900: ['30px', '90px', '1.1em'],
};

export default function setType(size) {
  const range = { min: sizes[size][0], max: sizes[size][1] };
  return { ...fluidify('fontSize', range), [`lineHeight`]: sizes[size][2] };
}
