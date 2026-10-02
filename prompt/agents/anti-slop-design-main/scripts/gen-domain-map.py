#!/usr/bin/env python3
"""Generate domain-map.json from spec data."""
import json, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def pal(bg0,bg1,bg2,tp,ts,th,ap,a2,bd,er,su,wa):
    return {"bg_primary":bg0,"bg_secondary":bg1,"bg_elevated":bg2,
            "text_primary":tp,"text_secondary":ts,"text_heading":th,
            "accent_primary":ap,"accent_secondary":a2,"border":bd,
            "error":er,"success":su,"warning":wa}

def typo(hf,hw,bf,bw,mf,fs,hls,blh,hlh,ht):
    return {"heading_family":hf,"heading_weight":hw,"body_family":bf,"body_weight":bw,
            "mono_family":mf,"font_scale":fs,"heading_letter_spacing":hls,
            "body_line_height":blh,"heading_line_height":hlh,"heading_transform":ht}

def anim(i,s,pt,sa,mi):
    return {"intensity":i,"style":s,"page_transitions":pt,"scroll_animations":sa,"micro_interactions":mi}

data = {
  "schema_version": "1.0.0",
  "domains": {
    "fintech": {
      "name":"Fintech","aesthetic_label":"minimal-trust",
      "description":"Clean, restrained, confidence-inspiring. Every pixel must convey \"your money is safe here.\" Precision over personality.",
      "color_mood":["navy","institutional","muted","high-contrast"],
      "primary_palette_oklch": pal("oklch(0.985 0.003 250)","oklch(0.97 0.005 250)","oklch(1.0 0 0)","oklch(0.20 0.02 260)","oklch(0.45 0.015 260)","oklch(0.15 0.03 260)","oklch(0.50 0.18 260)","oklch(0.60 0.10 170)","oklch(0.88 0.01 250)","oklch(0.55 0.22 25)","oklch(0.60 0.17 155)","oklch(0.70 0.15 80)"),
      "dark_mode_palette_oklch": pal("oklch(0.13 0.015 260)","oklch(0.17 0.015 260)","oklch(0.22 0.015 260)","oklch(0.92 0.005 250)","oklch(0.65 0.01 250)","oklch(0.95 0.003 250)","oklch(0.65 0.18 260)","oklch(0.70 0.10 170)","oklch(0.28 0.015 260)","oklch(0.65 0.20 25)","oklch(0.70 0.17 155)","oklch(0.78 0.15 80)"),
      "dark_default":False,
      "typography": typo("'Plus Jakarta Sans', 'Inter', system-ui, sans-serif","700","'Inter', 'Helvetica Neue', system-ui, sans-serif","400","'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace","minor-third","-0.02em","1.6","1.15","none"),
      "border_radius":{"small":"6px","medium":"8px","large":"12px","pill":"9999px"},
      "density":"medium","shadow_style":"subtle",
      "animation": anim("minimal","snappy",False,False,True),
      "layout_preference":"symmetric","max_content_width":"1280px","grid_columns":"12",
      "imagery_style":"screenshots","imagery_treatment":"contained",
      "reference_files":["web-react.md","dataviz.md"],"token_file":"fintech.json",
      "exemplar_sites":["stripe.com","mercury.com","wise.com","linear.app/finance","ramp.com"],
      "anti_patterns":["Decorative animation","Stock photography of handshakes","Playful rounded corners >12px","Bright saturated primary colors","Gradient backgrounds","Comic/playful fonts","Excessive use of illustrations"]
    },
    "healthcare": {
      "name":"Healthcare","aesthetic_label":"calm-reassuring",
      "description":"Soothing, trustworthy, warm. Must feel safe and approachable \u2014 never clinical or cold. Accessibility is paramount.",
      "color_mood":["calming","blue-green","warm-neutral","soft"],
      "primary_palette_oklch": pal("oklch(0.98 0.004 160)","oklch(0.96 0.01 170)","oklch(0.995 0.002 90)","oklch(0.22 0.02 200)","oklch(0.48 0.015 200)","oklch(0.18 0.025 200)","oklch(0.55 0.14 190)","oklch(0.60 0.12 250)","oklch(0.88 0.015 170)","oklch(0.55 0.18 25)","oklch(0.58 0.15 160)","oklch(0.72 0.12 80)"),
      "dark_mode_palette_oklch": pal("oklch(0.14 0.01 200)","oklch(0.18 0.015 200)","oklch(0.23 0.015 200)","oklch(0.90 0.008 170)","oklch(0.65 0.01 180)","oklch(0.93 0.005 170)","oklch(0.65 0.12 190)","oklch(0.70 0.12 250)","oklch(0.30 0.015 200)","oklch(0.65 0.18 25)","oklch(0.68 0.15 160)","oklch(0.78 0.12 80)"),
      "dark_default":False,
      "typography": typo("'Outfit', 'DM Sans', system-ui, sans-serif","600","'DM Sans', 'Source Sans 3', system-ui, sans-serif","400","'IBM Plex Mono', 'Consolas', monospace","major-third","-0.01em","1.7","1.2","none"),
      "border_radius":{"small":"8px","medium":"12px","large":"16px","pill":"9999px"},
      "density":"spacious","shadow_style":"subtle",
      "animation": anim("minimal","smooth",True,False,True),
      "layout_preference":"single-column","max_content_width":"800px","grid_columns":"12",
      "imagery_style":"illustration","imagery_treatment":"contained",
      "reference_files":["web-react.md","accessibility.md"],"token_file":"healthcare.json",
      "exemplar_sites":["headspace.com","calm.com","zocdoc.com","one.app","nhs.uk"],
      "anti_patterns":["Red as primary/accent color","Dense information layouts","Small text below 16px","Stock photos of stethoscopes","Clinical/sterile color schemes","Fast animations","Complex multi-step forms without progress indicators","Tiny tap targets"]
    },
    "devtools": {
      "name":"Developer Tools","aesthetic_label":"linear-dark",
      "description":"The Linear look \u2014 dark-first, precise, information-dense. Monochrome with colorful accent glows.",
      "color_mood":["dark","precise","neon-accent","monochrome-plus-glow"],
      "primary_palette_oklch": pal("oklch(0.97 0.003 260)","oklch(0.94 0.005 260)","oklch(1.0 0 0)","oklch(0.18 0.02 270)","oklch(0.50 0.01 260)","oklch(0.13 0.025 270)","oklch(0.60 0.25 290)","oklch(0.70 0.20 180)","oklch(0.87 0.008 260)","oklch(0.60 0.22 25)","oklch(0.65 0.18 155)","oklch(0.75 0.15 80)"),
      "dark_mode_palette_oklch": pal("oklch(0.10 0.01 270)","oklch(0.14 0.012 270)","oklch(0.18 0.015 270)","oklch(0.90 0.005 260)","oklch(0.60 0.008 260)","oklch(0.95 0.003 260)","oklch(0.70 0.25 290)","oklch(0.75 0.20 180)","oklch(0.25 0.012 270)","oklch(0.65 0.22 25)","oklch(0.70 0.18 155)","oklch(0.80 0.15 80)"),
      "dark_default":True,
      "typography": typo("'Geist Sans', 'Cabinet Grotesk', system-ui, sans-serif","600","'Geist Sans', 'General Sans', system-ui, sans-serif","400","'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace","minor-third","-0.025em","1.5","1.1","none"),
      "border_radius":{"small":"6px","medium":"8px","large":"12px","pill":"9999px"},
      "density":"medium","shadow_style":"none",
      "animation": anim("moderate","snappy",True,True,True),
      "layout_preference":"bento","max_content_width":"1400px","grid_columns":"16",
      "imagery_style":"screenshots","imagery_treatment":"contained",
      "reference_files":["web-react.md","animation-motion.md","cli-terminal.md"],"token_file":"devtools.json",
      "exemplar_sites":["linear.app","vercel.com","raycast.com","warp.dev","supabase.com"],
      "anti_patterns":["Light backgrounds as default","Rounded corners >12px","Stock photography","Bouncy/playful animations","Serif fonts","Low information density","Hamburger menus","Loading spinners instead of skeleton states"]
    },
    "ecommerce": {
      "name":"E-Commerce / Luxury","aesthetic_label":"editorial-cinematic",
      "description":"Product is the hero. Restrained UI that steps back to let merchandise speak.",
      "color_mood":["neutral","warm","restrained","high-contrast-accents"],
      "primary_palette_oklch": pal("oklch(0.98 0.005 80)","oklch(0.95 0.008 80)","oklch(1.0 0 0)","oklch(0.18 0.01 50)","oklch(0.50 0.01 60)","oklch(0.12 0.015 50)","oklch(0.25 0.01 50)","oklch(0.55 0.12 50)","oklch(0.85 0.01 70)","oklch(0.55 0.18 25)","oklch(0.55 0.14 155)","oklch(0.70 0.12 80)"),
      "dark_mode_palette_oklch": pal("oklch(0.10 0.008 50)","oklch(0.15 0.008 50)","oklch(0.20 0.01 50)","oklch(0.90 0.005 70)","oklch(0.62 0.008 60)","oklch(0.93 0.003 70)","oklch(0.90 0.005 70)","oklch(0.65 0.12 50)","oklch(0.28 0.008 50)","oklch(0.65 0.18 25)","oklch(0.65 0.14 155)","oklch(0.78 0.12 80)"),
      "dark_default":False,
      "typography": typo("'Cormorant Garamond', 'Playfair Display', 'Georgia', serif","500","'Lato', 'Proza Libre', system-ui, sans-serif","400","'IBM Plex Mono', monospace","perfect-fourth","0.02em","1.6","1.1","uppercase"),
      "border_radius":{"small":"0px","medium":"0px","large":"2px","pill":"0px"},
      "density":"spacious","shadow_style":"none",
      "animation": anim("moderate","cinematic",True,True,True),
      "layout_preference":"editorial","max_content_width":"1400px","grid_columns":"12",
      "imagery_style":"photography","imagery_treatment":"full-bleed",
      "reference_files":["web-landing.md","animation-motion.md","typography.md"],"token_file":"ecommerce.json",
      "exemplar_sites":["apple.com","aesop.com","everlane.com","ssense.com","mrporter.com"],
      "anti_patterns":["Bright primary colors","Rounded corners >4px","Sans-serif headings without serif counterpart","Stock photography","Busy backgrounds or patterns","Playful illustrations","Dense product grids without whitespace","Generic Shop Now CTAs without brand voice"]
    },
    "education": {
      "name":"Education","aesthetic_label":"playful-gamified",
      "description":"Vibrant, encouraging, game-like. Learning should feel rewarding. Heavy use of color, progress indicators, streaks, badges.",
      "color_mood":["vibrant","saturated","encouraging","colorful"],
      "primary_palette_oklch": pal("oklch(0.98 0.005 110)","oklch(0.96 0.01 110)","oklch(1.0 0 0)","oklch(0.20 0.025 150)","oklch(0.45 0.02 150)","oklch(0.18 0.03 150)","oklch(0.72 0.22 145)","oklch(0.65 0.22 280)","oklch(0.88 0.02 145)","oklch(0.60 0.22 25)","oklch(0.72 0.22 145)","oklch(0.78 0.16 80)"),
      "dark_mode_palette_oklch": pal("oklch(0.13 0.015 150)","oklch(0.17 0.02 150)","oklch(0.22 0.02 150)","oklch(0.90 0.01 145)","oklch(0.65 0.015 145)","oklch(0.93 0.008 145)","oklch(0.72 0.22 145)","oklch(0.70 0.22 280)","oklch(0.28 0.02 150)","oklch(0.65 0.22 25)","oklch(0.72 0.22 145)","oklch(0.82 0.16 80)"),
      "dark_default":False,
      "typography": typo("'Nunito', 'Baloo 2', 'Poppins', sans-serif","800","'Nunito', 'DM Sans', system-ui, sans-serif","400","'Fira Code', monospace","major-third","-0.01em","1.6","1.2","none"),
      "border_radius":{"small":"12px","medium":"16px","large":"20px","pill":"9999px"},
      "density":"medium","shadow_style":"elevated",
      "animation": anim("expressive","springy",True,True,True),
      "layout_preference":"bento","max_content_width":"1000px","grid_columns":"12",
      "imagery_style":"illustration","imagery_treatment":"contained",
      "reference_files":["web-react.md","animation-motion.md"],"token_file":"education.json",
      "exemplar_sites":["duolingo.com","brilliant.org","khanacademy.org","codecademy.com","notion.so/education"],
      "anti_patterns":["Boring/corporate color schemes","Small text","Dense information without chunking","Missing progress indicators","No celebration/reward on completion","Static pages with no interaction","Serif fonts","Gray/muted palettes"]
    },
    "media": {
      "name":"Media / Publishing","aesthetic_label":"editorial-typographic",
      "description":"Content is king. Typography drives the entire design \u2014 dramatic size hierarchies, editorial serif fonts, multi-column layouts.",
      "color_mood":["warm-neutral","high-contrast","ink-on-paper","minimal-accent"],
      "primary_palette_oklch": pal("oklch(0.985 0.005 80)","oklch(0.97 0.008 80)","oklch(1.0 0 0)","oklch(0.18 0.01 60)","oklch(0.48 0.008 60)","oklch(0.10 0.015 50)","oklch(0.50 0.20 25)","oklch(0.35 0.01 60)","oklch(0.85 0.008 70)","oklch(0.55 0.20 25)","oklch(0.55 0.14 155)","oklch(0.70 0.12 80)"),
      "dark_mode_palette_oklch": pal("oklch(0.12 0.008 60)","oklch(0.16 0.008 60)","oklch(0.21 0.01 60)","oklch(0.88 0.005 70)","oklch(0.62 0.006 60)","oklch(0.93 0.003 70)","oklch(0.65 0.18 25)","oklch(0.55 0.008 60)","oklch(0.28 0.008 60)","oklch(0.65 0.20 25)","oklch(0.65 0.14 155)","oklch(0.78 0.12 80)"),
      "dark_default":False,
      "typography": typo("'Playfair Display', 'Libre Baskerville', 'Georgia', serif","700","'Source Serif 4', 'Lora', 'Charter', serif","400","'Fira Code', 'Source Code Pro', monospace","perfect-fourth","-0.015em","1.65","1.1","none"),
      "border_radius":{"small":"2px","medium":"4px","large":"4px","pill":"9999px"},
      "density":"medium","shadow_style":"none",
      "animation": anim("minimal","smooth",False,False,True),
      "layout_preference":"editorial","max_content_width":"720px","grid_columns":"12",
      "imagery_style":"photography","imagery_treatment":"full-bleed",
      "reference_files":["web-landing.md","typography.md","layout-spacing.md"],"token_file":"media.json",
      "exemplar_sites":["nytimes.com","theverge.com","medium.com","aeon.co","economist.com"],
      "anti_patterns":["Sans-serif body text","Low type hierarchy","Sidebar ads breaking reading flow","Infinite scroll without section breaks","Hamburger menus hiding navigation","Generic blog templates","Line widths >75ch","Illustrations replacing photography for news content"]
    },
    "government": {
      "name":"Government / Civic","aesthetic_label":"functional-accessible",
      "description":"Accessibility-first, content-first, trust-through-plainness. GOV.UK is the gold standard. Zero decoration. Every citizen must be able to use it.",
      "color_mood":["institutional","high-contrast","blue","plain"],
      "primary_palette_oklch": pal("oklch(1.0 0 0)","oklch(0.97 0.003 240)","oklch(1.0 0 0)","oklch(0.15 0.01 260)","oklch(0.40 0.01 260)","oklch(0.10 0.01 260)","oklch(0.47 0.18 250)","oklch(0.40 0.15 250)","oklch(0.75 0.005 260)","oklch(0.50 0.22 25)","oklch(0.52 0.16 160)","oklch(0.78 0.16 80)"),
      "dark_mode_palette_oklch": pal("oklch(0.15 0.005 260)","oklch(0.19 0.005 260)","oklch(0.23 0.005 260)","oklch(0.92 0.003 260)","oklch(0.65 0.005 260)","oklch(0.95 0.003 260)","oklch(0.62 0.18 250)","oklch(0.55 0.15 250)","oklch(0.35 0.005 260)","oklch(0.60 0.22 25)","oklch(0.62 0.16 160)","oklch(0.82 0.16 80)"),
      "dark_default":False,
      "typography": typo("'GDS Transport', 'Noto Sans', 'Arial', sans-serif","700","'Noto Sans', 'Arial', sans-serif","400","'Noto Sans Mono', 'Consolas', monospace","minor-third","0","1.6","1.2","none"),
      "border_radius":{"small":"0px","medium":"0px","large":"0px","pill":"0px"},
      "density":"spacious","shadow_style":"none",
      "animation": anim("none","snappy",False,False,False),
      "layout_preference":"single-column","max_content_width":"750px","grid_columns":"fluid",
      "imagery_style":"none","imagery_treatment":"contained",
      "reference_files":["web-react.md","accessibility.md"],"token_file":"government.json",
      "exemplar_sites":["gov.uk","design-system.service.gov.uk","usa.gov","canada.ca","nsw.gov.au"],
      "anti_patterns":["ANY decorative animation","Rounded corners","Gradient backgrounds","Custom fonts that might not load","Hamburger menus","Carousel/slider components","Auto-playing media","Pop-ups or modals for non-essential content","JavaScript-dependent core functionality","Text below 19px","Color as the sole differentiator"]
    },
    "creative": {
      "name":"Creative Agency / Portfolio","aesthetic_label":"bold-experimental",
      "description":"Maximum creative freedom. Asymmetric layouts, experimental typography, dramatic animation, unconventional navigation. The design IS the content.",
      "color_mood":["bold","unexpected","high-saturation-accent","dramatic-contrast"],
      "primary_palette_oklch": pal("oklch(0.985 0.003 90)","oklch(0.08 0.01 270)","oklch(1.0 0 0)","oklch(0.15 0.01 50)","oklch(0.50 0.008 50)","oklch(0.08 0.01 270)","oklch(0.65 0.27 30)","oklch(0.55 0.25 290)","oklch(0.80 0.005 50)","oklch(0.60 0.22 25)","oklch(0.65 0.18 155)","oklch(0.78 0.16 80)"),
      "dark_mode_palette_oklch": pal("oklch(0.08 0.01 270)","oklch(0.14 0.01 270)","oklch(0.20 0.01 270)","oklch(0.95 0.005 80)","oklch(0.65 0.005 60)","oklch(0.97 0.003 80)","oklch(0.70 0.27 30)","oklch(0.65 0.25 290)","oklch(0.25 0.01 270)","oklch(0.65 0.22 25)","oklch(0.70 0.18 155)","oklch(0.82 0.16 80)"),
      "dark_default":False,
      "typography": typo("'Clash Display', 'Bricolage Grotesque', 'Anton', sans-serif","700","'Satoshi', 'General Sans', system-ui, sans-serif","400","'Recursive', 'Fira Code', monospace","perfect-fourth","-0.03em","1.6","1.0","none"),
      "border_radius":{"small":"0px","medium":"0px","large":"0px","pill":"9999px"},
      "density":"spacious","shadow_style":"dramatic",
      "animation": anim("expressive","cinematic",True,True,True),
      "layout_preference":"asymmetric","max_content_width":"100%","grid_columns":"fluid",
      "imagery_style":"abstract","imagery_treatment":"full-bleed",
      "reference_files":["web-landing.md","animation-motion.md","typography.md","layout-spacing.md"],"token_file":"creative.json",
      "exemplar_sites":["awwwards.com","thefwa.com","pentagram.com","sagmeister.com","stripe.com/sessions"],
      "anti_patterns":["Safe/corporate color schemes","Centered symmetric layouts","Standard navigation patterns","Static pages without motion","Generic stock photography","Template-looking layouts","Cookie-cutter three-column grids","Being experimental without being usable"]
    }
  },
  "signal_keywords": {
    "fintech":["bank","banking","payment","payments","transaction","transactions","invoice","invoicing","finance","financial","fintech","money","billing","subscription","pricing","checkout","wallet","crypto","trading","stocks","portfolio","wealth","insurance","lending","credit","debit","accounting","ledger","payroll","revenue","expense","budget","tax","compliance","KYC","AML"],
    "healthcare":["health","healthcare","medical","patient","doctor","clinical","hospital","pharmacy","prescription","diagnosis","symptom","wellness","mental health","therapy","telehealth","telemedicine","EMR","EHR","HIPAA","appointment","medication","vitals","fitness","nutrition","meditation","sleep","wearable","caregiver","nursing","dental","veterinary","lab results"],
    "devtools":["developer","dev tools","devtools","IDE","code editor","terminal","CLI","API","SDK","documentation","docs","git","GitHub","deployment","CI/CD","pipeline","monitoring","logging","debugging","database","infrastructure","cloud","serverless","container","docker","kubernetes","microservice","open source","npm","package","library","framework","lint","test runner","build tool","command palette","developer experience","DX"],
    "ecommerce":["shop","shopping","store","e-commerce","ecommerce","product page","cart","catalog","marketplace","retail","fashion","luxury","brand","merchandise","inventory","SKU","wishlist","collection","seasonal","sale","discount","coupon","shipping","delivery","returns","reviews","ratings","beauty","cosmetics","jewelry","watches","designer","boutique","lifestyle"],
    "education":["education","learning","course","lesson","quiz","test","student","teacher","classroom","LMS","curriculum","module","assignment","grade","progress","streak","badge","certificate","tutorial","exercise","practice","flashcard","study","school","university","training","onboarding","upskill","e-learning","MOOC","gamification","leaderboard","achievement"],
    "media":["news","article","blog","editorial","magazine","publication","journalism","reporter","newsletter","content","CMS","publishing","podcast","video","streaming","media","press","headline","byline","column","opinion","review","critic","feature","longform","essay","story","narrative","archive","subscription","paywall","readership","RSS","feed"],
    "government":["government","gov","civic","public service","citizen","municipal","federal","state","council","agency","department","regulation","policy","permit","license","tax filing","voter","election","census","benefits","social services","immigration","passport","public health","emergency","FOIA","transparency","open data","compliance","procurement","grant","accessibility","508","Section 508","ADA"],
    "creative":["portfolio","agency","design studio","creative","art direction","branding","brand identity","visual identity","showreel","case study","gallery","exhibition","photography portfolio","artist","illustrator","motion designer","3D","WebGL","interactive experience","immersive","experimental","avant-garde","award","awwwards","FWA","pitch deck","creative brief","concept","campaign","launch","reveal"]
  },
  "axes_defaults": {
    "serif_vs_sans":"sans","dark_vs_light":"light","density":"medium",
    "animation_intensity":"moderate","border_radius":"8px","formality":"professional"
  },
  "extensibility": {
    "template": {
      "name":"","aesthetic_label":"","description":"","color_mood":[],
      "primary_palette_oklch": pal("oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()"),
      "dark_mode_palette_oklch": pal("oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()","oklch()"),
      "dark_default":False,
      "typography": typo("","","","","","","","","",""),
      "border_radius":{"small":"","medium":"","large":"","pill":""},
      "density":"","shadow_style":"",
      "animation": anim("","",False,False,False),
      "layout_preference":"","max_content_width":"","grid_columns":"",
      "imagery_style":"","imagery_treatment":"",
      "reference_files":[],"token_file":"","exemplar_sites":[],"anti_patterns":[]
    },
    "instructions":"See assets/tokens/_extensibility.md for the full guide on adding new domains."
  }
}

with open("domain-map.json","w",encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

with open("domain-map.json","r") as f:
    lines = len(f.readlines())
print(f"Written: {lines} lines")

# Validate
with open("domain-map.json","r") as f:
    d = json.load(f)
assert len(d["domains"]) == 8
assert len(d["signal_keywords"]) == 8
assert len(d["axes_defaults"]) == 6
for dk in d["domains"]:
    p = d["domains"][dk]
    assert len(p["primary_palette_oklch"]) == 12, f"{dk} light"
    assert len(p["dark_mode_palette_oklch"]) == 12, f"{dk} dark"
    assert len(p["typography"]) == 10, f"{dk} typo"
    assert len(p["border_radius"]) == 4, f"{dk} radius"
    assert len(p["animation"]) == 5, f"{dk} anim"
    assert len(p["exemplar_sites"]) >= 3, f"{dk} exemplars"
    assert len(p["anti_patterns"]) >= 3, f"{dk} anti_patterns"
    kw = d["signal_keywords"][dk]
    assert len(kw) >= 15, f"{dk} keywords: {len(kw)}"
print("All checks passed!")
