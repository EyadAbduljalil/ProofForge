#!/usr/bin/env bash
set -euo pipefail

SKILL_ROOT="${1:-.}"
PASS=0
FAIL=0

check() {
  local description="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    echo "✓ PASS: $description"
    PASS=$((PASS + 1))
  else
    echo "✗ FAIL: $description"
    FAIL=$((FAIL + 1))
  fi
}

check_file() {
  check "File exists: $1" test -f "$SKILL_ROOT/$1"
}

check_min_lines() {
  local file="$1" min="$2"
  check "Min lines ($min): $file" bash -c "[ \$(wc -l < '$SKILL_ROOT/$file') -ge $min ]"
}

check_json_files() {
  check "All JSON files are valid" python3 -c '
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
for relative_path in sys.argv[2:]:
    with (root / relative_path).open() as stream:
        json.load(stream)
' "$SKILL_ROOT" "$@"
}

check_grep() {
  local file="$1" pattern="$2" desc="$3"
  check "$desc" grep -qi "$pattern" "$SKILL_ROOT/$file"
}

check_xml() {
  check "Valid XML: $1" python3 -c "import xml.etree.ElementTree as ET; ET.parse('$SKILL_ROOT/$1')"
}

# =============================================================================
# CATEGORY 1: FILE EXISTENCE (55 checks)
# =============================================================================
echo "=== File Existence Checks ==="

# Core files
check_file "SKILL.md"
check_file "domain-map.json"

# References (17 files)
check_file "references/_toc.md"
check_file "references/web-react.md"
check_file "references/web-landing.md"
check_file "references/web-artifacts.md"
check_file "references/dataviz.md"
check_file "references/mobile-native.md"
check_file "references/mobile-crossplatform.md"
check_file "references/desktop.md"
check_file "references/cli-terminal.md"
check_file "references/pdf-print.md"
check_file "references/email.md"
check_file "references/animation-motion.md"
check_file "references/typography.md"
check_file "references/color-systems.md"
check_file "references/layout-spacing.md"
check_file "references/accessibility.md"
check_file "references/anti-patterns.md"

# CSS assets (7 files)
check_file "assets/css/modern-reset.css"
check_file "assets/css/fluid-type-scale.css"
check_file "assets/css/fluid-space-scale.css"
check_file "assets/css/motion-tokens.css"
check_file "assets/css/color-tokens/primitives-light.css"
check_file "assets/css/color-tokens/primitives-dark.css"
check_file "assets/css/color-tokens/semantic.css"

# SVG assets (5 files)
check_file "assets/svg/grain-overlay.svg"
check_file "assets/svg/dot-grid.svg"
check_file "assets/svg/blob-organic.svg"
check_file "assets/svg/noise-subtle.svg"
check_file "assets/svg/diagonal-lines.svg"

# Font assets (2 files)
check_file "assets/fonts/font-stacks.json"
check_file "assets/fonts/loading-snippet.html"

# Token assets (9 files)
check_file "assets/tokens/domain-tokens/fintech.json"
check_file "assets/tokens/domain-tokens/healthcare.json"
check_file "assets/tokens/domain-tokens/devtools.json"
check_file "assets/tokens/domain-tokens/ecommerce.json"
check_file "assets/tokens/domain-tokens/education.json"
check_file "assets/tokens/domain-tokens/media.json"
check_file "assets/tokens/domain-tokens/government.json"
check_file "assets/tokens/domain-tokens/creative.json"
check_file "assets/tokens/_extensibility.md"

# Templates - web (4 files)
check_file "templates/web/dashboard.tsx"
check_file "templates/web/landing-page.html"
check_file "templates/web/saas-app.tsx"
check_file "templates/web/artifact-react.jsx"

# Templates - mobile (3 files)
check_file "templates/mobile/swiftui-app.swift"
check_file "templates/mobile/compose-app.kt"
check_file "templates/mobile/react-native-app.tsx"

# Templates - desktop (2 files)
check_file "templates/desktop/electron-app.html"
check_file "templates/desktop/tauri-app.html"

# Templates - CLI (3 files)
check_file "templates/cli/node-cli.ts"
check_file "templates/cli/python-tui.py"
check_file "templates/cli/go-tui.go"

# Templates - documents (3 files)
check_file "templates/documents/typst-report.typ"
check_file "templates/documents/react-pdf-invoice.tsx"
check_file "templates/documents/react-email.tsx"

# Templates - dataviz (3 files)
check_file "templates/dataviz/recharts-dashboard.tsx"
check_file "templates/dataviz/d3-editorial.html"
check_file "templates/dataviz/nivo-cards.tsx"

# Validation & eval (2 files)
check_file "scripts/validate-skill.sh"
check_file "evals/evals.json"

# =============================================================================
# CATEGORY 2: MINIMUM LINE COUNTS (18 checks)
# =============================================================================
echo ""
echo "=== Minimum Line Count Checks ==="

check_min_lines "SKILL.md" 300
check_min_lines "domain-map.json" 300
check_min_lines "references/anti-patterns.md" 250
check_min_lines "references/web-react.md" 150
check_min_lines "references/web-landing.md" 120
check_min_lines "references/web-artifacts.md" 100
check_min_lines "references/dataviz.md" 150
check_min_lines "references/mobile-native.md" 150
check_min_lines "references/mobile-crossplatform.md" 120
check_min_lines "references/desktop.md" 100
check_min_lines "references/cli-terminal.md" 100
check_min_lines "references/pdf-print.md" 100
check_min_lines "references/email.md" 100
check_min_lines "references/animation-motion.md" 150
check_min_lines "references/typography.md" 150
check_min_lines "references/color-systems.md" 120
check_min_lines "references/layout-spacing.md" 100
check_min_lines "references/accessibility.md" 150

# =============================================================================
# CATEGORY 3: JSON VALIDITY (1 batched check)
# =============================================================================
echo ""
echo "=== JSON Validity Checks ==="

check_json_files \
  "domain-map.json" \
  "assets/fonts/font-stacks.json" \
  "assets/tokens/domain-tokens/fintech.json" \
  "assets/tokens/domain-tokens/healthcare.json" \
  "assets/tokens/domain-tokens/devtools.json" \
  "assets/tokens/domain-tokens/ecommerce.json" \
  "assets/tokens/domain-tokens/education.json" \
  "assets/tokens/domain-tokens/media.json" \
  "assets/tokens/domain-tokens/government.json" \
  "assets/tokens/domain-tokens/creative.json" \
  "evals/evals.json"

# =============================================================================
# CATEGORY 4: REQUIRED SECTION HEADERS (variable checks)
# =============================================================================
echo ""
echo "=== Required Section Headers ==="

# web-react.md
check_grep "references/web-react.md" "## .*Stack\|## .*Recommended" "web-react.md has Stack section"
check_grep "references/web-react.md" "## .*Component" "web-react.md has Component section"
check_grep "references/web-react.md" "## .*Anti.Pattern" "web-react.md has Anti-Patterns"
check_grep "references/web-react.md" "## .*Exemplar\|## .*Sites" "web-react.md has Exemplar Sites"

# typography.md
check_grep "references/typography.md" "## .*Font Selection\|## .*Recommended Font" "typography.md has Font Selection"
check_grep "references/typography.md" "## .*Font Pairing\|## .*Pairing" "typography.md has Font Pairing"
check_grep "references/typography.md" "## .*Fluid Type\|## .*Type Scale" "typography.md has Fluid Type Scale"
check_grep "references/typography.md" "## .*Anti.Pattern" "typography.md has Anti-Patterns"

# anti-patterns.md
check_grep "references/anti-patterns.md" "## .*Why AI\|## .*Converge" "anti-patterns.md has Why AI Output Converges"
check_grep "references/anti-patterns.md" "## .*Telltale\|## .*Signs" "anti-patterns.md has Telltale Signs"
check_grep "references/anti-patterns.md" "## .*Counter.Technique" "anti-patterns.md has Counter-Techniques"
check_grep "references/anti-patterns.md" "## .*Audit\|## .*Pre.Delivery" "anti-patterns.md has Audit Protocol"

# color-systems.md
check_grep "references/color-systems.md" "## .*OKLCH\|## .*Why" "color-systems.md has OKLCH section"
check_grep "references/color-systems.md" "## .*Palette\|## .*Token" "color-systems.md has Palette section"
check_grep "references/color-systems.md" "## .*Dark Mode" "color-systems.md has Dark Mode section"
check_grep "references/color-systems.md" "## .*Anti.Pattern" "color-systems.md has Anti-Patterns"

# dataviz.md
check_grep "references/dataviz.md" "## .*Library\|## .*Comparison" "dataviz.md has Library section"
check_grep "references/dataviz.md" "## .*Anti.Pattern\|## .*Anti.Default" "dataviz.md has Anti-Patterns"

# animation-motion.md
check_grep "references/animation-motion.md" "## .*Library\|## .*Framework" "animation-motion.md has Library section"
check_grep "references/animation-motion.md" "## .*Anti.Pattern" "animation-motion.md has Anti-Patterns"

# layout-spacing.md
check_grep "references/layout-spacing.md" "## .*Grid\|## .*CSS Grid" "layout-spacing.md has Grid section"
check_grep "references/layout-spacing.md" "## .*Anti.Pattern" "layout-spacing.md has Anti-Patterns"

# accessibility.md
check_grep "references/accessibility.md" "## .*WCAG\|## .*Legal" "accessibility.md has WCAG/Legal section"
check_grep "references/accessibility.md" "## .*ARIA" "accessibility.md has ARIA section"
check_grep "references/accessibility.md" "## .*Anti.Pattern" "accessibility.md has Anti-Patterns"

# mobile-native.md
check_grep "references/mobile-native.md" "## .*SwiftUI\|## .*iOS" "mobile-native.md has SwiftUI section"
check_grep "references/mobile-native.md" "## .*Compose\|## .*Android" "mobile-native.md has Compose section"
check_grep "references/mobile-native.md" "## .*Anti.Pattern" "mobile-native.md has Anti-Patterns"

# desktop.md
check_grep "references/desktop.md" "## .*Electron\|## .*Tauri" "desktop.md has Electron/Tauri section"
check_grep "references/desktop.md" "## .*Anti.Pattern" "desktop.md has Anti-Patterns"

# cli-terminal.md
check_grep "references/cli-terminal.md" "## .*Framework\|## .*TUI" "cli-terminal.md has Framework section"
check_grep "references/cli-terminal.md" "## .*Anti.Pattern" "cli-terminal.md has Anti-Patterns"

# web-landing.md
check_grep "references/web-landing.md" "## .*Layout\|## .*Hero" "web-landing.md has Layout section"
check_grep "references/web-landing.md" "## .*Anti.Pattern" "web-landing.md has Anti-Patterns"

# web-artifacts.md
check_grep "references/web-artifacts.md" "## .*Constraint\|## .*Limit" "web-artifacts.md has Constraints section"
check_grep "references/web-artifacts.md" "## .*Anti.Pattern" "web-artifacts.md has Anti-Patterns"

# pdf-print.md
check_grep "references/pdf-print.md" "## .*Typst\|## .*React.PDF" "pdf-print.md has Typst/React-PDF section"
check_grep "references/pdf-print.md" "## .*Anti.Pattern" "pdf-print.md has Anti-Patterns"

# email.md
check_grep "references/email.md" "## .*Client\|## .*Outlook" "email.md has Client section"
check_grep "references/email.md" "## .*Anti.Pattern" "email.md has Anti-Patterns"

# mobile-crossplatform.md
check_grep "references/mobile-crossplatform.md" "## .*React Native\|## .*Flutter" "mobile-crossplatform.md has RN/Flutter section"
check_grep "references/mobile-crossplatform.md" "## .*Anti.Pattern" "mobile-crossplatform.md has Anti-Patterns"

# =============================================================================
# CATEGORY 5: CSS CUSTOM PROPERTY CHECKS (12 checks)
# =============================================================================
echo ""
echo "=== CSS Custom Property Checks ==="

check_grep "assets/css/fluid-type-scale.css" "\-\-step-0" "fluid-type-scale.css has --step-0"
check_grep "assets/css/fluid-type-scale.css" "\-\-step-5" "fluid-type-scale.css has --step-5"
check_grep "assets/css/fluid-type-scale.css" "clamp(" "fluid-type-scale.css uses clamp()"

check_grep "assets/css/fluid-space-scale.css" "\-\-space-s" "fluid-space-scale.css has --space-s"
check_grep "assets/css/fluid-space-scale.css" "clamp(" "fluid-space-scale.css uses clamp()"

check_grep "assets/css/motion-tokens.css" "\-\-motion-duration" "motion-tokens.css has --motion-duration"
check_grep "assets/css/motion-tokens.css" "\-\-motion-ease" "motion-tokens.css has --motion-ease"

check_grep "assets/css/color-tokens/semantic.css" "\-\-color-bg-primary" "semantic.css has --color-bg-primary"
check_grep "assets/css/color-tokens/semantic.css" "\-\-color-text-primary" "semantic.css has --color-text-primary"
check_grep "assets/css/color-tokens/semantic.css" "\-\-color-interactive\|color-accent" "semantic.css has interactive/accent token"

check_grep "assets/css/color-tokens/primitives-light.css" "oklch" "primitives-light.css uses oklch"
check_grep "assets/css/color-tokens/primitives-dark.css" "oklch" "primitives-dark.css uses oklch"

# =============================================================================
# CATEGORY 6: SVG VALIDITY (5 checks)
# =============================================================================
echo ""
echo "=== SVG Validity Checks ==="

check_xml "assets/svg/grain-overlay.svg"
check_xml "assets/svg/dot-grid.svg"
check_xml "assets/svg/blob-organic.svg"
check_xml "assets/svg/noise-subtle.svg"
check_xml "assets/svg/diagonal-lines.svg"

# =============================================================================
# CATEGORY 7: TEMPLATE THEME MARKERS (18 checks)
# =============================================================================
echo ""
echo "=== Template Theme Marker Checks ==="

check_grep "templates/web/dashboard.tsx" "theme\|THEME" "dashboard.tsx has theme marker"
check_grep "templates/web/landing-page.html" "theme\|THEME" "landing-page.html has theme marker"
check_grep "templates/web/saas-app.tsx" "theme\|THEME" "saas-app.tsx has theme marker"
check_grep "templates/web/artifact-react.jsx" "theme\|THEME" "artifact-react.jsx has theme marker"
check_grep "templates/mobile/swiftui-app.swift" "theme\|THEME\|Design.Token\|design.token" "swiftui-app.swift has theme marker"
check_grep "templates/mobile/compose-app.kt" "theme\|THEME\|Design.Token\|design.token" "compose-app.kt has theme marker"
check_grep "templates/mobile/react-native-app.tsx" "theme\|THEME\|Design.Token\|design.token" "react-native-app.tsx has theme marker"
check_grep "templates/desktop/electron-app.html" "theme\|THEME" "electron-app.html has theme marker"
check_grep "templates/desktop/tauri-app.html" "theme\|THEME" "tauri-app.html has theme marker"
check_grep "templates/cli/node-cli.ts" "theme\|THEME" "node-cli.ts has theme marker"
check_grep "templates/cli/python-tui.py" "theme\|THEME" "python-tui.py has theme marker"
check_grep "templates/cli/go-tui.go" "theme\|THEME" "go-tui.go has theme marker"
check_grep "templates/documents/typst-report.typ" "theme\|THEME" "typst-report.typ has theme marker"
check_grep "templates/documents/react-pdf-invoice.tsx" "theme\|THEME" "react-pdf-invoice.tsx has theme marker"
check_grep "templates/documents/react-email.tsx" "theme\|THEME" "react-email.tsx has theme marker"
check_grep "templates/dataviz/recharts-dashboard.tsx" "theme\|THEME" "recharts-dashboard.tsx has theme marker"
check_grep "templates/dataviz/d3-editorial.html" "theme\|THEME" "d3-editorial.html has theme marker"
check_grep "templates/dataviz/nivo-cards.tsx" "theme\|THEME" "nivo-cards.tsx has theme marker"

# =============================================================================
# CATEGORY 8: DOMAIN TOKEN SCHEMA COMPLIANCE (1 batched check)
# =============================================================================
echo ""
echo "=== Domain Token Schema Checks ==="

check "All domain token schemas are valid" python3 -c '
import json, sys
for path in sys.argv[1:]:
    with open(path) as stream:
        data = json.load(stream)
    required = ["domain", "colors", "typography", "shape", "motion", "shadows"]
    missing = [k for k in required if k not in data]
    if missing:
        print(f"{path}: missing keys: {missing}")
        sys.exit(1)
    for mode in ["light", "dark"]:
        if mode not in data["colors"]:
            print(f"{path}: missing colors.{mode}")
            sys.exit(1)
' "$SKILL_ROOT"/assets/tokens/domain-tokens/*.json

# =============================================================================
# CATEGORY 9: SKILL.MD FRONTMATTER CHECK (1 check)
# =============================================================================
echo ""
echo "=== SKILL.md Frontmatter Check ==="

check "SKILL.md has name: anti-slop-design" bash -c "head -20 '$SKILL_ROOT/SKILL.md' | grep -q 'name:.*anti-slop-design'"

# =============================================================================
# CATEGORY 10: DOMAIN-MAP.JSON STRUCTURE CHECK (1 check)
# =============================================================================
echo ""
echo "=== domain-map.json Structure Check ==="

check "domain-map.json has 8 domains with keywords" python3 -c "
import json
with open('$SKILL_ROOT/domain-map.json') as f:
    data = json.load(f)
assert len(data['domains']) == 8, f'Expected 8 domains, got {len(data[\"domains\"])}'
assert 'signal_keywords' in data, 'Missing signal_keywords'
for domain in data['domains']:
    assert domain in data['signal_keywords'], f'Missing keywords for {domain}'
    assert len(data['signal_keywords'][domain]) >= 10, f'{domain} has <10 keywords'
"

# =============================================================================
# SUMMARY
# =============================================================================
echo ""
TOTAL=$((PASS + FAIL))
echo "================================"
echo "Results: $PASS/$TOTAL checks passed"
if [ "$FAIL" -gt 0 ]; then
  echo "$FAIL checks FAILED"
  exit 1
else
  echo "ALL CHECKS PASSED ✓"
  exit 0
fi
