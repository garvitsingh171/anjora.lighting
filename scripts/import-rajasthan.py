"""Rebuild the public catalogue from preserved source and reviewed image decisions.
Run from the repository root. No network, resizing, or invented technical fields.
"""
import json
import re
from pathlib import Path

source = json.loads(Path('docs/catalogue/catalog.raw.json').read_text())
# Explicit selections after inspecting all 89 PDF pages and all 100 exported images.
# First image is the listing cover; technical images are always paired to their own page.
selections = {
 'sunehri-dhara': ['08-01', '05-01', '06-01'],
 'falpushpa': ['12-02', '10-01', '11-02', '12-01'],
 'abhaas': ['16-01', '14-01', '15-01'],
 'peet-vrinda': ['19-01', '18-01'],
 'chheen': ['23-01', '21-01', '22-02'],
 'maru-bel': ['26-01', '25-01', '27-01'],
 'chidkoli': ['31-01', '29-01', '28-01', '30-01', '30-03'],
 'kaag': ['35-01', '33-01', '34-02'],
 'shilora': ['39-01', '37-01', '38-01'],
 'atki-badli': ['43-01', '41-01', '42-02'],
 'shilpstambh': ['47-02', '45-01', '46-01', '47-01', '48-01', '49-01'],
 'dhwani-stambh': ['52-01', '51-01', '54-01', '55-01', '56-01'],
 'vrikshamani': ['60-01', '58-01', '59-01'],
 'minar': ['63-02', '62-01', '64-01', '65-02', '66-02'],
 'kankad': ['69-01', '68-01', '70-01'],
 'phog': ['72-01', '73-01', '74-01', '75-01', '76-01'],
 'imlika': ['80-01', '78-01', '79-01'],
 'meghchhatra': ['84-01', '82-01', '83-01'],
}
excluded_story_pages = {15, 34, 38, 42, 46, 63}
review = {
 'sunehri-dhara': ['Page 7 shows a different vertical composition without its own technical block; omitted from public gallery.'],
 'abhaas': ['Page 15 red-leaf/golden-ring narrative does not clearly match the technical photograph; omitted pending confirmation.'],
 'chheen': ['Page 22 image 01 depicts Peet Vrinda, not CHHEEN; excluded.'],
 'chidkoli': ['Page 30 image 02 depicts CHHEEN; excluded.'],
 'kaag': ['Page 34 repeated Luma Birds story omitted; image 01 depicts CHIDKOLI and is excluded. Page 32 mentions quartz/amethyst, while page 33 specifies alabaster; material filter uses only the technical field.'],
 'shilora': ['Page 38 repeated Luma Birds story omitted.'],
 'atki-badli': ['Page 42 repeated Luma Birds story omitted; image 01 depicts Shilora and is excluded.'],
 'shilpstambh': ['Page 46 bronze/glass narrative conflicts with page 45 powder-coated metal/alabaster; omitted. Pages 48–49 are alternate compositions with no separate technical specifications. G9 Blub Holder corrected to G9 Bulb Holder.'],
 'dhwani-stambh': ['Pages 54–56 have no distinct names; separate source-linked configurations, family classification pending. Page 55 material ends in meta; do not infer metal. Page 53 has a different form without paired specifications; retained internally only. Sound/aroma claim on page 50 is not extended to additional configurations.'],
 'minar': ['Page 63 woodwork story and image 01 belong to Vrikshamani; excluded. White/blue/red visualizations have no separate finish or electrical specifications; do not imply selectable RGB controls.'],
 'phog': ['Pages 72, 73, 75 retained as independent configurations with matching images; official variant names pending.'],
}

def clean(text):
 return re.sub(r'\s+', ' ', text).strip().replace('llumination', 'illumination').replace('BELbalances', 'BEL balances').replace('space white the', 'space while the').replace('app- controlled', 'app-controlled')

result=[]; asset_paths=set(); decisions=[]
for raw in source['products']:
 slug=raw['slug']; imgs=[im for group in raw['imagesByPage'].values() for im in group]
 if slug not in selections:
  decisions.append({'slug':slug,'status':'name-confirmation-required','sourcePages':raw['sourcePages'],'images':[dict(im,decision='internal-only: unnamed design') for im in imgs]})
  continue
 chosen=[f"images/{slug}/p{v.split('-')[0]}-image-{v.split('-')[1]}.webp" for v in selections[slug]]
 def image_record(im):
  page=im['sourcePage']; technical=page in raw['technicalPages']
  # These configuration relationships are verified visually and against the PDF.
  config_page = page if technical else ({52:51}.get(page) if slug=='dhwani-stambh' else {74:73,76:75}.get(page) if slug=='phog' else raw['technicalPages'][0])
  variant_visual=(slug=='minar' and page>=64) or (slug=='shilpstambh' and page>=48)
  if variant_visual: config_page=None
  role='technical' if technical else 'lifestyle'
  caption='Product view' if technical else 'In context'
  if variant_visual: caption='Alternate catalogue composition · confirm finish and specifications with Anjora'
  return {'path':im['path'].replace('images/',''),'width':im['width'],'height':im['height'],'sourcePage':page,'role':role,'configurationPage':config_page,'alt':f"{raw['name']} — {caption.lower()}",'caption':caption}
 images=[image_record(next(im for im in imgs if im['path']==path)) for path in chosen]
 asset_paths.update(im['path'] for im in images)
 configs=[]
 for v in raw['technicalVariants']:
  spec_image=next(im for im in images if im['sourcePage']==v['catalogPage'])
  configs.append({'sourcePage':v['catalogPage'],'finish':v['finish'],'material':v['material'] if v['catalogPage']!=55 else 'Ceramic, Glass and “meta” (source incomplete; please confirm)', 'lightSource':v['lightSource'].replace('Blub','Bulb'),'weight':v['weight'].replace('Kg','kg').replace('(per pcs)','per piece'),'sizes':[re.sub(r'^Size\s*:\s*','',s).replace('2100mm','2100 mm') for s in v['sizes']],'customization':v['customizableStatement'],'image':spec_image,'reviewStatus':'needs-client-review' if len(raw['technicalVariants'])>1 else 'verified-from-catalogue'})
 intro=clean(raw['sourceIntroduction']); prefix=clean(raw['name']+' '+raw['subtitle']); intro=intro.removeprefix(prefix).strip()
 story=[{'text':clean(t),'sourcePage':int(page)} for page,t in raw['otherTextByPage'].items() if int(page) not in excluded_story_pages]
 # The app/sound/aroma statement belongs to page 50, not every unnamed configuration.
 if slug=='dhwani-stambh':
  intro='The illumination is warm, intimate, and atmospheric. The perforated mesh transforms light into a subtle, ever-changing pattern.'
  story=[{'text':'The main design is described in the catalogue with an app-controlled sound system and an aroma diffuser. Contact Anjora to confirm the features of your chosen configuration.','sourcePage':50}]
 materials=' '.join(v['material'] for v in raw['technicalVariants']).lower()
 tags=[tag for tag,pattern in [('Alabaster',r'alabaster'),('Glass',r'glass'),('Metal',r'metal|brass|steel'),('Jute & leather',r'jute|leather'),('Wood & ceramic',r'wood|ceramic|pottery')] if re.search(pattern,materials)]
 result.append({'id':'rajasthan-'+slug,'slug':slug,'name':raw['name'],'collection':'Rajasthan','subtitle':raw['subtitle'],'introduction':intro,'introductionPage':raw['sourcePages'][0],'story':story,'materials':tags,'cover':images[0],'gallery':images[1:],'configurations':configs,'customizable':True,'sourcePdf':raw['sourcePDF'],'sourcePages':raw['sourcePages'],'reviewStatus':'needs-client-review' if slug in review else 'verified-from-catalogue','reviewNotes':review.get(slug,[])})
 decisions.append({'slug':slug,'cover':chosen[0],'notes':review.get(slug,[]),'images':[dict(im,decision='public: '+image_record(im)['role'] if im['path'] in chosen else 'internal-only: inspiration, duplicate, mismatched or unpaired configuration') for im in imgs]})
Path('src/data/rajasthan.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
Path('docs/catalogue/image-review.json').write_text(json.dumps(decisions,ensure_ascii=False,indent=2)+'\n')
paths=sorted(asset_paths)
Path('src/data/catalogue-images.ts').write_text('// Generated by scripts/import-rajasthan.py. Only reviewed images enter the public bundle.\n'+''.join(f"import image{i} from '../assets/products/rajasthan/{p}'\n" for i,p in enumerate(paths))+"\nexport const catalogueImages: Record<string, string> = {\n"+''.join(f"  '{p}': image{i},\n" for i,p in enumerate(paths))+'}\n')
print(f'Generated {len(result)} named designs, {sum(len(p["configurations"]) for p in result)} configurations, {len(paths)} reviewed images. All 100 source images retained.')
