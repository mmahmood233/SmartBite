#!/bin/bash
# Run all remaining restaurant creation scripts

echo "🚀 Creating remaining restaurants..."
echo ""

node create_nandos_partner.js
node create_hardees_partner.js
node create_papajohns_partner.js

echo ""
echo "✅ All restaurants created!"
echo "📊 Total: 9 restaurants with complete data"
