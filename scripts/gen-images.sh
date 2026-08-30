#!/bin/bash
# AlexPicture Marketplace — Aset Visual Generation
# Semua prompt: warm amber/cream, tanpa wajah teridentifikasi, tanpa teks terbaca jelas (hindari teks artefak)
set -u
DIR=/home/z/my-project/public/images
cd "$DIR"
S="warm amber and cream tones, professional studio quality, clean minimalist composition, soft natural lighting, high quality, highly detailed"

gen() { # name, size, prompt
  local name="$1"; local size="$2"; local prompt="$3"
  if [ -s "$name.png" ]; then echo "SKIP $name (exists)"; return 0; fi
  echo "GEN  $name [$size] ..."
  z-ai image -p "$prompt, $S" -o "$name.png" -s "$size" && echo "OK   $name" || echo "FAIL $name"
}

# 1. Hero collage
gen hero-collage 1344x768 "creative agency flat lay collage: graphic design sketchbook with color palette swatches, professional camera, laptop showing website layout wireframe, smartphone with social media feed grid, coffee cup, arranged elegantly on wooden desk"

# 2-6. Kategori (1:1)
gen cat-desain 1024x1024 "graphic design workspace flat lay: drawing tablet with stylus, Pantone color palette cards, sketchbook with logo sketches, geometric shapes, pencils"
gen cat-video 1024x1024 "professional video production scene: cinema camera on tripod, softbox studio light, clapperboard, dark warm backdrop"
gen cat-web 1024x1024 "modern workspace with laptop and smartphone showing clean website layout mockup with blurred placeholder text, notebook, minimal desk setup"
gen cat-addon 1024x1024 "camera lens, external hard drive, design tools and swiss army knife of creative services arranged as premium accessories flat lay"
gen cat-langganan 1024x1024 "creative team workspace with monthly content calendar board, sticky notes, magazine layouts, planning materials, collaborative desk"

# 7-12. Mockup desain
gen mockup-feed 1024x1024 "smartphone displaying elegant Instagram feed grid with consistent warm earthy visual style, held by hand, top view desk"
gen mockup-carousel 1024x1024 "fanned out set of six matching social media carousel slide designs in warm terracotta and cream palette, printed cards mockup"
gen mockup-story 768x1344 "smartphone mockup showing vertical full-screen social media story design, bold gradient amber background with abstract shapes"
gen mockup-poster 864x1152 "promotional poster mockup pinned on textured concrete wall, modern geometric design with warm color blocking, gallery setting"
gen mockup-logo 1024x1024 "luxury logo branding mockup: embossed abstract geometric monogram on business cards and letterhead, dark and gold"
gen mockup-menu 864x1152 "elegant restaurant menu design mockup on wooden table beside coffee cup and plant, modern minimalist layout"

# 13-17. Mockup video & web
gen mockup-video 1344x768 "professional video editing suite: monitor showing video editing timeline with color grading panels, headphones, warm dim studio"
gen mockup-web-laptop 1344x768 "sleek laptop mockup on clean desk displaying modern landing page website design with blurred placeholder text, hero section with product photo"
gen mockup-ecommerce 1344x768 "laptop and smartphone showing modern e-commerce online shop interface with product grid, warm minimal workspace"
gen port-company 1344x768 "desktop computer displaying professional company profile website with elegant about-us page layout, blurred text, modern office"
gen port-ugc 768x1344 "hand holding smartphone vertically showing short-form video content of unboxing product with aesthetic props, no face visible"

# 18-21. Mockup tambahan
gen mockup-foto 1024x1024 "professional product photography scene: cosmetic bottle on stone podium with dramatic warm lighting and shadow, studio setup"
gen mockup-iklan 1024x1024 "three social media advertisement creative designs mockup displayed on phones side by side, bold promotional layouts in warm palette"
gen mockup-banner 1344x768 "large vinyl banner mockup hanging on building facade, modern grand opening promotional design with abstract shapes"
gen mockup-app 1344x768 "dashboard application interface mockup on monitor with charts and analytics panels, blurred text, warm dark theme UI"

# 22. Ikon app / logo mark
gen icon-1024 1024x1024 "minimalist app icon: abstract geometric letter A monogram formed by camera aperture blades, amber gradient on dark charcoal background, flat design, centered, no text"

echo "=== DONE ==="
ls -la "$DIR"
