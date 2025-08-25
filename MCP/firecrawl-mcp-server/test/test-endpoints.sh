#!/bin/bash

# Simple bash script to test the versioned endpoints
# This uses curl which is available on most systems

BASE_URL=${TEST_BASE_URL:-"http://localhost:3000"}
TEST_API_KEY=${TEST_API_KEY:-"fc-YOUR_API_KEY"}

echo "🧪 Starting endpoint tests..."
echo "🎯 Base URL: $BASE_URL"
echo "🔑 Test API Key: $TEST_API_KEY"
echo ""

PASSED=0
TOTAL=0

# Test health endpoint
echo "🏥 Testing health endpoint..."
TOTAL=$((TOTAL + 1))
if curl -s -f "$BASE_URL/health" > /dev/null; then
    echo "✅ Health endpoint working"
    echo "📋 Response:"
    curl -s "$BASE_URL/health" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/health"
    PASSED=$((PASSED + 1))
else
    echo "❌ Health endpoint failed"
fi
echo ""

# Test V1 SSE endpoint (HEAD request to avoid long-lived SSE timeout)
echo "🔌 Testing V1 SSE endpoint..."
TOTAL=$((TOTAL + 1))
if curl -s -f -I "$BASE_URL/$TEST_API_KEY/sse" > /dev/null; then
    echo "✅ V1 SSE endpoint accessible"
    PASSED=$((PASSED + 1))
else
    echo "❌ V1 SSE endpoint failed"
fi
echo ""

# Test V2 SSE endpoint (HEAD request to avoid long-lived SSE timeout)
echo "🔌 Testing V2 SSE endpoint..."
TOTAL=$((TOTAL + 1))
if curl -s -f -I "$BASE_URL/$TEST_API_KEY/v2/sse" > /dev/null; then
    echo "✅ V2 SSE endpoint accessible"
    PASSED=$((PASSED + 1))
else
    echo "❌ V2 SSE endpoint failed"
fi
echo ""

# Test invalid endpoint
echo "🚫 Testing invalid endpoint..."
TOTAL=$((TOTAL + 1))
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/invalid-endpoint")
if [ "$HTTP_CODE" = "404" ]; then
    echo "✅ Invalid endpoint correctly returns 404"
    PASSED=$((PASSED + 1))
else
    echo "❌ Invalid endpoint should return 404, got: $HTTP_CODE"
fi
echo ""

# Summary
echo "📊 Test Results:"
echo "✅ Passed: $PASSED/$TOTAL"
echo "❌ Failed: $((TOTAL - PASSED))/$TOTAL"

if [ $PASSED -eq $TOTAL ]; then
    echo "🎉 All tests passed!"
    exit 0
else
    echo "💥 Some tests failed!"
    exit 1
fi
