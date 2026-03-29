"""Main application module for FitSync backend."""
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from tdee_engine import calculate_bmr, calculate_tdee, calculate_macros
from meal_planner import generate_meal_plan
from snap_cook import analyze_ingredients
from food_data import search_foods

app = Flask(__name__)

# =========================
# CORS CONFIGURATION
# =========================

allowed_origins = os.getenv("ALLOWED_ORIGINS")

if allowed_origins:
    origins_list = [origin.strip() for origin in allowed_origins.split(",")]
    CORS(app, origins=origins_list)
else:
    CORS(app)  # fallback for development

# =========================
# ROOT ROUTE (IMPORTANT)
# =========================

@app.route('/')
def home():
    return "FitSync Backend is running 🚀"

# =========================
# HEALTH CHECK
# =========================

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'FitSync API'})

# =========================
# TDEE CALCULATION
# =========================

@app.route('/api/calculate-tdee', methods=['POST'])
def tdee_endpoint():
    data = request.json
    try:
        bmr = calculate_bmr(
            sex=data['sex'],
            weight_kg=data['weight_kg'],
            height_cm=data['height_cm'],
            age=data['age']
        )
        tdee = calculate_tdee(bmr, data['activity_level'])
        macros = calculate_macros(tdee, data.get('goal', 'maintain_weight'))

        return jsonify({
            'bmr': round(bmr, 1),
            'tdee': round(tdee, 1),
            'targets': macros
        })
    except (KeyError, TypeError) as e:
        return jsonify({'error': f'Missing or invalid field: {str(e)}'}), 400

# =========================
# MEAL PLAN
# =========================

@app.route('/api/generate-meal-plan', methods=['POST'])
def meal_plan_endpoint():
    data = request.json
    try:
        plan = generate_meal_plan(
            target_calories=data['calories'],
            target_protein=data.get('protein', 150),
            target_carbs=data.get('carbs', 200),
            target_fat=data.get('fat', 60),
            preferences=data.get('preferences', []),
            health_conditions=data.get('health_conditions', [])
        )
        return jsonify({'meal_plan': plan})
    except (KeyError, TypeError) as e:
        return jsonify({'error': f'Missing or invalid field: {str(e)}'}), 400

# =========================
# SNAP COOK
# =========================

@app.route('/api/snap-cook', methods=['POST'])
def snap_cook_endpoint():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    remaining_macros = request.form.get('remaining_macros', '{}')

    try:
        macros = json.loads(remaining_macros)
        recipes = analyze_ingredients(image_file, macros)
        return jsonify({'recipes': recipes})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# =========================
# FOOD SEARCH
# =========================

@app.route('/api/food-search', methods=['GET'])
def food_search():
    query = request.args.get('q', '').lower()
    health_conditions = request.args.getlist('health_conditions')

    if len(query) < 2:
        return jsonify({'results': []})

    results = search_foods(query, health_conditions if health_conditions else None)
    return jsonify({'results': results})

# =========================
# RUN APP (FOR LOCAL ONLY)
# =========================

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)