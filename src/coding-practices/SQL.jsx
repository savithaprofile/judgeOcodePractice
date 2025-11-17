// App.js
import React, { useState, useEffect } from 'react';
import './cpp.css';

const SQL = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Sample database schema for reference
  const sampleSchema = `
Employees Table:
+----+-----------+--------+-----------+---------+
| ID | Name      | DeptID | Salary    | ManagerID |
+----+-----------+--------+-----------+---------+
| 1  | John      | 1      | 50000     | NULL    |
| 2  | Jane      | 1      | 60000     | 1       |
| 3  | Bob       | 2      | 55000     | 1       |
| 4  | Alice     | 2      | 70000     | 2       |
| 5  | Charlie   | 3      | 45000     | 2       |
+----+-----------+--------+-----------+---------+

Departments Table:
+----+-----------+
| ID | Name      |
+----+-----------+
| 1  | IT        |
| 2  | HR        |
| 3  | Finance   |
+----+-----------+

Orders Table:
+----+---------+------------+-------+
| ID | CustID  | OrderDate  | Total |
+----+---------+------------+-------+
| 1  | 101     | 2023-01-15 | 1500  |
| 2  | 102     | 2023-01-16 | 2000  |
| 3  | 101     | 2023-01-17 | 800   |
| 4  | 103     | 2023-01-18 | 3000  |
+----+---------+------------+-------+
`;

  // SQL Coding Questions
  const questions = [
    {
      id: 1,
      title: "Select All Employees",
      description: "Write a SQL query to select all columns from the Employees table.",
      testCases: [
        { 
          input: "", 
          expectedOutput: "ID, Name, DeptID, Salary, ManagerID",
          explanation: "Should return all columns from Employees table"
        }
      ]
    },
    {
      id: 2,
      title: "Employees in IT Department",
      description: "Write a SQL query to select names of all employees who work in the IT department (DeptID = 1).",
      testCases: [
        { 
          input: "", 
          expectedOutput: "John, Jane",
          explanation: "Should return employees from IT department only"
        }
      ]
    },
    {
      id: 3,
      title: "Highest Salary",
      description: "Write a SQL query to find the employee with the highest salary.",
      testCases: [
        { 
          input: "", 
          expectedOutput: "Alice",
          explanation: "Should return the employee with maximum salary"
        }
      ]
    },
    {
      id: 4,
      title: "Department-wise Average Salary",
      description: "Write a SQL query to calculate the average salary for each department.",
      testCases: [
        { 
          input: "", 
          expectedOutput: "IT: 55000, HR: 62500, Finance: 45000",
          explanation: "Should return average salary grouped by department"
        }
      ]
    },
    {
      id: 5,
      title: "Employees with Managers",
      description: "Write a SQL query to select employees who have a manager, along with their manager's name.",
      testCases: [
        { 
          input: "", 
          expectedOutput: "Jane (Manager: John), Bob (Manager: John), Alice (Manager: Jane), Charlie (Manager: Jane)",
          explanation: "Should return employees with their manager names"
        }
      ]
    },
    {
      id: 6,
      title: "Second Highest Salary",
      description: "Write a SQL query to find the second highest salary from Employees table.",
      testCases: [
        { 
          input: "", 
          expectedOutput: "60000",
          explanation: "Should return the second highest salary value"
        }
      ]
    },
    {
      id: 7,
      title: "Department Employee Count",
      description: "Write a SQL query to count the number of employees in each department.",
      testCases: [
        { 
          input: "", 
          expectedOutput: "IT: 2, HR: 2, Finance: 1",
          explanation: "Should return employee count per department"
        }
      ]
    },
    {
      id: 8,
      title: "Employees Earning More Than Average",
      description: "Write a SQL query to find employees who earn more than the average salary.",
      testCases: [
        { 
          input: "", 
          expectedOutput: "Jane, Alice",
          explanation: "Should return employees with above-average salary"
        }
      ]
    },
    {
      id: 9,
      title: "Join Tables",
      description: "Write a SQL query to display employee names along with their department names.",
      testCases: [
        { 
          input: "", 
          expectedOutput: "John - IT, Jane - IT, Bob - HR, Alice - HR, Charlie - Finance",
          explanation: "Should return employee names with department names"
        }
      ]
    },
    {
      id: 10,
      title: "Customers with Multiple Orders",
      description: "Write a SQL query to find customers who have placed more than one order.",
      testCases: [
        { 
          input: "", 
          expectedOutput: "Customer 101",
          explanation: "Should return customers with multiple orders"
        }
      ]
    }
  ];

  // Default SQL templates for each question
  const defaultCodes = [
    `SELECT * FROM Employees;`,
    `SELECT Name FROM Employees WHERE DeptID = 1;`,
    `SELECT Name FROM Employees ORDER BY Salary DESC LIMIT 1;`,
    `SELECT d.Name, AVG(e.Salary) as AvgSalary 
     FROM Employees e 
     JOIN Departments d ON e.DeptID = d.ID 
     GROUP BY d.Name;`,
    `SELECT e.Name, m.Name as ManagerName 
     FROM Employees e 
     JOIN Employees m ON e.ManagerID = m.ID;`,
    `SELECT DISTINCT Salary FROM Employees 
     ORDER BY Salary DESC 
     LIMIT 1 OFFSET 1;`,
    `SELECT d.Name, COUNT(e.ID) as EmployeeCount 
     FROM Departments d 
     LEFT JOIN Employees e ON d.ID = e.DeptID 
     GROUP BY d.Name;`,
    `SELECT Name FROM Employees 
     WHERE Salary > (SELECT AVG(Salary) FROM Employees);`,
    `SELECT e.Name, d.Name as DepartmentName 
     FROM Employees e 
     JOIN Departments d ON e.DeptID = d.ID;`,
    `SELECT CustID FROM Orders 
     GROUP BY CustID 
     HAVING COUNT(*) > 1;`
  ];

  // Initialize code when question changes
  useEffect(() => {
    setCode('');
    setOutput('');
  }, [currentQuestion]);

  // Simple SQL validator and executor (simulated)
  const executeSQL = (sql, testCase) => {
    // This is a simplified simulation - in a real app, you'd connect to a database
    const queries = {
      // Question 1
      "SELECT * FROM Employees;": "ID, Name, DeptID, Salary, ManagerID",
      
      // Question 2
      "SELECT Name FROM Employees WHERE DeptID = 1;": "John, Jane",
      
      // Question 3
      "SELECT Name FROM Employees ORDER BY Salary DESC LIMIT 1;": "Alice",
      
      // Question 4
      "SELECT d.Name, AVG(e.Salary) as AvgSalary FROM Employees e JOIN Departments d ON e.DeptID = d.ID GROUP BY d.Name;": "IT: 55000, HR: 62500, Finance: 45000",
      
      // Question 5
      "SELECT e.Name, m.Name as ManagerName FROM Employees e JOIN Employees m ON e.ManagerID = m.ID;": "Jane (Manager: John), Bob (Manager: John), Alice (Manager: Jane), Charlie (Manager: Jane)",
      
      // Question 6
      "SELECT DISTINCT Salary FROM Employees ORDER BY Salary DESC LIMIT 1 OFFSET 1;": "60000",
      
      // Question 7
      "SELECT d.Name, COUNT(e.ID) as EmployeeCount FROM Departments d LEFT JOIN Employees e ON d.ID = e.DeptID GROUP BY d.Name;": "IT: 2, HR: 2, Finance: 1",
      
      // Question 8
      "SELECT Name FROM Employees WHERE Salary > (SELECT AVG(Salary) FROM Employees);": "Jane, Alice",
      
      // Question 9
      "SELECT e.Name, d.Name as DepartmentName FROM Employees e JOIN Departments d ON e.DeptID = d.ID;": "John - IT, Jane - IT, Bob - HR, Alice - HR, Charlie - Finance",
      
      // Question 10
      "SELECT CustID FROM Orders GROUP BY CustID HAVING COUNT(*) > 1;": "Customer 101"
    };

    // Check for basic SQL syntax
    const upperSQL = sql.toUpperCase().trim();
    
    if (!upperSQL.startsWith('SELECT')) {
      return { error: "Error: Query must start with SELECT" };
    }
    
    if (upperSQL.includes('DROP') || upperSQL.includes('DELETE') || upperSQL.includes('UPDATE')) {
      return { error: "Error: DROP, DELETE, and UPDATE statements are not allowed" };
    }

    // Check if query matches expected result
    const expectedResult = queries[sql.trim()];
    if (expectedResult) {
      return { result: expectedResult };
    } else {
      return { error: "Query executed but result doesn't match expected output. Check your logic." };
    }
  };

  const runCode = async () => {
    setIsLoading(true);
    setOutput('Executing SQL query...');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = executeSQL(code, questions[currentQuestion].testCases[0]);
      
      if (result.error) {
        setOutput(`Error: ${result.error}`);
      } else {
        setOutput(`Query Result: ${result.result}`);
        
        // Check if output matches expected output
        const expected = questions[currentQuestion].testCases[0].expectedOutput;
        if (result.result === expected) {
          setOutput(prev => prev + '\n✅ Test Passed!');
        } else {
          setOutput(prev => prev + `\n❌ Expected: ${expected}`);
        }
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const submitCode = async () => {
    setIsLoading(true);
    setOutput('Evaluating SQL query...');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = executeSQL(code, questions[currentQuestion].testCases[0]);
      
      if (result.error) {
        setOutput(`Error: ${result.error}`);
      } else {
        const expected = questions[currentQuestion].testCases[0].expectedOutput;
        
        if (result.result === expected) {
          setOutput(`✅ Test case passed!\nQuery Result: ${result.result}\nExpected: ${expected}\n\n🎉 Query is correct! Moving to next question...`);
          setScore(prev => prev + 1);
          
          setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(prev => prev + 1);
            } else {
              setCompleted(true);
            }
          }, 2000);
        } else {
          setOutput(`❌ Test case failed!\nYour Result: ${result.result}\nExpected: ${expected}\n\nExplanation: ${questions[currentQuestion].testCases[0].explanation}`);
        }
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
          <h2>You've completed all SQL questions!</h2>
          <div className="score-card">
            <h3>Final Score: {score} / {questions.length}</h3>
            <p>You've mastered basic to intermediate SQL queries!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>SQL Coding Challenge</h1>
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
          
          <div className="schema-section">
            <h4>Database Schema:</h4>
            <pre className="schema">{sampleSchema}</pre>
          </div>

          <div className="test-cases">
            <h4>Expected Output:</h4>
            {questions[currentQuestion].testCases.map((testCase, index) => (
              <div key={index} className="test-case">
                <strong>Result:</strong> {testCase.expectedOutput}<br />
                <strong>Explanation:</strong> {testCase.explanation}
              </div>
            ))}
          </div>
        </div>

        <div className="editor-section">
          <div className="editor-header">
            <h3>SQL Query Editor</h3>
            <div className="editor-buttons">
              <button onClick={resetCode} disabled={isLoading}>Reset</button>
              <button onClick={runCode} disabled={isLoading}>Run Query</button>
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
            placeholder="Write your SQL query here..."
            disabled={isLoading}
            rows={8}
          />
          
          <div className="sql-tips">
            <h4>SQL Tips:</h4>
            <ul>
              <li>Use SELECT, FROM, WHERE, JOIN, GROUP BY, HAVING clauses</li>
              <li>Remember to use proper SQL syntax</li>
              <li>Test your queries before submitting</li>
              <li>Only SELECT queries are allowed (no DROP, DELETE, UPDATE)</li>
            </ul>
          </div>
          
          <div className="output-section">
            <h4>Execution Result:</h4>
            <pre className="output">{isLoading ? 'Executing query...' : output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQL;