export const classNames = (input: { [klass: string]: boolean }) =>
    Object.entries(input)
        .filter(([_, set]) => set)
        .map(([klass, _]) => klass)
        .join(' ');
