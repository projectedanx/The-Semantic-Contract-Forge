from playwright.sync_api import sync_playwright

def verify_api_key_input(page):
    # Navigate to the app
    page.goto("http://localhost:3000")

    # Wait for the page to load
    page.wait_for_selector("text=Gemini API Key")

    # Fill in the API Key input
    api_key_input = page.get_by_placeholder("Enter your Gemini API Key...")
    api_key_input.fill("test_api_key_123")

    # Verify the value is set
    assert api_key_input.input_value() == "test_api_key_123"

    # Take a screenshot
    page.screenshot(path="/home/jules/verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_api_key_input(page)
        finally:
            browser.close()
