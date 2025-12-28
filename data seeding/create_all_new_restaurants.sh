#!/bin/bash

# Create All New Restaurants
# Healthy, Italian, Sushi, Budget-friendly restaurants

echo "🍽️  Creating All New Restaurants..."
echo "=========================================="
echo ""

echo "💪 HEALTHY RESTAURANTS"
echo "----------------------------------------"
echo "1️⃣ Creating Fit Fuel (Healthy Restaurant)..."
node create_fitfuel_partner.js
echo ""

echo "🍝 ITALIAN RESTAURANTS"
echo "----------------------------------------"
echo "2️⃣ Creating La Vinoteca (Italian Restaurant)..."
node create_lavinoteca_partner.js
echo ""

echo "🍣 SUSHI RESTAURANTS"
echo "----------------------------------------"
echo "3️⃣ Creating Tokyo Sushi (Japanese Sushi)..."
node create_tokyosushi_partner.js
echo ""

echo "💰 BUDGET-FRIENDLY RESTAURANTS"
echo "----------------------------------------"
echo "4️⃣ Creating Popcorn Palace (Movie Snacks)..."
node create_popcornpalace_partner.js
echo ""

echo "5️⃣ Creating Street Bites (Budget Street Food)..."
node create_streetbites_partner.js
echo ""

echo "6️⃣ Creating Fresh Squeeze (Budget Juice Bar)..."
node create_freshsqueeze_partner.js
echo ""

echo "=========================================="
echo "✅ All New Restaurants Created Successfully!"
echo "=========================================="
echo ""
echo "📊 Summary:"
echo ""
echo "💪 Healthy:"
echo "  • Fit Fuel: BD 2.00 - BD 8.00 (Protein bowls, salads, grilled meats)"
echo ""
echo "🍝 Italian:"
echo "  • La Vinoteca: BD 4.00 - BD 12.00 (Pasta, pizza, Italian classics)"
echo ""
echo "🍣 Sushi:"
echo "  • Tokyo Sushi: BD 3.00 - BD 12.00 (Nigiri, maki, sashimi, ramen)"
echo ""
echo "💰 Budget:"
echo "  • Popcorn Palace: BD 0.50 - BD 3.00 (Movie snacks)"
echo "  • Street Bites: BD 0.30 - BD 2.00 (Street food)"
echo "  • Fresh Squeeze: BD 0.50 - BD 3.00 (Juices & smoothies)"
echo ""
echo "🔑 All passwords: 12345678"
echo ""
echo "📈 Total: 6 new restaurants added!"
echo ""
