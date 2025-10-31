# Image Attachments Documentation

## Overview
The exam application supports both single and multiple image attachments per question. The system is fully backward compatible, supporting both the original single image format and the new multiple attachment format.

## File Organization
All attachment files must be stored in the `/attachments/` folder with the following guidelines:
- Supported formats: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`
- Files should be reasonably sized for web display (recommended: under 2MB each)
- Use descriptive filenames that relate to the question content

## Attachment Formats

### Single Image (Legacy Format)
```json
{
  "id": 224,
  "question": "Based on the airspace chart shown, what type of airspace surrounds the major airport?",
  "type": "multiple-choice",
  "attachment": "sample-airspace-chart.svg",
  "answers": [
    "Class A airspace",
    "Class B airspace",
    "Class C airspace"
  ],
  "correctAnswer": 1,
  "explanation": "The chart shows Class B airspace..."
}
```

### Multiple Images (New Format)
```json
{
  "id": 225,
  "question": "Refer to the attached airspace charts and weather maps...",
  "type": "multiple-choice",
  "attachments": ["chart1.svg", "chart2.png", "weather-diagram.jpg"],
  "answers": [
    "VFR conditions throughout",
    "IFR conditions in sector 2",
    "Mixed conditions"
  ],
  "correctAnswer": 2,
  "explanation": "Multiple charts show varying weather conditions..."
}
```

## Display Behavior

### Single Image
- Displayed centered below the question text
- Click to enlarge in modal overlay
- Maximum width adapts to screen size

### Multiple Images
- **1 image**: Displayed centered (same as single format)
- **2 images**: Side-by-side grid layout
- **3+ images**: Responsive grid (2-3 columns on desktop, single column on mobile)
- Each image can be clicked to enlarge in modal overlay

## Interactive Features
- **Click to Enlarge**: Users can click on any attachment image to view it in full-screen modal
- **Modal Display**: Enlarged images appear in a dark overlay with the image scaled to fit 90% of the viewport
- **Easy Dismissal**: Click anywhere on the modal background to close the enlarged view
- **Hover Effects**: Images have subtle scaling and shadow effects on hover

## Responsive Design
- **Desktop**: Multi-column grid layouts for multiple images
- **Tablet**: Adapted grid spacing and responsive columns
- **Mobile**: Single column layout for all multiple images
- **All Devices**: Images scale to fit screen width while maintaining aspect ratio

## CSS Classes
The system uses these CSS classes for styling:

- `.question-attachments`: Container for all attachments
- `.attachments-grid`: Grid container with layout variants:
  - `.single`: Single centered image
  - `.double`: Two-column grid for 2 images
  - `.multiple`: Responsive grid for 3+ images
- `.attachment-item`: Individual attachment container
- `.attachment-image`: Image styling with hover effects
- `.image-modal`: Full-screen modal for enlarged images

## Error Handling
- Missing images display console warnings but don't break the application
- Invalid file paths are handled gracefully
- Mixed single/multiple formats work seamlessly
- Questions without attachments display normally

## File Structure
```
/online-exam/
├── attachments/           # Folder for all image files
│   ├── README.md         # Attachments documentation
│   ├── sample-airspace-chart.svg  # Sample image
│   └── [your-images...]  # Add your image files here
├── exam-data.json        # Questions with optional attachment properties
├── script.js            # Handles image display logic
├── styles.css           # Image styling and layouts
└── index.html           # Main application
```

## Migration Guide

### From Single to Multiple
To convert a single attachment question to multiple attachments:

**Before:**
```json
"attachment": "chart.svg"
```

**After:**
```json
"attachments": ["chart.svg"]
```

### Adding Multiple Images
Simply provide an array of filenames:
```json
"attachments": ["diagram1.png", "chart2.svg", "reference3.jpg"]
```

## Best Practices
1. **File Naming**: Use descriptive names that relate to question content
2. **Include Question ID**: For easy reference (e.g., `question-45-airspace-chart.png`)
3. **Optimize Images**: Compress for web without losing quality
4. **Use SVG**: Recommended for charts and diagrams
5. **Test Responsiveness**: Verify display on desktop, tablet, and mobile
6. **Relevance**: Ensure images enhance question understanding

## Technical Notes
- The system checks for both `attachment` and `attachments` properties
- Backward compatibility is maintained for existing single-image questions
- No migration required for existing data
- New questions can use either format as needed
- Images are loaded asynchronously and don't block question rendering
- The system is designed to be easily extensible for future enhancements

#### File Naming Convention
- Use descriptive names: `question-{id}-{description}.{ext}`
- Examples:
  - `question-45-airspace-chart.png`
  - `question-78-weather-map.jpg`
  - `question-120-aircraft-diagram.svg`

#### Image Specifications
- **Max width**: Images automatically scale to fit container
- **Recommended width**: 400-800px for optimal display
- **File size**: Keep under 500KB for fast loading
- **Aspect ratio**: Any ratio works, but 4:3 or 16:10 are ideal

#### Visual Design
- Use clear, high-contrast images
- Ensure text in images is readable at smaller sizes
- Consider color-blind accessibility
- Use SVG for charts and diagrams when possible

### Technical Implementation

#### Frontend Display
```javascript
// In displayQuestion() function
if (question.attachment) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'question-image-container';

    const image = document.createElement('img');
    image.src = `attachments/${question.attachment}`;
    image.alt = 'Question illustration';
    image.className = 'question-image';

    // Error handling for missing images
    image.onerror = function() {
        imageContainer.innerHTML = `<p>Image not found: ${question.attachment}</p>`;
    };

    imageContainer.appendChild(image);
    questionText.appendChild(imageContainer);
}
```

#### CSS Styling
```css
.question-image-container {
    margin: 15px 0;
    text-align: center;
}

.question-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
}
```

### Benefits of This Approach

#### Advantages
1. **Simple Implementation**: Just add filename to question object
2. **Flexible**: Works with any image format
3. **Fallback Support**: Graceful handling of missing images
4. **Performance**: Images load independently, don't block question display
5. **Maintainable**: Clear separation of content and assets
6. **Scalable**: Easy to add/remove images without code changes

#### Best Practices
1. **Optimize Images**: Compress images for web use
2. **Alt Text**: Automatically provided for accessibility
3. **Error Handling**: Missing images show helpful message
4. **Responsive**: Images scale on mobile devices
5. **Loading**: Images load asynchronously

### Usage Examples

#### Aviation Charts
- Sectional charts for airspace questions
- Approach plates for instrument procedures
- Weather maps for meteorology questions

#### Aircraft Systems
- Cockpit instrument panels
- Engine diagrams
- System schematics

#### Regulations
- Airport diagrams for traffic pattern questions
- Runway layout charts
- Navigation equipment illustrations

### Future Enhancements

#### Possible Improvements
1. **Image Zoom**: Click to enlarge functionality
2. **Multiple Images**: Support for image galleries per question
3. **Image Annotations**: Clickable hotspots on images
4. **Lazy Loading**: Load images only when question is displayed
5. **Image Caching**: Browser caching optimization

#### Alternative Approaches Considered
1. **Base64 Encoding**: Embed images directly in JSON (rejected: large file sizes)
2. **External URLs**: Link to external image hosting (rejected: dependency issues)
3. **Database Storage**: Store images in database (rejected: complexity)

### Migration Guide

#### Adding Images to Existing Questions
1. Place image file in `/attachments/` folder
2. Add `"attachment": "filename.ext"` to question object
3. Test that image displays correctly
4. Update question text if needed to reference the image

#### Example Migration
```json
// Before
{
  "id": 45,
  "question": "What type of airspace is shown in a typical Class B configuration?",
  "answers": ["...", "...", "..."]
}

// After
{
  "id": 45,
  "question": "What type of airspace is shown in the chart?",
  "attachment": "class-b-airspace.png",
  "answers": ["...", "...", "..."]
}
```

This implementation provides a robust, flexible foundation for including visual content in exam questions while maintaining simplicity and performance.