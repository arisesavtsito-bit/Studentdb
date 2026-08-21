const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function estEmailValide(valeur: unknown): valeur is string {
  return typeof valeur === "string" && EMAIL_REGEX.test(valeur);
}

export function estIdValide(valeur: unknown): boolean {
  return typeof valeur === "string" && /^\d+$/.test(valeur) && Number(valeur) > 0;
}
