// App.js
import React, { useState, useEffect } from 'react';
import './cpp.css';

const Python = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Python Coding Questions
  const questions = [
    {
      id: 1,
      title: "Hello World",
      description: "Write a Python program that prints 'Hello, World!' to the console.",
      testCases: [
        { input: "", expectedOutput: "Hello, World!" }
      ]
    },
    {
      id: 2,
      title: "Sum of Two Numbers",
      description: "Write a program that takes two integers as input and returns their sum.",
      testCases: [
        { input: "5\n3", expectedOutput: "8" },
        { input: "10\n15", expectedOutput: "25" }
      ]
    },
    {
      id: 3,
      title: "Factorial",
      description: "Write a program to calculate the factorial of a given number.",
      testCases: [
        { input: "5", expectedOutput: "120" },
        { input: "0", expectedOutput: "1" }
      ]
    },
    {
      id: 4,
      title: "Fibonacci Sequence",
      description: "Write a program to print the first n numbers of the Fibonacci sequence.",
      testCases: [
        { input: "5", expectedOutput: "0 1 1 2 3" },
        { input: "7", expectedOutput: "0 1 1 2 3 5 8" }
      ]
    },
    {
      id: 5,
      title: "Prime Number Check",
      description: "Write a program to check if a given number is prime.",
      testCases: [
        { input: "7", expectedOutput: "Prime" },
        { input: "9", expectedOutput: "Not Prime" }
      ]
    },
    {
      id: 6,
      title: "Palindrome Check",
      description: "Write a program to check if a given string is a palindrome.",
      testCases: [
        { input: "madam", expectedOutput: "Palindrome" },
        { input: "hello", expectedOutput: "Not Palindrome" }
      ]
    },
    {
      id: 7,
      title: "List Sum",
      description: "Write a program to find the sum of all elements in a list.",
      testCases: [
        { input: "5\n1 2 3 4 5", expectedOutput: "15" },
        { input: "3\n10 20 30", expectedOutput: "60" }
      ]
    },
    {
      id: 8,
      title: "Reverse String",
      description: "Write a program to reverse a given string.",
      testCases: [
        { input: "hello", expectedOutput: "olleh" },
        { input: "programming", expectedOutput: "gnimmargorp" }
      ]
    },
    {
      id: 9,
      title: "Find Maximum",
      description: "Write a program to find the maximum number in a list.",
      testCases: [
        { input: "5\n3 7 2 9 1", expectedOutput: "9" },
        { input: "4\n10 20 5 15", expectedOutput: "20" }
      ]
    },
    {
      id: 10,
      title: "GCD of Two Numbers",
      description: "Write a program to find the Greatest Common Divisor of two numbers.",
      testCases: [
        { input: "12\n18", expectedOutput: "6" },
        { input: "35\n10", expectedOutput: "5" }
      ]
    }
  ];

  // Default code templates for each question
  const defaultCodes = [
    `print("Hello, World!")`,
    `a = int(input())\nb = int(input())\nprint(a + b)`,
    `n = int(input())\nfact = 1\nfor i in range(1, n + 1):\n    fact *= i\nprint(fact)`,
    `n = int(input())\na, b = 0, 1\nfor i in range(n):\n    print(a, end=" ")\n    a, b = b, a + b`,
    `n = int(input())\nis_prime = True\nif n <= 1:\n    is_prime = False\nelse:\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            is_prime = False\n            break\nprint("Prime" if is_prime else "Not Prime")`,
    `s = input()\nprint("Palindrome" if s == s[::-1] else "Not Palindrome")`,
    `n = int(input())\nnumbers = list(map(int, input().split()))\nprint(sum(numbers))`,
    `s = input()\nprint(s[::-1])`,
    `n = int(input())\nnumbers = list(map(int, input().split()))\nprint(max(numbers))`,
    `import math\na = int(input())\nb = int(input())\nprint(math.gcd(a, b))`
  ];

  // Initialize code when question changes
  useEffect(() => {
    setCode('');
    setOutput('');
  }, [currentQuestion]);

  const runCode = async () => {
    setIsLoading(true);
    setOutput('Running code...');

    try {
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': '3644dbd92cmsh3e86c10b179c9a5p1b5647jsnc465708e8193', // Replace with your RapidAPI key
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          source_code: code,
          language_id: 71, // Python language ID (changed from 54 to 71)
          stdin: questions[currentQuestion].testCases[0].input
        })
      });

      const submission = await response.json();
      
      // Poll for result
      const token = submission.token;
      let result = null;
      
      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const resultResponse = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              'X-RapidAPI-Key': '3644dbd92cmsh3e86c10b179c9a5p1b5647jsnc465708e8193',
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
          }
        );
        result = await resultResponse.json();
      } while (result.status && result.status.id <= 2);

      if (result.stdout) {
        const outputText = result.stdout.trim();
        setOutput(`Output: ${outputText}`);
        
        // Check if output matches expected output
        const expected = questions[currentQuestion].testCases[0].expectedOutput;
        if (outputText === expected) {
          setOutput(prev => prev + '\n✅ Test Passed!');
        } else {
          setOutput(prev => prev + `\n❌ Expected: ${expected}`);
        }
      } else if (result.stderr) {
        setOutput(`Error: ${result.stderr}`);
      } else if (result.compile_output) {
        setOutput(`Compilation Error: ${result.compile_output}`);
      } else {
        setOutput('Unknown error occurred');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const submitCode = async () => {
    setIsLoading(true);
    setOutput('Evaluating...');

    try {
      let allTestsPassed = true;
      
      for (const testCase of questions[currentQuestion].testCases) {
        const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '3644dbd92cmsh3e86c10b179c9a5p1b5647jsnc465708e8193',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          },
          body: JSON.stringify({
            source_code: code,
            language_id: 71, // Python language ID
            stdin: testCase.input
          })
        });

        const submission = await response.json();
        const token = submission.token;
        let result = null;
        
        do {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const resultResponse = await fetch(
            `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            {
              headers: {
                'X-RapidAPI-Key': '3644dbd92cmsh3e86c10b179c9a5p1b5647jsnc465708e8193',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
              }
            }
          );
          result = await resultResponse.json();
        } while (result.status && result.status.id <= 2);

        if (result.stdout && result.stdout.trim() === testCase.expectedOutput) {
          setOutput(prev => prev + `\n✅ Test case passed: Input="${testCase.input}", Expected="${testCase.expectedOutput}"`);
        } else {
          setOutput(prev => prev + `\n❌ Test case failed: Input="${testCase.input}", Expected="${testCase.expectedOutput}", Got="${result.stdout ? result.stdout.trim() : 'No output'}"`);
          allTestsPassed = false;
        }
      }

      if (allTestsPassed) {
        setOutput(prev => prev + '\n🎉 All test cases passed! Moving to next question...');
        setScore(prev => prev + 1);
        
        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
          } else {
            setCompleted(true);
          }
        }, 2000);
      } else {
        setOutput(prev => prev + '\n❌ Some test cases failed. Please fix your code.');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCode = () => {
    setCode('');
    setOutput('');
  };

  if (completed) {
    return (
      <div className="app">
        <div className="completion-screen">
          <h1>🎊 Congratulations! 🎊</h1>
          <h2>You've completed all questions!</h2>
          <div className="score-card">
            <h3>Final Score: {score} / {questions.length}</h3>
            <p>Thank you for completing the Python coding challenge!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Python Coding Challenge</h1>
        <div className="progress">
          Question {currentQuestion + 1} of {questions.length}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="score">Score: {score}</div>
      </div>

      <div className="content">
        <div className="question-section">
          <h2>{questions[currentQuestion].title}</h2>
          <p>{questions[currentQuestion].description}</p>
          <div className="test-cases">
            <h4>Additional Info:</h4>
            {questions[currentQuestion].testCases.map((testCase, index) => (
              <div key={index} className="test-case">
                <strong>Input:</strong> {testCase.input || "(none)"}<br />
                <strong>Expected Output:</strong> {testCase.expectedOutput}
              </div>
            ))}
          </div>
        </div>

        <div className="editor-section">
          <div className="editor-header">
            <h3>Code Editor (Python)</h3>
            <div className="editor-buttons">
              <button onClick={resetCode} disabled={isLoading}>Reset</button>
              <button onClick={runCode} disabled={isLoading}>Run Code</button>
              <button onClick={submitCode} disabled={isLoading} className="submit-btn">
                Submit & Next
              </button>
              <button onClick={() => setCode(defaultCodes[currentQuestion])} disabled={isLoading}>Show Solution</button>
            </div>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="code-editor"
            placeholder="Write your Python code here..."
            disabled={isLoading}
          />
          
          <div className="output-section">
            <h4>Output:</h4>
            <pre className="output">{isLoading ? 'Loading...' : output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Python;