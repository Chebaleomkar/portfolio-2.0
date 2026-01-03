"""
Preprocessing utilities for blog content.
Cleans and prepares blog text for embedding generation.
"""

import re
from typing import Dict, Any, List
from markdown import markdown
from bs4 import BeautifulSoup


def markdown_to_plain_text(md_content: str) -> str:
    """
    Convert markdown content to plain text.
    Removes HTML tags and normalizes whitespace.
    """
    # Convert markdown to HTML
    html = markdown(md_content)
    
    # Parse HTML and extract text
    soup = BeautifulSoup(html, 'html.parser')
    
    # Remove script and style elements
    for script in soup(['script', 'style']):
        script.decompose()
    
    # Get text content
    text = soup.get_text(separator=' ')
    
    return text


def remove_code_blocks(content: str) -> str:
    """
    Remove code blocks from markdown content.
    Keeps the context but removes actual code snippets.
    """
    # Remove fenced code blocks (```...```)
    content = re.sub(r'```[\s\S]*?```', ' [code block] ', content)
    
    # Remove inline code (`...`)
    content = re.sub(r'`[^`]+`', ' [code] ', content)
    
    return content


def clean_text(text: str) -> str:
    """
    Clean text by removing URLs, extra whitespace, and special characters.
    """
    # Remove URLs
    text = re.sub(r'http[s]?://\S+', '', text)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?;:\-\'"]', ' ', text)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Strip leading/trailing whitespace
    text = text.strip()
    
    return text


def extract_keywords_from_tags(tags: List[str]) -> str:
    """
    Convert tags list to a weighted string for embedding.
    Tags are important signals, so we repeat them for emphasis.
    """
    if not tags:
        return ""
    
    # Join tags with spaces, repeat for emphasis
    tag_string = ' '.join(tags)
    return f"Topics: {tag_string}. Keywords: {tag_string}"


def preprocess_blog(blog: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main preprocessing function for a single blog.
    Returns a dict with original metadata and processed text.
    
    Args:
        blog: MongoDB blog document with title, description, content, tags, slug
    
    Returns:
        Dict with slug, metadata, and processed_text ready for embedding
    """
    title = blog.get('title', '')
    description = blog.get('description', '')
    content = blog.get('content', '')
    tags = blog.get('tags', [])
    slug = blog.get('slug', '')
    
    # Process content: remove code blocks, convert to plain text, clean
    content_without_code = remove_code_blocks(content)
    plain_content = markdown_to_plain_text(content_without_code)
    clean_content = clean_text(plain_content)
    
    # Process tags
    tag_text = extract_keywords_from_tags(tags)
    
    # Combine all text with weighted importance
    # Title and description are given more weight by appearing first
    combined_text = f"""
    Title: {title}
    
    Summary: {description}
    
    {tag_text}
    
    Content: {clean_content}
    """.strip()
    
    # Clean the final combined text
    processed_text = clean_text(combined_text)
    
    return {
        'slug': slug,
        'title': title,
        'description': description,
        'tags': tags,
        'processed_text': processed_text,
        'is_starred': blog.get('isStarred', False),
        'published': blog.get('published', True),
    }


def preprocess_blogs(blogs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Preprocess multiple blogs.
    
    Args:
        blogs: List of MongoDB blog documents
    
    Returns:
        List of preprocessed blog dicts
    """
    processed = []
    
    for blog in blogs:
        try:
            processed_blog = preprocess_blog(blog)
            processed.append(processed_blog)
        except Exception as e:
            print(f"Error processing blog {blog.get('slug', 'unknown')}: {e}")
            continue
    
    return processed


# For testing
if __name__ == "__main__":
    # Example blog for testing
    sample_blog = {
        'title': 'Building a Custom Recommendation System',
        'slug': 'custom-recommendation-system',
        'description': 'Learn how to build an ML-powered blog recommendation engine',
        'content': '''
# Introduction

This is a guide to building recommendation systems.

```python
def hello():
    print("Hello World")
```

Visit https://example.com for more info.

## Key Concepts

Machine learning is powerful.
        ''',
        'tags': ['machine-learning', 'python', 'tutorial'],
        'isStarred': True,
        'published': True
    }
    
    result = preprocess_blog(sample_blog)
    print("Processed blog:")
    print(f"Slug: {result['slug']}")
    print(f"Text length: {len(result['processed_text'])} chars")
    print(f"Preview: {result['processed_text'][:200]}...")
