"""
Slug generation utility for URLs.
"""

from slugify import slugify


def generate_slug(text: str, max_length: int = 100) -> str:
    """
    Generate URL-friendly slug from text.

    Args:
        text: Text to convert
        max_length: Maximum slug length

    Returns:
        URL-friendly slug
    """
    slug = slugify(text, max_length=max_length, word_boundary=True)
    return slug
