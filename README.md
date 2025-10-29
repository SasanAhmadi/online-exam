# Online Exam System

A web-based exam application that uses exam definitions with question banks in JSON format. The application works completely client-side without any database or server-side storage, making it perfect for ad-hoc testing and practice exams.

## Features

- **Multiple Exam Support**: Load different exams from JSON files
- **Interactive Interface**: Clean and responsive user interface
- **Timer**: Countdown timer for each exam
- **Progress Tracking**: Visual progress bar showing exam completion
- **Instant Results**: View your score and review answers immediately after submission
- **No Backend Required**: Works entirely in the browser with no database or server
- **Session-Based**: All data is stored in memory during the active session only

## How to Use

1. Open `index.html` in your web browser
2. Select an exam from the available options
3. Click "Start Exam" to begin
4. Answer the questions by selecting options
5. Navigate between questions using Previous/Next buttons
6. Submit the exam when complete or when time runs out
7. Review your results and correct answers

## Exam Format

Exams are defined in JSON format in the `exams/` directory. Each exam file should follow this structure:

```json
{
  "id": "exam-id",
  "title": "Exam Title",
  "description": "Brief description of the exam",
  "duration": 30,
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correctAnswer": 0
    }
  ]
}
```

## Adding New Exams

1. Create a new JSON file in the `exams/` directory
2. Follow the exam format structure above
3. Add the exam reference to the `availableExams` array in `app.js`
4. Reload the page to see the new exam

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- JSON for data storage

## License

This project is open source and available for educational purposes.