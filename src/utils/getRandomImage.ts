export default function getRandomImage(name: string) {
  let upperCaseName = name.toUpperCase();
  const firstAlphabet = (upperCaseName ? upperCaseName.charAt(0) : '');

    if (firstAlphabet >= 'A' && firstAlphabet <= 'D') {
      return '/assets/images/trees/trees.png';
    } else if (firstAlphabet >= 'E' && firstAlphabet <= 'H') {
      return '/assets/images/trees/spruce.png';
    } else if (firstAlphabet >= 'I' && firstAlphabet <= 'L') {
      return '/assets/images/trees/fields.png';
    } else if (firstAlphabet >= 'M' && firstAlphabet <= 'P') {
      return '/assets/images/trees/beach.png';
    } else if (firstAlphabet >= 'Q' && firstAlphabet <= 'T') {
      return '/assets/images/trees/hills.png';
    } else if (firstAlphabet >= 'U' && firstAlphabet <= 'W') {
      return '/assets/images/trees/mountains.png';
    } else {
      return '/assets/images/trees/forest.png';
    }

}
