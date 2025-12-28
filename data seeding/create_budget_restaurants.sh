#!/bin/bash

# Create Budget-Friendly Restaurants
# Run this script to add all budget restaurants at once

echo "🍿 Creating Budget-Friendly Restaurants..."
echo "=========================================="
echo ""

echo "1️⃣ Creating Popcorn Palace (Movie Snacks)..."
node create_popcornpalace_partner.js
echo ""

echo "2️⃣ Creating Street Bites (Budget Street Food)..."
node create_streetbites_partner.js
echo ""

echo "3️⃣ Creating Fresh Squeeze (Budget Juice Bar)..."
node create_freshsqueeze_partner.js
echo ""

echo "=========================================="
echo "✅ All Budget Restaurants Created!"
echo "=========================================="
echo ""
echo "📊 Summary:"
echo "• Popcorn Palace: BD 0.50 - BD 3.00 (Movie snacks)"
echo "• Street Bites: BD 0.30 - BD 2.00 (Street food)"
echo "• Fresh Squeeze: BD 0.50 - BD 3.00 (Juices & smoothies)"
echo ""
echo "🔑 All passwords: 12345678"
echo ""
