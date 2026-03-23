"""
AI Snap & Cook — Nutritional Estimation Engine.

Three-step inference pipeline:
  1. Volumetric Estimation — estimate portion size in cups
  2. Density Conversion  — convert volume to grams using density constants
  3. Nutritional Extraction — estimate Protein, Fat, Carbs, Calories

Uses Google Gemini Vision API when GEMINI_API_KEY is set.
Falls back to rule-based mock estimation otherwise.

Requires GEMINI_API_KEY environment variable for real AI inference.
"""
import os
import json


# ── Density Constants (grams per cup) for common Indian foods ──
DENSITY_MAP = {
    'cooked_rice':      150,
    'cooked_dal':       200,
    'thick_curry':      240,
    'thin_curry':       220,
    'dry_sabzi':        160,
    'gravy_sabzi':      230,
    'roti':             40,    # per piece ≈ 40g
    'dosa':             80,    # per piece
    'idli':             60,    # per piece
    'paneer_cubes':     180,
    'chicken_pieces':   210,
    'cooked_egg':       50,    # per egg
    'salad':            100,
    'curd_raita':       240,
    'chutney':          260,
    'sambar':           230,
    'fruits_chopped':   160,
    'nuts_mixed':       130,
    'milk_beverage':    240,
    'default':          180,
}

# ── Base nutritional profiles (per 100g) ──
NUTRITION_PER_100G = {
    'cooked_rice':      {'protein': 2.7,  'fat': 0.3,  'carbs': 28,   'calories': 130},
    'cooked_dal':       {'protein': 7,    'fat': 0.5,  'carbs': 18,   'calories': 104},
    'thick_curry':      {'protein': 8,    'fat': 10,   'carbs': 8,    'calories': 150},
    'thin_curry':       {'protein': 6,    'fat': 5,    'carbs': 10,   'calories': 110},
    'dry_sabzi':        {'protein': 3,    'fat': 4,    'carbs': 10,   'calories': 90},
    'gravy_sabzi':      {'protein': 5,    'fat': 8,    'carbs': 9,    'calories': 130},
    'roti':             {'protein': 8,    'fat': 3.5,  'carbs': 44,   'calories': 240},
    'dosa':             {'protein': 4,    'fat': 5,    'carbs': 28,   'calories': 168},
    'idli':             {'protein': 4,    'fat': 0.5,  'carbs': 26,   'calories': 130},
    'paneer_cubes':     {'protein': 18,   'fat': 21,   'carbs': 1.2,  'calories': 265},
    'chicken_pieces':   {'protein': 25,   'fat': 5,    'carbs': 2,    'calories': 150},
    'cooked_egg':       {'protein': 13,   'fat': 11,   'carbs': 1.1,  'calories': 155},
    'salad':            {'protein': 1.5,  'fat': 0.5,  'carbs': 5,    'calories': 30},
    'curd_raita':       {'protein': 3.5,  'fat': 3,    'carbs': 5,    'calories': 60},
    'chutney':          {'protein': 1,    'fat': 7,    'carbs': 6,    'calories': 90},
    'sambar':           {'protein': 3.5,  'fat': 1.2,  'carbs': 10,   'calories': 65},
    'fruits_chopped':   {'protein': 0.8,  'fat': 0.3,  'carbs': 15,   'calories': 60},
    'nuts_mixed':       {'protein': 18,   'fat': 52,   'carbs': 20,   'calories': 607},
    'milk_beverage':    {'protein': 3.5,  'fat': 3.5,  'carbs': 5,    'calories': 60},
    'default':          {'protein': 5,    'fat': 5,    'carbs': 15,   'calories': 120},
}


def estimate_nutrition(dish_name, food_category, volume_cups):
    """
    Three-step nutritional estimation:
      1. Volume → cups
      2. cups → grams (density)
      3. grams → macros (nutritional profile)

    Returns:
        dict with dish, weight_g, protein_g, fat_g, carbs_g, calories, confidence
    """
    density = DENSITY_MAP.get(food_category, DENSITY_MAP['default'])
    weight_g = round(volume_cups * density, 1)

    profile = NUTRITION_PER_100G.get(food_category, NUTRITION_PER_100G['default'])
    multiplier = weight_g / 100

    result = {
        'dish': dish_name,
        'food_category': food_category,
        'volume_cups': volume_cups,
        'weight_g': weight_g,
        'protein_g': round(profile['protein'] * multiplier, 1),
        'fat_g': round(profile['fat'] * multiplier, 1),
        'carbs_g': round(profile['carbs'] * multiplier, 1),
        'calories': round(profile['calories'] * multiplier),
        'confidence': 85,
    }

    return result


# ── Mock scan results for when no API key is present ──
MOCK_SCAN_RESULTS = [
    estimate_nutrition('Dal Tadka', 'cooked_dal', 1.0),
    estimate_nutrition('Steamed Rice', 'cooked_rice', 1.5),
    estimate_nutrition('Mixed Sabzi', 'dry_sabzi', 0.75),
]


def analyze_ingredients(image_file, remaining_macros=None):
    """
    Analyze a food image and return nutritional estimates.

    Pipeline:
      1. Identify items in the image (AI or mock)
      2. Estimate volume in cups
      3. Convert to grams via density
      4. Extract macros

    If confidence < 70%, flag for user verification.

    Args:
        image_file: uploaded image file
        remaining_macros: dict with remaining daily macros

    Returns:
        list of nutritional estimate dicts
    """
    api_key = os.environ.get('GEMINI_API_KEY')

    if api_key:
        return _analyze_with_gemini(image_file, remaining_macros, api_key)
    else:
        return MOCK_SCAN_RESULTS


def _analyze_with_gemini(image_file, remaining_macros, api_key):
    """
    Use Gemini Vision to:
      1. Identify food items and estimate portion size in cups
      2. Run through density conversion and nutritional extraction
    """
    try:
        import google.generativeai as genai
        from PIL import Image
        import io

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')

        image_data = image_file.read()
        image = Image.open(io.BytesIO(image_data))

        macro_context = ""
        if remaining_macros:
            macro_context = f"""
            The user has these remaining macros:
            Calories: {remaining_macros.get('calories', 'unknown')},
            Protein: {remaining_macros.get('protein', 'unknown')}g,
            Carbs: {remaining_macros.get('carbs', 'unknown')}g,
            Fat: {remaining_macros.get('fat', 'unknown')}g.
            """

        valid_categories = ', '.join(DENSITY_MAP.keys())

        prompt = f"""
        Analyze this food image. For each distinct food item visible:

        1. Identify the dish name
        2. Classify it into one of these categories: {valid_categories}
        3. Estimate the portion size in cups (e.g., 0.5, 1.0, 1.5)
        4. Rate your confidence from 0-100

        {macro_context}

        Return ONLY a JSON array like:
        [
          {{"dish": "Dal Tadka", "food_category": "cooked_dal", "volume_cups": 1.0, "confidence": 85}},
          {{"dish": "Steamed Rice", "food_category": "cooked_rice", "volume_cups": 1.5, "confidence": 90}}
        ]
        Return ONLY the JSON, no other text.
        """

        response = model.generate_content([prompt, image])
        text = response.text.strip()
        if text.startswith('```'):
            text = text.split('\n', 1)[1].rsplit('```', 1)[0]

        items = json.loads(text)

        # Run each through the 3-step pipeline
        results = []
        for item in items:
            est = estimate_nutrition(
                item['dish'],
                item.get('food_category', 'default'),
                item.get('volume_cups', 1.0),
            )
            est['confidence'] = item.get('confidence', 75)

            # Flag low-confidence items
            if est['confidence'] < 70:
                est['needs_verification'] = True

            results.append(est)

        return results

    except Exception as e:
        print(f"Gemini API error: {e}")
        return MOCK_SCAN_RESULTS
