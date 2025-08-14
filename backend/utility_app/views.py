from django.http import HttpResponse
from PIL import Image, ImageDraw
from io import BytesIO

def placeholder_image(request, width, height):
    """
    Generate a placeholder image with the specified dimensions.
    The image will be a gray rectangle with colored sections.
    """
    # Ensure reasonable size limits
    width = min(max(int(width), 1), 2000)
    height = min(max(int(height), 1), 2000)
    
    # Create a new image with the specified size
    image = Image.new('RGB', (width, height), color=(229, 231, 235))  # #E5E7EB light gray
    draw = ImageDraw.Draw(image)
    
    # Draw a border
    draw.rectangle([(0, 0), (width-1, height-1)], outline=(156, 163, 175))  # #9CA3AF medium gray
    
    # Draw diagonal lines instead of text (simpler and works without fonts)
    draw.line([(0, 0), (width, height)], fill=(107, 114, 128), width=2)  # #6B7280 dark gray
    draw.line([(0, height), (width, 0)], fill=(107, 114, 128), width=2)  # #6B7280 dark gray
    
    # Draw a rectangle with the dimensions in the center
    center_width = min(width // 2, 80)
    center_height = min(height // 3, 30)
    center_x = (width - center_width) // 2
    center_y = (height - center_height) // 2
    
    # Draw a colored rectangle in the center
    draw.rectangle(
        [(center_x, center_y), (center_x + center_width, center_y + center_height)],
        fill=(249, 115, 22)  # #F97316 Foxi Orange
    )
    
    # Save to BytesIO
    buffer = BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)
    
    # Return as HTTP response
    return HttpResponse(buffer, content_type='image/png')
