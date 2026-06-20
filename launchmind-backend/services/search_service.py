from duckduckgo_search import DDGS

def search_competitors(idea: str) -> str:
    """
    Searches the live web for competitors or analogous products based on the idea.
    Returns a compiled string of snippets to inject into the prompt.
    """
    query = f"startups doing {idea} alternatives competitors"
    try:
        results = DDGS().text(query, max_results=5)
        snippets = [f"- {res['title']}: {res['body']} ({res['href']})" for res in results]
        return "\n".join(snippets)
    except Exception as e:
        print(f"Search failed: {e}")
        return "No live search results available."
