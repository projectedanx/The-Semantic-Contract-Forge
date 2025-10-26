
from playwright.sync_api import sync_playwright, Page, expect

def verify_role_generation():
    """
    This test verifies that clicking the 'Generate Role' button puts the UI into a loading state.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:3000")
            # 1. Arrange: Go to the application homepage and set up the state.
            page.goto("http://localhost:3000")

            print("Waiting for Prompt Contract Editor to be visible.")
            editor_heading = page.get_by_role("heading", name="Prompt Contract Editor")
            expect(editor_heading).to_be_visible(timeout=10000)
            print("Editor is visible.")

            print("Switching to Pro tier.")
            page.get_by_role("button", name="Pro Advanced contract-based prompts for professional developers.").click()
            print("Switched to Pro tier.")

            print("Clicking 'Generate Role with AI' button to show the generator.")
            page.get_by_title("Generate Role with AI").click()
            print("Generator is visible.")

            # 2. Act: Fill the form and click the button to trigger the loading state.
            print("Filling persona textarea.")
            persona_textarea = page.get_by_placeholder("e.g., 'A witty pirate captain who explains things in nautical terms.'")
            expect(persona_textarea).to_be_enabled()
            persona_textarea.fill("A friendly and helpful AI assistant.")
            print("Textarea filled.")

            print("Clicking 'Generate Role' button.")
            page.get_by_role("button", name="Generate Role", exact=True).click()
            print("Generate button clicked.")

            # 3. Assert: Check that the button is now in a loading state.
            print("Waiting for the loading state to appear.")
            generating_button = page.get_by_role("button", name="Generating...")
            expect(generating_button).to_be_visible()
            print("Button is in the correct loading state.")

            # 4. Screenshot: Capture the loading state for visual verification.
            print("Taking screenshot.")
            # We'll screenshot the whole editor to give context.
            prompt_editor = page.locator('.space-y-6.bg-slate-800\\/30')
            prompt_editor.screenshot(path="jules-scratch/verification/verification.png")
            print("Screenshot taken successfully.")

        finally:
            browser.close()
            print("Browser closed.")

if __name__ == "__main__":
    verify_role_generation()
