# Online Exam - Practice Test Application

A single-page application for conducting online exams and practice tests. This application supports multiple question banks and provides an interactive interface for users to take exams and view their results.

## Features

- **Multiple Question Bank Support**: Load different question banks from separate JSON files
- **Subject-Based Organization**: Questions organized by subjects, categories, and subcategories
- **Flexible Question Selection**: Choose specific subcategories or entire categories
- **Interactive Quiz Interface**: Clean, user-friendly interface for taking exams
- **Progress Tracking**: Visual progress bar and question navigation
- **Instant Results**: Comprehensive results with score breakdown
- **Question Review**: Detailed review of all questions with correct/incorrect answers
- **Image Attachments**: Support for single and multiple image attachments per question
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Retake Functionality**: Users can retake exams multiple times

## File Structure

```
online-exam/
├── index.html                    # Main HTML file
├── styles.css                    # CSS styling
├── script.js                     # JavaScript application logic
├── question-banks.json           # Question bank configuration
├── question-banks/               # Question bank files directory
│   ├── canadian-conversion-ppl.json   # Canadian PPL conversion questions
│   └── faa-private-pilot.json         # FAA Private Pilot questions
├── attachments/                  # Image attachments directory
│   ├── README.md                # Attachments documentation
│   └── sample-airspace-chart.svg # Sample image file
├── IMAGE_ATTACHMENTS.md         # Image attachment documentation
└── README.md                    # This file
```

## Question Bank System

### Configuration File (`question-banks.json`)
The main configuration file defines available question banks:

```json
{
  "questionBanks": [
    {
      "id": "canadian-conversion-ppl",
      "name": "Canadian Conversion PPL", 
      "description": "14 CFR Regulations for Canadian License Conversion",
      "file": "question-banks/canadian-conversion-ppl.json",
      "enabled": true
    },
    {
      "id": "faa-private-pilot",
      "name": "FAA Private Pilot",
      "description": "Federal Aviation Administration Private Pilot Questions",
      "file": "question-banks/faa-private-pilot.json", 
      "enabled": true
    }
  ]
}
```

### Question Bank Structure
Each question bank file contains subjects with categories and subcategories:

```json
{
  "subjects": {
    "Subject Name": {
      "description": "Subject description",
      "categories": {
        "Category Name": {
          "Subcategory Name": [
            {
              "id": 1,
              "question": "Question text",
              "type": "multiple-choice",
              "answers": ["Option A", "Option B", "Option C"],
              "correctAnswer": 0,
              "explanation": "Explanation text",
              "attachment": "image.png",           // Single image
              "attachments": ["img1.png", "img2.jpg"] // Multiple images
            }
          ]
        }
      }
    }
  }
}
```

## How to Use

### 1. Setup
1. Clone or download this repository
2. Open the project folder in your web browser by opening `index.html`
3. Or serve the files using a local web server (recommended for loading JSON files)

### 2. Running with a Local Server
For the best experience (especially for loading custom JSON files), use a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open http://localhost:8000 in your web browser.

### 3. Taking an Exam
1. Select question bank(s) from the dropdown (or choose "All Question Banks")
2. Select a subject from the dropdown menu
3. Choose a category
4. Optionally select specific subcategories (leave unchecked to include all)
5. Click "Start Exam" to begin
5. Click "Start Exam" to begin
6. Answer questions by clicking on your chosen answer
7. Navigate between questions using "Previous" and "Next" buttons
8. Submit your exam when you've answered all questions
9. Review your results and retake if desired

## Adding New Question Banks

### 1. Create Question Bank File
Create a new JSON file in the `question-banks/` directory following the structure above.

### 2. Update Configuration
Add your new question bank to `question-banks.json`:

```json
{
  "questionBanks": [
    {
      "id": "your-new-bank",
      "name": "Your New Question Bank", 
      "description": "Description of your question bank",
      "file": "question-banks/your-new-bank.json",
      "enabled": true
    }
  ]
}
```

### 3. Question Guidelines
- **IDs**: Use unique question IDs across all question banks
- **No Overlapping**: Categories/subcategories should not overlap between banks
- **Subjects**: Can span multiple question banks
- **Images**: Store in `/attachments/` folder and reference by filename

## Backward Compatibility

The application maintains backward compatibility with single `exam-data.json` files. If `question-banks.json` is not found, it will fall back to loading `exam-data.json` directly.

## Image Attachments

Questions can include single or multiple image attachments. See `IMAGE_ATTACHMENTS.md` for detailed documentation on the image system.

## Browser Compatibility

- Chrome 80+
- Firefox 74+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Adding New Question Banks

### 1. Create Question Bank File
Create a new JSON file in the `question-banks/` directory following the structure above.

### 2. Update Configuration
Add your new question bank to `question-banks.json`:

```json
{
  "questionBanks": [
    {
      "id": "your-new-bank",
      "name": "Your New Question Bank",
      "description": "Description of your question bank",
      "file": "question-banks/your-new-bank.json",
      "enabled": true
    }
  ]
}
```

### 3. Question Guidelines
- **IDs**: Use unique question IDs across all question banks
- **No Overlapping**: Categories/subcategories should not overlap between banks
- **Subjects**: Can span multiple question banks
- **Images**: Store in `/attachments/` folder and reference by filename

## Backward Compatibility

The application maintains backward compatibility with single `exam-data.json` files. If `question-banks.json` is not found, it will fall back to loading `exam-data.json` directly.

## Image Attachments

Questions can include single or multiple image attachments. See `IMAGE_ATTACHMENTS.md` for detailed documentation on the image system.

## Browser Compatibility

- Chrome 80+
- Firefox 74+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
    "description": "Brief description of the exam",
    "category": "Subject Category",
    "difficulty": "Beginner|Intermediate|Advanced",
    "timeLimit": 30,
    "questions": [
      {
        "id": 1,
        "question": "Your question text here?",
        "type": "multiple-choice",
        "answers": [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        "correctAnswer": 0,
        "explanation": "Explanation of the correct answer"
      }
    ]
  }
]
```

### Field Descriptions:
- `title`: Name of the exam
- `description`: Brief description of what the exam covers
- `category`: Subject category (optional)
- `difficulty`: Difficulty level (optional)
- `timeLimit`: Time limit in minutes (optional, not currently enforced)
- `questions`: Array of question objects
- `question`: The question text
- `answers`: Array of possible answers (currently supports 4 options)
- `correctAnswer`: Index (0-based) of the correct answer
- `explanation`: Explanation of why the answer is correct (optional)

## Customizing Exams

### Adding New Exams
1. Create a new JSON file following the format above
2. Modify the `loadExams()` function in `script.js` to include your new file name in the `examFiles` array

### Modifying Existing Exams
1. Edit the `exam-data.json` file
2. Add, remove, or modify questions as needed
3. Ensure the `correctAnswer` index matches your intended correct answer

## Browser Compatibility

This application works in all modern browsers that support:
- ES6 Classes
- Fetch API
- CSS Grid and Flexbox
- Local Storage (for potential future enhancements)

## Future Enhancements

Potential features that could be added:
- Timer functionality
- Score history and analytics
- Different question types (true/false, fill-in-the-blank)
- Exam categories and filtering
- User authentication and progress tracking
- Export results functionality
- Randomized question order
- Multiple attempts tracking

## License

This project is open source and available under the MIT License.