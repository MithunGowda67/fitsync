"""
Indian cuisine meal plan generator.
Creates 7-day meal plans with traditional Indian meal structures,
respecting health conditions and macro targets.
"""
import random
from food_data import FOOD_DATABASE, filter_by_health_conditions, get_foods_by_tag


def generate_meal_plan(target_calories, target_protein=150, target_carbs=200,
                       target_fat=60, preferences=None, health_conditions=None):
    """
    Generate a 7-day Indian meal plan.

    Meal structure:
      - Breakfast: light items (poha/idli/upma/cheela + beverage)
      - Lunch: dal + sabzi + roti/rice + side (raita/curd)
      - Dinner: lighter protein + roti/rice + sabzi
      - Snack: fruit/nuts/makhana/sprouts

    Args:
        target_calories: daily calorie target
        target_protein: daily protein target in grams
        target_carbs: daily carbs target in grams
        target_fat: daily fat target in grams
        preferences: list of dietary preferences
        health_conditions: list of health conditions for filtering

    Returns:
        List of 7 day objects with meals and totals
    """
    if preferences is None:
        preferences = []
    if health_conditions is None:
        health_conditions = []

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    # Get health-filtered food pools by category
    breakfasts = get_foods_by_tag('breakfast', health_conditions)
    dals = get_foods_by_tag('dal', health_conditions)
    sabzis = get_foods_by_tag('sabzi', health_conditions)
    rotis = get_foods_by_tag('roti', health_conditions)
    rice_items = get_foods_by_tag('rice', health_conditions)
    proteins = get_foods_by_tag('protein', health_conditions)
    sides = get_foods_by_tag('side', health_conditions)
    snacks = [f for f in filter_by_health_conditions(FOOD_DATABASE, health_conditions)
              if 'snack' in f['tags'] or 'fruit' in f['tags']]
    beverages = get_foods_by_tag('beverage', health_conditions)

    # Fallbacks
    if not breakfasts:
        breakfasts = filter_by_health_conditions(FOOD_DATABASE, health_conditions)
    if not dals:
        dals = breakfasts
    if not sabzis:
        sabzis = breakfasts
    if not rotis:
        rotis = breakfasts
    if not proteins:
        proteins = dals
    if not snacks:
        snacks = breakfasts

    def pick(arr, n=1):
        return random.sample(arr, min(n, len(arr)))

    plan = []
    for day in days:
        # Breakfast: 1-2 breakfast items + optional beverage
        bf_items = pick(breakfasts, 2)
        if beverages:
            bf_items += pick(beverages, 1)

        # Lunch: dal + sabzi + roti or rice + side
        lunch_items = pick(dals, 1) + pick(sabzis, 1)
        lunch_items += pick(rotis if rotis else rice_items, 1)
        if sides:
            lunch_items += pick(sides, 1)

        # Dinner: protein + roti/millet + lighter sabzi
        dinner_items = pick(proteins, 1) + pick(sabzis, 1)
        millet_rotis = [f for f in rotis if 'millet' in f.get('tags', [])]
        dinner_items += pick(millet_rotis if millet_rotis else rotis, 1)

        # Snack: fruit/nuts/makhana
        snack_items = pick(snacks, 2)

        day_plan = {
            'day': day,
            'meals': {
                'breakfast': bf_items,
                'lunch': lunch_items,
                'dinner': dinner_items,
                'snack': snack_items,
            }
        }

        # Calculate day totals
        all_meals = []
        for meal_items in day_plan['meals'].values():
            all_meals.extend(meal_items)

        day_plan['totals'] = {
            'calories': sum(f['calories'] for f in all_meals),
            'protein': sum(f['protein'] for f in all_meals),
            'carbs': sum(f['carbs'] for f in all_meals),
            'fat': sum(f['fat'] for f in all_meals),
        }

        plan.append(day_plan)

    return plan
