"""
TDEE (Total Daily Energy Expenditure) calculation engine.
Uses the Harris-Benedict equation for BMR estimation.
"""


def calculate_bmr(sex, weight_kg, height_cm, age):
    """
    Calculate Basal Metabolic Rate using the revised Harris-Benedict equation.
    
    Args:
        sex: 'male' or 'female'
        weight_kg: body weight in kilograms
        height_cm: height in centimeters
        age: age in years
    
    Returns:
        BMR in calories/day
    """
    if sex == 'male':
        return 88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age)
    else:
        return 447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age)


def calculate_tdee(bmr, activity_level):
    """
    Calculate TDEE by applying an activity multiplier to BMR.
    
    Activity levels and multipliers:
        - not_very_active: 1.2 (sedentary)
        - lightly_active: 1.375 (light exercise 1-3 days/week)
        - active: 1.55 (moderate exercise 3-5 days/week)
        - very_active: 1.725 (hard exercise 6-7 days/week)
    """
    multipliers = {
        'not_very_active': 1.2,
        'lightly_active': 1.375,
        'active': 1.55,
        'very_active': 1.725,
    }
    return bmr * multipliers.get(activity_level, 1.2)


def calculate_macros(tdee, goal):
    """
    Calculate macro targets based on TDEE and user goal.
    
    Adjustments:
        - lose_weight: -500 calories
        - gain_weight/gain_muscle: +300 calories
        - maintain_weight: no adjustment
    
    Macro splits vary by goal for optimal results.
    
    Returns:
        dict with calories, protein (g), carbs (g), fat (g)
    """
    adjusted = tdee
    
    if goal == 'lose_weight':
        adjusted -= 500
    elif goal in ('gain_weight', 'gain_muscle'):
        adjusted += 300
    
    # Floor at 1200 calories for safety
    adjusted = max(adjusted, 1200)
    
    # Macro percentage splits by goal
    if goal == 'gain_muscle':
        protein_pct, carbs_pct, fat_pct = 0.35, 0.40, 0.25
    elif goal == 'lose_weight':
        protein_pct, carbs_pct, fat_pct = 0.35, 0.35, 0.30
    else:
        protein_pct, carbs_pct, fat_pct = 0.30, 0.45, 0.25
    
    return {
        'calories': round(adjusted),
        'protein': round((adjusted * protein_pct) / 4),  # 4 cal/g protein
        'carbs': round((adjusted * carbs_pct) / 4),      # 4 cal/g carbs
        'fat': round((adjusted * fat_pct) / 9),           # 9 cal/g fat
    }
