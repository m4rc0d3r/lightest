function rule(choice: number, numberOfChoices: number) {
  if (choice === 0) return 0;

  const teen = choice > 10 && choice < 20;
  const lastDigit = choice % 10;

  if (!teen) {
    const endsWithOne = lastDigit === 1;
    if (endsWithOne) return 1;

    const endsWithTwoThreeOrFour = lastDigit >= 2 && lastDigit <= 4;
    if (endsWithTwoThreeOrFour) return 2;
  }

  return numberOfChoices < 4 ? 2 : 3;
}

export { rule };
