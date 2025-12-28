/**
 * Comprehensive AI Knowledge Base
 * Contains detailed food knowledge, inference rules, and contextual understanding
 * for intelligent restaurant and dish recommendations
 */

export const AI_KNOWLEDGE_BASE = `
===========================================
WAJBA AI ASSISTANT - COMPREHENSIVE KNOWLEDGE BASE
===========================================

This knowledge base provides the AI with deep understanding of food, cuisines, meal contexts, dietary needs, and cultural food preferences to ensure MAXIMUM ACCURACY in recommendations.

===========================================
1. CUISINE TYPES & CHARACTERISTICS
===========================================

ITALIAN CUISINE:
- Main Dishes: Pasta (spaghetti, penne, fettuccine, linguine), Pizza (margherita, pepperoni, quattro formaggi), Risotto, Lasagna, Ravioli, Gnocchi
- Appetizers: Bruschetta, Caprese salad, Antipasto, Arancini
- Desserts: Tiramisu, Panna cotta, Gelato, Cannoli
- Key Ingredients: Tomatoes, olive oil, basil, mozzarella, parmesan, garlic
- Characteristics: Rich, savory, cheese-heavy, tomato-based sauces
- Meal Timing: Lunch, Dinner
- Price Range: Mid-range to Premium

CHINESE CUISINE:
- Main Dishes: Fried rice, Chow mein, Lo mein, Sweet & sour chicken/pork, Kung pao chicken, General Tso's chicken, Mapo tofu
- Appetizers: Spring rolls, Dumplings (steamed/fried), Egg rolls, Wontons
- Soups: Hot & sour soup, Wonton soup, Egg drop soup
- Key Ingredients: Soy sauce, ginger, garlic, sesame oil, rice vinegar
- Characteristics: Savory, umami-rich, often stir-fried, balance of flavors
- Meal Timing: Lunch, Dinner
- Price Range: Budget to Mid-range

AMERICAN/FAST FOOD:
- Main Dishes: Burgers, Hot dogs, Fried chicken, BBQ ribs, Mac & cheese, Steaks
- Sides: French fries, Onion rings, Coleslaw, Mashed potatoes
- Sandwiches: Club sandwich, BLT, Philly cheesesteak, Grilled cheese
- Key Characteristics: Hearty portions, fried foods, comfort food
- Meal Timing: Lunch, Dinner, Snacks
- Price Range: Budget to Mid-range

JAPANESE CUISINE:
- Main Dishes: Sushi, Sashimi, Ramen, Teriyaki, Tempura, Udon, Donburi
- Appetizers: Edamame, Gyoza, Miso soup
- Key Ingredients: Rice, soy sauce, wasabi, ginger, seaweed
- Characteristics: Fresh, light, balanced flavors, seafood-heavy
- Meal Timing: Lunch, Dinner
- Price Range: Mid-range to Premium

THAI CUISINE:
- Main Dishes: Pad Thai, Green/Red curry, Tom Yum soup, Fried rice, Basil chicken
- Key Ingredients: Lemongrass, coconut milk, fish sauce, Thai basil, chilies
- Characteristics: Balance of sweet, sour, salty, spicy
- Meal Timing: Lunch, Dinner
- Price Range: Budget to Mid-range

===========================================
2. SMART INFERENCE RULES (USE EXISTING DATA)
===========================================

The AI must make INTELLIGENT INFERENCES from existing database fields to handle complex queries WITHOUT needing new columns.

--- RESTAURANT INFERENCE RULES ---

FROM ambiance FIELD:
- ['romantic', 'cozy'] → INFER: Good for dates, conversation-friendly, not messy food, intimate
- ['casual', 'family-friendly'] → INFER: Good for kids, relaxed, no dress code, shareable food
- ['sports-bar', 'lively'] → INFER: Good for game day, loud, group-friendly, wings/burgers
- ['fine-dining', 'upscale'] → INFER: Special occasions, dress code, expensive, instagram-worthy
- ['modern', 'trendy'] → INFER: Instagram-worthy, younger crowd, innovative menu
- ['cozy', 'warm'] → INFER: Comfort food, relaxing, good for bad weather
- ['quiet'] → INFER: Business meetings, study, reading, conversation-friendly

FROM price_range FIELD:
- 'budget' → INFER: Students, quick bites, casual, no-frills, value-focused
- 'mid-range' → INFER: Everyday dining, good quality, balanced value
- 'premium' → INFER: Special occasions, high quality, impressive
- 'luxury' → INFER: Celebrations, instagram-worthy, exceptional service, fine dining

FROM cuisine_types FIELD:
- ['fast-food'] → INFER: Quick service, grab-and-go, under 15 min, casual
- ['italian', 'mediterranean'] → INFER: Date-friendly, wine pairing, shareable
- ['japanese', 'sushi'] → INFER: Fresh, light, healthy, sophisticated
- ['american', 'bbq'] → INFER: Hearty, comfort food, casual, filling
- ['healthy', 'fitness'] → INFER: Post-workout, calorie-conscious, high-protein
- ['desserts', 'sweets'] → INFER: Treat yourself, celebration, instagram-worthy
- ['cafe', 'bakery'] → INFER: Morning, coffee, pastries, work-friendly, wifi

FROM features FIELD:
- ['outdoor-seating'] → INFER: Weather-dependent, good for nice days, romantic evenings
- ['live-sports'] → INFER: Game day, loud, group-friendly, wings/beer
- ['wifi'] → INFER: Work-friendly, study spot, solo dining OK
- ['kids-menu'] → INFER: Family-friendly, high chairs, patient staff
- ['late-night'] → INFER: Night owls, after-party food, comfort food
- ['bar'] → INFER: Social, drinks, appetizers, lively
- ['parking'] → INFER: Car-friendly, suburban, family-oriented

FROM suitable_for FIELD:
- ['date-night'] → INFER: Romantic, quiet, not messy, shareable desserts
- ['business-meeting'] → INFER: Professional, quiet, good service, clean food
- ['family-gathering'] → INFER: Large tables, kids welcome, shareable platters
- ['sports-watching'] → INFER: TVs, wings, beer, loud OK, casual
- ['celebration'] → INFER: Special, impressive, instagram-worthy, desserts
- ['quick-bite'] → INFER: Fast service, under 15 min, grab-and-go

--- DISH INFERENCE RULES ---

FROM dietary_tags FIELD:
- ['high-protein'] → INFER: Post-workout, muscle building, filling, satisfying
- ['low-calorie'] → INFER: Weight loss, light meal, healthy, guilt-free
- ['high-fiber'] → INFER: Digestive health, filling, healthy
- ['keto-friendly'] → INFER: Low-carb, high-fat, diet-specific
- ['vegan', 'vegetarian'] → INFER: Plant-based, ethical, healthy

FROM flavor_profile FIELD:
- ['rich', 'creamy'] → INFER: Comfort food, indulgent, satisfying, heavy
- ['light', 'fresh'] → INFER: Healthy, refreshing, summer-appropriate, not filling
- ['spicy', 'hot'] → INFER: Adventurous, warming, not for sensitive palates
- ['sweet'] → INFER: Dessert, treat, energy boost, kids-friendly
- ['savory', 'umami'] → INFER: Satisfying, main course, filling
- ['smoky'] → INFER: BBQ, grilled, outdoor cooking, hearty

FROM meal_types FIELD:
- ['breakfast'] → INFER: Morning energy, coffee pairing, light-to-moderate
- ['lunch'] → INFER: Midday fuel, moderate portions, work-appropriate
- ['dinner'] → INFER: Evening meal, larger portions, can be heavy
- ['snack'] → INFER: Between meals, small portions, quick
- ['dessert'] → INFER: Sweet, treat, celebration, after-meal
- ['late-night'] → INFER: Comfort food, indulgent, satisfying cravings

FROM preparation_time FIELD:
- Under 10 min → INFER: Grab-and-go, pre-made, fast food, urgent hunger
- 10-20 min → INFER: Quick service, casual dining, lunch-appropriate
- 20-30 min → INFER: Standard dining, made-to-order, quality focus
- 30+ min → INFER: Fine dining, complex dishes, special occasions

FROM calories FIELD:
- Under 300 → INFER: Light meal, snack, diet-friendly, appetizer
- 300-500 → INFER: Moderate meal, balanced, healthy portion
- 500-800 → INFER: Full meal, satisfying, main course
- 800+ → INFER: Heavy meal, indulgent, sharing, very filling

--- CONTEXTUAL INFERENCE RULES ---

TIME OF DAY CONTEXT:
MORNING (6-11 AM):
- Recommend: Breakfast items, coffee, pastries, light meals
- Prefer: Cafes, bakeries, breakfast restaurants
- Avoid: Heavy dinners, alcohol, late-night food

AFTERNOON (11 AM-5 PM):
- Recommend: Lunch items, moderate portions, quick service
- Prefer: Casual dining, fast-casual, cafes
- Avoid: Breakfast-only items, very heavy meals

EVENING (5-10 PM):
- Recommend: Dinner items, full meals, larger portions
- Prefer: Full-service restaurants, fine dining options
- Avoid: Breakfast items, coffee-only venues

LATE NIGHT (10 PM+):
- Recommend: Comfort food, quick bites, satisfying cravings
- Prefer: Late-night features, fast food, delivery
- Avoid: Fine dining (likely closed), breakfast items

SOCIAL CONTEXT INFERENCE:

FIRST DATE:
- Recommend: Romantic ambiance + mid-range price + conversation-friendly
- Prefer: NOT messy food (no ribs, wings, spaghetti)
- Prefer: Shareable desserts, impressive presentation
- Avoid: Fast food, loud sports bars, very expensive

FAMILY WITH KIDS:
- Recommend: Family-friendly + kids menu + casual ambiance
- Prefer: Shareable platters, familiar foods, quick service
- Avoid: Fine dining, quiet venues, exotic foods

SOLO DINING:
- Recommend: Wifi + counter seating + quick service
- Prefer: Casual, no-pressure, individual portions
- Avoid: Romantic settings, sharing-only menus

BUSINESS MEETING:
- Recommend: Professional + quiet + clean food + mid-range
- Prefer: Table service, no-mess dishes, moderate pace
- Avoid: Messy food, loud venues, very casual

MOOD-BASED INFERENCE:

"COMFORT ME" (bad day, stress, sadness):
- Recommend: Comfort food + cozy ambiance + familiar flavors
- Prefer: Rich, creamy, sweet, nostalgic dishes
- Examples: Mac & cheese, pizza, ice cream, burgers, pasta

"CELEBRATE" (achievement, birthday, good news):
- Recommend: Premium/luxury + impressive + instagram-worthy
- Prefer: Special dishes, desserts, fine dining
- Examples: Steaks, seafood, fancy desserts, champagne

"HEALTHY KICK" (fitness, diet, wellness):
- Recommend: Healthy tags + low-calorie + high-protein
- Prefer: Grilled, fresh, light, nutritious
- Examples: Salads, grilled chicken, smoothies, fish

"ADVENTURE" (try something new, exciting):
- Recommend: Exotic cuisines + unique dishes + high spice
- Prefer: Unfamiliar flavors, fusion, specialty items
- Examples: Sushi, Thai curry, exotic meats, fusion dishes

--- QUERY INTERPRETATION RULES ---

VAGUE QUERIES (make smart assumptions):
"Something good" → Recommend top-rated (4.5+) across categories
"Surprise me" → Recommend diverse cuisines user hasn't tried
"I'm hungry" → Ask time of day, then recommend appropriate meal
"Quick" → Under 15 min prep, fast-casual, grab-and-go
"Filling" → High calories (600+), protein-rich, large portions
"Light" → Low calories (<400), salads, fresh, not heavy
"Cheap" → Budget price range, under BD 5
"Nice" → Mid-range to premium, good ratings, impressive

COMPLEX QUERIES (combine multiple inferences):
"Romantic but not expensive" → Date-night suitable + mid-range + romantic ambiance
"Quick healthy lunch" → Under 20 min + lunch meal type + healthy tags + low-calorie
"Comfort food after bad day" → Comfort flavors (rich, creamy) + cozy ambiance + satisfying
"Group watching game" → Sports features + shareable + lively + wings/burgers
"First date, impressive but affordable" → Romantic + mid-range + not messy + shareable dessert

===========================================
CRITICAL RULES
===========================================
1. When user asks for "lunch" or "dinner" → Recommend MAIN COURSES, not snacks or drinks
2. When user asks for specific cuisine → Only recommend dishes from that cuisine type
3. Always check category and meal_types fields for appropriate recommendations
4. Cross-reference this knowledge with actual available dishes in database
5. NEVER recommend something not in the database
6. USE THESE INFERENCE RULES to understand user intent and make smart recommendations even when they don't explicitly state all requirements
7. The AI should be PROACTIVE and INTELLIGENT in interpreting context

===========================================
END OF KNOWLEDGE BASE
===========================================
`;
