import sys
import os

# Install python-pptx if not present
try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-pptx"])
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN

def create_presentation():
    prs = Presentation()
    # Set to widescreen 16:9
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Sakura Noir Palette Colors
    BG_COLOR = RGBColor(12, 8, 13)       # Deep Plum background
    ROSE_COLOR = RGBColor(255, 45, 120)  # Neon Rose titles
    VIOLET_COLOR = RGBColor(192, 132, 252) # Soft Violet accents
    WHITE_COLOR = RGBColor(255, 240, 245) # Sakura White body text
    GRAY_COLOR = RGBColor(155, 126, 160)  # Muted secondary text
    
    slides = [
        {
            "num": "01",
            "title": "LaunchMind",
            "tagline": "Curing the Builder's Blindspot. Validate before you build.",
            "bullets": [
                "AI-Powered Startup Validation & Interactive VC Pitch Engine",
                "Presenter: Swaraj Kumar Behera & Prajakta Kuila (Team: Dynamic Duo)",
                "Track: Generative AI & Startup Innovation Track",
                "GitHub Repository: https://github.com/swaraj3092/LaunchMind"
            ],
            "note": "We are introducing LaunchMind, the AI co-founder that helps you validate ideas before writing code."
        },
        {
            "num": "02",
            "title": "The Problem",
            "tagline": "The Startup Graveyard — Building blind.",
            "bullets": [
                "The Builder's Blindspot: spending 6 months coding before spending 6 minutes validating.",
                "CB Insights: 'No Market Need' is the #1 cause of startup post-mortems (35%).",
                "Founders rely on supportive friends instead of objective market feedback.",
                "Expert startup advice and partner-level feedback is expensive and out of reach."
            ],
            "note": "Technical founders are biased toward action. They write code first and validate later, creating solutions for non-existent problems."
        },
        {
            "num": "03",
            "title": "The Solution",
            "tagline": "An always-on AI co-founder that stress-tests your idea.",
            "bullets": [
                "Idea Interrogation: A personalized 5-question PM validation engine (Roast Mode 🔥).",
                "Live Web Intel: Real-time search scraping to find active, live competitors.",
                "Assumption Kill-Check: Surfaces the top 3 unvalidated risks that could kill the startup.",
                "Action Roadmap: A structured 30/60/90-day plan with an actionable Day 1 checklist."
            ],
            "note": "LaunchMind extracts assumptions, runs live web comparisons, and hands you an actionable roadmap in minutes."
        },
        {
            "num": "04",
            "title": "How It Works",
            "tagline": "The 4-step validation funnel.",
            "bullets": [
                "1. Raw Idea Input: The founder describes their vision in one simple sentence.",
                "2. AI Interrogation: Answer 5 targeted questions (Normal or Roast Mode 🔥).",
                "3. Plan Synthesis: AI creates roadmap, lists competitors, and calculates market size.",
                "4. Live VC Pitch: Defend the idea in the Pitch Room and get a Venture Readiness Score."
            ],
            "note": "Our workflow guides the founder from raw ideation, to competitive defense, to a formatted execution plan."
        },
        {
            "num": "05",
            "title": "Key Differentiator: VC Pitch Room",
            "tagline": "Interactive VC pitch room with real-time score tracking.",
            "bullets": [
                "3 AI Personas: Marcus Vance (Skeptic), Elena Rostova (Growth), Dr. Aris Thorne (Deep Tech).",
                "Real-time Scoring: Real-time scoreboard updates (+8 Strong, -4 Weak) based on user answers.",
                "AI-driven Due Diligence: 4 rounds of sharp, semantic follow-up questions.",
                "Partner Verdict: Full capital decision (Invest/Pass) with feedback logging."
            ],
            "note": "This is our key differentiator. Founders get grilled by simulated partners to test their market and tech defensibility."
        },
        {
            "num": "06",
            "title": "Market Size & Competition",
            "tagline": "Validating the opportunity.",
            "bullets": [
                "TAM/SAM/SOM Sizing: Interactive charts show Dollar Value market benchmarks.",
                "Competitor Scraper: Real-time DuckDuckGo searches fetch competitor links & descriptions.",
                "benchmarking: Visually benchmarks your idea scores against competitor metrics.",
                "Differentiator Map: Pre-formats differentiators against Wave, FreshBooks, and Contra."
            ],
            "note": "LaunchMind is faster, live-connected, and conversational — moving past static templates to interactive validation."
        },
        {
            "num": "07",
            "title": "Tech Stack & Roadmap",
            "tagline": "Built for speed, safety, and scale.",
            "bullets": [
                "Frontend: React SPA using Vite, TypeScript, TailwindCSS, and Framer Motion.",
                "Backend: FastAPI (Python) asynchronous REST API endpoints.",
                "AI Pipeline: Google Gemini 2.5 Flash + DuckDuckGo live search api.",
                "Traction: Deployed on Vercel. 30/60/90 roadmap targets user accounts and voice integration."
            ],
            "note": "Our stateless backend scales horizontally, using asynchronous parallel requests to Gemini and search to keep response times low."
        },
        {
            "num": "08",
            "title": "Business Model & Team",
            "tagline": "Team Dynamic Duo — Curing the Builder's Blindspot.",
            "bullets": [
                "Freemium Model: 3 free validations/month, Pro plan ($19/mo) for unlimited validations.",
                "Swaraj Kumar Behera — Fullstack Developer & AI Integration Specialist.",
                "Prajakta Kuila — Frontend Engineer & Lead UI/UX Designer.",
                "GitHub Repository: https://github.com/swaraj3092/LaunchMind"
            ],
            "note": "We are Swaraj and Prajakta, team Dynamic Duo, committed to helping developers build products people actually want."
        }
    ]
    
    blank_slide_layout = prs.slide_layouts[6]
    
    for slide_data in slides:
        slide = prs.slides.add_slide(blank_slide_layout)
        
        # Set background to dark plum
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = BG_COLOR
        
        # Slide number indicator (Sakura theme accent)
        num_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.4), Inches(2), Inches(0.8))
        tf_num = num_box.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.text = f"// SLIDE {slide_data['num']}"
        p_num.font.name = "Courier New"
        p_num.font.size = Pt(14)
        p_num.font.bold = True
        p_num.font.color.rgb = VIOLET_COLOR
        
        # Title Box
        title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.8), Inches(12), Inches(1))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = slide_data["title"]
        p_title.font.name = "Arial"
        p_title.font.size = Pt(36)
        p_title.font.bold = True
        p_title.font.color.rgb = ROSE_COLOR
        
        # Tagline Box
        tag_box = slide.shapes.add_textbox(Inches(0.5), Inches(1.8), Inches(12), Inches(0.5))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = slide_data["tagline"]
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(18)
        p_tag.font.italic = True
        p_tag.font.color.rgb = VIOLET_COLOR
        
        # Content Box
        content_box = slide.shapes.add_textbox(Inches(0.5), Inches(2.5), Inches(12.33), Inches(4.2))
        tf_content = content_box.text_frame
        tf_content.word_wrap = True
        
        for bullet_text in slide_data["bullets"]:
            p = tf_content.add_paragraph()
            p.text = "• " + bullet_text
            p.space_after = Pt(14)
            p.font.name = "Arial"
            p.font.size = Pt(16)
            p.font.color.rgb = WHITE_COLOR
            
        # Add speaker notes
        notes_slide = slide.notes_slide
        text_frame = notes_slide.notes_text_frame
        text_frame.text = slide_data["note"]

    # Save presentation
    output_path = "LaunchMind_PitchDeck.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    create_presentation()
