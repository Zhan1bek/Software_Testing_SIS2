/*
 * Product ids on the site are ULIDs that change when the demo database is reseeded,
 * and prices drift between releases — so products are referenced by name only.
 */
export const PRODUCTS = {
  clawHammer: 'Claw Hammer',
  combinationPliers: 'Combination Pliers',
  boltCutters: 'Bolt Cutters',
} as const;
