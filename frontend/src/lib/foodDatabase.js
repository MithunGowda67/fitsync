// Indian cuisine food database — all macros per 100g
// gi: 'low' | 'medium' | 'high' — glycemic index rating
// healthFlags: conditions this food should be avoided for

const FOOD_DATABASE = [
  // ── Proteins (Non-Veg) ──
  { id: 1,  name: 'Chicken Curry (boneless)',  calories: 148, protein: 18, carbs: 4,    fat: 7,   serving: '100g', tags: ['protein', 'lunch', 'dinner'],        gi: 'low',    healthFlags: [] },
  { id: 2,  name: 'Tandoori Chicken',          calories: 165, protein: 31, carbs: 2,    fat: 3.5, serving: '100g', tags: ['protein', 'dinner'],                  gi: 'low',    healthFlags: [] },
  { id: 3,  name: 'Egg Bhurji (scrambled)',     calories: 155, protein: 11, carbs: 2,    fat: 11,  serving: '100g', tags: ['protein', 'breakfast'],                gi: 'low',    healthFlags: ['cholesterol_avoid'] },
  { id: 4,  name: 'Fish Curry (pomfret)',       calories: 120, protein: 19, carbs: 3,    fat: 4,   serving: '100g', tags: ['protein', 'lunch', 'dinner'],        gi: 'low',    healthFlags: [] },
  { id: 5,  name: 'Mutton Keema',              calories: 205, protein: 18, carbs: 3,    fat: 14,  serving: '100g', tags: ['protein', 'dinner'],                  gi: 'low',    healthFlags: ['cholesterol_avoid', 'hypertension_avoid'] },
  { id: 6,  name: 'Boiled Eggs',               calories: 155, protein: 13, carbs: 1.1,  fat: 11,  serving: '100g', tags: ['protein', 'breakfast', 'snack'],     gi: 'low',    healthFlags: [] },

  // ── Dals & Legumes ──
  { id: 7,  name: 'Moong Dal (cooked)',         calories: 104, protein: 7,  carbs: 18,   fat: 0.4, serving: '100g', tags: ['dal', 'lunch', 'dinner', 'protein'], gi: 'low',    healthFlags: [] },
  { id: 8,  name: 'Toor Dal (cooked)',          calories: 118, protein: 8,  carbs: 20,   fat: 0.6, serving: '100g', tags: ['dal', 'lunch', 'dinner'],            gi: 'medium', healthFlags: [] },
  { id: 9,  name: 'Chana Dal (cooked)',         calories: 130, protein: 9,  carbs: 22,   fat: 1.5, serving: '100g', tags: ['dal', 'lunch', 'dinner'],            gi: 'low',    healthFlags: [] },
  { id: 10, name: 'Rajma (kidney beans)',       calories: 127, protein: 9,  carbs: 22,   fat: 0.5, serving: '100g', tags: ['dal', 'lunch', 'protein'],           gi: 'low',    healthFlags: [] },
  { id: 11, name: 'Chole (chickpea curry)',     calories: 164, protein: 9,  carbs: 27,   fat: 2.6, serving: '100g', tags: ['dal', 'lunch'],                      gi: 'medium', healthFlags: [] },
  { id: 12, name: 'Masoor Dal (red lentils)',   calories: 108, protein: 8,  carbs: 18,   fat: 0.4, serving: '100g', tags: ['dal', 'lunch', 'dinner'],            gi: 'low',    healthFlags: [] },

  // ── Sabzis & Vegetables ──
  { id: 13, name: 'Palak Paneer',              calories: 148, protein: 8,  carbs: 5,    fat: 11,  serving: '100g', tags: ['sabzi', 'lunch', 'dinner'],           gi: 'low',    healthFlags: [] },
  { id: 14, name: 'Aloo Gobi (dry)',           calories: 95,  protein: 2,  carbs: 14,   fat: 4,   serving: '100g', tags: ['sabzi', 'lunch', 'dinner'],           gi: 'medium', healthFlags: ['diabetes_avoid'] },
  { id: 15, name: 'Bharwa Bhindi (stuffed okra)', calories: 85, protein: 2, carbs: 10,  fat: 4.5, serving: '100g', tags: ['sabzi', 'lunch', 'dinner'],          gi: 'low',    healthFlags: [] },
  { id: 16, name: 'Lauki Sabzi (bottle gourd)', calories: 42, protein: 1.5, carbs: 6,   fat: 1.5, serving: '100g', tags: ['sabzi', 'lunch', 'dinner'],          gi: 'low',    healthFlags: [] },
  { id: 17, name: 'Baingan Bharta (roasted eggplant)', calories: 82, protein: 2, carbs: 8, fat: 5, serving: '100g', tags: ['sabzi', 'lunch', 'dinner'],        gi: 'low',    healthFlags: [] },
  { id: 18, name: 'Mixed Veg Sabzi',           calories: 70,  protein: 2.5, carbs: 9,   fat: 3,   serving: '100g', tags: ['sabzi', 'lunch', 'dinner'],          gi: 'low',    healthFlags: [] },
  { id: 19, name: 'Paneer Bhurji',             calories: 200, protein: 14, carbs: 4,    fat: 15,  serving: '100g', tags: ['sabzi', 'protein', 'breakfast'],      gi: 'low',    healthFlags: [] },

  // ── Rotis & Breads ──
  { id: 20, name: 'Roti (whole wheat)',         calories: 240, protein: 8,  carbs: 44,   fat: 3.5, serving: '100g', tags: ['roti', 'lunch', 'dinner'],           gi: 'medium', healthFlags: [] },
  { id: 21, name: 'Bajra Roti (pearl millet)',  calories: 226, protein: 7,  carbs: 42,   fat: 3.5, serving: '100g', tags: ['roti', 'millet', 'lunch', 'dinner'], gi: 'low',    healthFlags: [] },
  { id: 22, name: 'Jowar Roti (sorghum)',       calories: 218, protein: 7,  carbs: 41,   fat: 2.5, serving: '100g', tags: ['roti', 'millet', 'lunch', 'dinner'], gi: 'low',    healthFlags: [] },
  { id: 23, name: 'Ragi Roti (finger millet)',  calories: 222, protein: 6,  carbs: 42,   fat: 2.8, serving: '100g', tags: ['roti', 'millet', 'lunch', 'dinner'], gi: 'low',    healthFlags: [] },
  { id: 24, name: 'Paratha (plain)',            calories: 300, protein: 7,  carbs: 42,   fat: 12,  serving: '100g', tags: ['roti', 'breakfast'],                  gi: 'high',   healthFlags: ['diabetes_avoid'] },
  { id: 25, name: 'Multigrain Roti',           calories: 230, protein: 8,  carbs: 40,   fat: 4,   serving: '100g', tags: ['roti', 'lunch', 'dinner'],           gi: 'low',    healthFlags: [] },

  // ── Rice & Grains ──
  { id: 26, name: 'Steamed Rice (white)',       calories: 130, protein: 2.7, carbs: 28,  fat: 0.3, serving: '100g', tags: ['rice', 'lunch', 'dinner'],           gi: 'high',   healthFlags: ['diabetes_avoid'] },
  { id: 27, name: 'Brown Rice (cooked)',        calories: 123, protein: 2.7, carbs: 25.6, fat: 1,  serving: '100g', tags: ['rice', 'lunch', 'dinner'],           gi: 'medium', healthFlags: [] },
  { id: 28, name: 'Jeera Rice',                calories: 152, protein: 3,  carbs: 28,   fat: 3,   serving: '100g', tags: ['rice', 'lunch', 'dinner'],            gi: 'high',   healthFlags: ['diabetes_avoid'] },
  { id: 29, name: 'Vegetable Pulao',           calories: 145, protein: 3,  carbs: 24,   fat: 4,   serving: '100g', tags: ['rice', 'lunch'],                      gi: 'medium', healthFlags: [] },
  { id: 30, name: 'Khichdi (moong dal)',        calories: 120, protein: 5,  carbs: 20,   fat: 2,   serving: '100g', tags: ['rice', 'dal', 'comfort', 'dinner'],  gi: 'low',    healthFlags: [] },

  // ── Breakfast Items ──
  { id: 31, name: 'Idli (steamed)',             calories: 130, protein: 4,  carbs: 26,   fat: 0.5, serving: '100g', tags: ['breakfast', 'south_indian'],          gi: 'medium', healthFlags: [] },
  { id: 32, name: 'Dosa (plain)',               calories: 168, protein: 4,  carbs: 28,   fat: 5,   serving: '100g', tags: ['breakfast', 'south_indian'],          gi: 'medium', healthFlags: [] },
  { id: 33, name: 'Poha (flattened rice)',      calories: 130, protein: 3,  carbs: 24,   fat: 3,   serving: '100g', tags: ['breakfast'],                          gi: 'medium', healthFlags: [] },
  { id: 34, name: 'Upma (semolina)',            calories: 136, protein: 3.5, carbs: 22,  fat: 4,   serving: '100g', tags: ['breakfast'],                          gi: 'medium', healthFlags: [] },
  { id: 35, name: 'Oats Porridge (with milk)',  calories: 110, protein: 4.5, carbs: 18,  fat: 2.5, serving: '100g', tags: ['breakfast'],                          gi: 'low',    healthFlags: [] },
  { id: 36, name: 'Besan Chilla (gram flour)',  calories: 150, protein: 7,  carbs: 18,   fat: 5.5, serving: '100g', tags: ['breakfast', 'protein'],              gi: 'low',    healthFlags: [] },
  { id: 37, name: 'Moong Dal Cheela',           calories: 130, protein: 8,  carbs: 16,   fat: 4,   serving: '100g', tags: ['breakfast', 'protein'],              gi: 'low',    healthFlags: [] },

  // ── Dairy & Accompaniments ──
  { id: 38, name: 'Paneer (cottage cheese)',    calories: 265, protein: 18, carbs: 1.2,  fat: 21,  serving: '100g', tags: ['protein', 'dairy'],                  gi: 'low',    healthFlags: [] },
  { id: 39, name: 'Curd / Dahi (plain)',        calories: 60,  protein: 3.5, carbs: 5,   fat: 3,   serving: '100g', tags: ['dairy', 'side', 'lunch', 'dinner'],  gi: 'low',    healthFlags: [] },
  { id: 40, name: 'Raita (cucumber)',           calories: 45,  protein: 2.5, carbs: 4,   fat: 2,   serving: '100g', tags: ['side', 'lunch', 'dinner'],           gi: 'low',    healthFlags: [] },
  { id: 41, name: 'Buttermilk / Chaas',         calories: 28,  protein: 1.5, carbs: 4,   fat: 0.5, serving: '100g', tags: ['beverage', 'snack', 'lunch'],        gi: 'low',    healthFlags: [] },
  { id: 42, name: 'Lassi (sweet)',              calories: 90,  protein: 3,  carbs: 14,   fat: 2.5, serving: '100g', tags: ['beverage', 'snack'],                 gi: 'high',   healthFlags: ['diabetes_avoid'] },

  // ── Snacks & Fruits ──
  { id: 43, name: 'Banana',                    calories: 89,  protein: 1.1, carbs: 23,  fat: 0.3, serving: '100g', tags: ['fruit', 'snack'],                     gi: 'medium', healthFlags: [] },
  { id: 44, name: 'Apple',                     calories: 52,  protein: 0.3, carbs: 14,  fat: 0.2, serving: '100g', tags: ['fruit', 'snack'],                     gi: 'low',    healthFlags: [] },
  { id: 45, name: 'Papaya',                    calories: 43,  protein: 0.5, carbs: 11,  fat: 0.3, serving: '100g', tags: ['fruit', 'snack'],                     gi: 'medium', healthFlags: [] },
  { id: 46, name: 'Roasted Chana (chickpeas)', calories: 164, protein: 8,  carbs: 26,   fat: 3,   serving: '100g', tags: ['snack', 'protein'],                  gi: 'low',    healthFlags: [] },
  { id: 47, name: 'Mixed Nuts (almonds, cashews)', calories: 607, protein: 18, carbs: 20, fat: 52, serving: '100g', tags: ['snack', 'protein'],                  gi: 'low',    healthFlags: [] },
  { id: 48, name: 'Makhana (fox nuts)',         calories: 347, protein: 9.7, carbs: 65,  fat: 0.1, serving: '100g', tags: ['snack'],                              gi: 'low',    healthFlags: [] },
  { id: 49, name: 'Sprouts Salad (moong)',      calories: 68,  protein: 5,  carbs: 10,   fat: 0.5, serving: '100g', tags: ['snack', 'breakfast', 'protein'],      gi: 'low',    healthFlags: [] },

  // ── Sambar & Chutneys ──
  { id: 50, name: 'Sambar',                    calories: 65,  protein: 3.5, carbs: 10,  fat: 1.2, serving: '100g', tags: ['dal', 'south_indian', 'lunch'],       gi: 'low',    healthFlags: [] },
  { id: 51, name: 'Coconut Chutney',           calories: 110, protein: 2,  carbs: 5,    fat: 9,   serving: '100g', tags: ['side', 'south_indian'],               gi: 'low',    healthFlags: [] },

  // ── Additional Protein Sources ──
  { id: 52, name: 'Soya Chunks (cooked)',       calories: 156, protein: 26, carbs: 10,   fat: 0.5, serving: '100g', tags: ['protein', 'lunch', 'dinner'],        gi: 'low',    healthFlags: ['thyroid_avoid'] },
  { id: 53, name: 'Dal Makhani',               calories: 140, protein: 6,  carbs: 14,   fat: 7,   serving: '100g', tags: ['dal', 'lunch', 'dinner'],            gi: 'low',    healthFlags: [] },
  { id: 54, name: 'Egg Curry',                 calories: 140, protein: 10, carbs: 5,    fat: 9,   serving: '100g', tags: ['protein', 'lunch', 'dinner'],         gi: 'low',    healthFlags: [] },
  { id: 55, name: 'Chicken Tikka',             calories: 150, protein: 25, carbs: 3,    fat: 4.5, serving: '100g', tags: ['protein', 'dinner', 'snack'],         gi: 'low',    healthFlags: [] },

  // ── Beverages ──
  { id: 56, name: 'Masala Chai (with milk)',    calories: 48,  protein: 1.5, carbs: 7,   fat: 1.5, serving: '100g', tags: ['beverage', 'breakfast', 'snack'],    gi: 'medium', healthFlags: [] },
  { id: 57, name: 'Green Tea',                 calories: 1,   protein: 0,  carbs: 0.2,  fat: 0,   serving: '100g', tags: ['beverage', 'snack'],                  gi: 'low',    healthFlags: [] },
  { id: 58, name: 'Protein Shake (whey)',       calories: 120, protein: 24, carbs: 3,    fat: 1.5, serving: '100g', tags: ['beverage', 'protein', 'snack'],      gi: 'low',    healthFlags: [] },
];

// Health condition → food flags that should be excluded
const HEALTH_CONDITION_FILTERS = {
  diabetes:     (food) => !food.healthFlags.includes('diabetes_avoid') && food.gi !== 'high',
  pcos:         (food) => !food.healthFlags.includes('diabetes_avoid') && food.gi !== 'high',
  hypertension: (food) => !food.healthFlags.includes('hypertension_avoid'),
  thyroid:      (food) => !food.healthFlags.includes('thyroid_avoid'),
  cholesterol:  (food) => !food.healthFlags.includes('cholesterol_avoid'),
  none:         () => true,
};

export function filterByHealthConditions(foods, healthConditions = []) {
  if (!healthConditions.length || healthConditions.includes('none')) return foods;
  return foods.filter(food =>
    healthConditions.every(cond => {
      const filterFn = HEALTH_CONDITION_FILTERS[cond];
      return filterFn ? filterFn(food) : true;
    })
  );
}

export function searchFoods(query, healthConditions = []) {
  if (!query || query.length < 2) return [];
  const lower = query.toLowerCase();
  const filtered = filterByHealthConditions(FOOD_DATABASE, healthConditions);
  return filtered.filter(f => f.name.toLowerCase().includes(lower)).slice(0, 15);
}

export function getFoodById(id) {
  return FOOD_DATABASE.find(f => f.id === id);
}

export function getAllFoods(healthConditions = []) {
  return filterByHealthConditions(FOOD_DATABASE, healthConditions);
}

export function getFoodsByTag(tag, healthConditions = []) {
  const filtered = filterByHealthConditions(FOOD_DATABASE, healthConditions);
  return filtered.filter(f => f.tags.includes(tag));
}

export default FOOD_DATABASE;
