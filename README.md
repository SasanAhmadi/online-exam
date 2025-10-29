# Online Exam - Practice Test Application

A single-page application for conducting online exams and practice tests. This application loads exam definitions from JSON files and provides an interactive interface for users to take exams and view their results.

## Features

- **Multiple Exam Support**: Load different exams from JSON files
- **Interactive Quiz Interface**: Clean, user-friendly interface for taking exams
- **Progress Tracking**: Visual progress bar and question navigation
- **Instant Results**: Comprehensive results with score breakdown
- **Question Review**: Detailed review of all questions with correct/incorrect answers
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Retake Functionality**: Users can retake exams multiple times

## File Structure

```
online-exam/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript application logic
├── exam-data.json      # Sample exam data
└── README.md           # This file
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
1. Select an exam from the dropdown menu
2. Click "Start Exam" to begin
3. Answer questions by clicking on your chosen answer
4. Navigate between questions using "Previous" and "Next" buttons
5. Submit your exam when you've answered all questions
6. Review your results and retake if desired

## Exam Data Format

The application loads exam data from JSON files. Here's the expected format:

```json
[
  {
    "title": "Exam Title",
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