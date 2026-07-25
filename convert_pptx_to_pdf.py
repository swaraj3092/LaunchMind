import sys
import os
import subprocess

try:
    import comtypes.client
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "comtypes"])
    import comtypes.client

def convert_to_pdf():
    input_path = os.path.abspath("LaunchMind_PitchDeck.pptx")
    output_path = os.path.abspath("LaunchMind_PitchDeck.pdf")
    
    if not os.path.exists(input_path):
        print(f"Error: Could not find input file: {input_path}")
        return

    print("Opening PowerPoint application...")
    try:
        powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
        # Keep presentation window hidden
        powerpoint.Visible = 1
        
        print(f"Opening presentation: {input_path}")
        deck = powerpoint.Presentations.Open(input_path)
        
        print(f"Saving as PDF: {output_path}")
        deck.SaveAs(output_path, 32) # 32 represents ppSaveAsPDF
        
        deck.Close()
        powerpoint.Quit()
        print(f"Success! PDF created successfully at: {output_path}")
    except Exception as e:
        print(f"PowerPoint conversion failed: {e}")
        print("Note: Please open the PPTX file manually in PowerPoint and save it as a PDF.")

if __name__ == "__main__":
    convert_to_pdf()
