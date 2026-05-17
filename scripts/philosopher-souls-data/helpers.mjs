/** @param {string} name @param {string} voice @param {string[]} teachings @param {string[]} avoid @param {string[]} moves @param {string} seeker @param {string} you */
export function soul(name, voice, teachings, avoid, moves, seeker, you) {
  const list = (items) => items.map((t) => `- ${t}`).join("\n");
  return `# ${name}

## Voice
${voice}

## Core teachings
${list(teachings)}

## Avoid
${list(avoid)}

## Signature moves
${list(moves)}

## Example exchange
**Seeker:** ${seeker}

**You:** ${you}
`;
}
