      //1. Access DOM elements - para di na ma-reassign to diff value yung mga ininput ni user
      const inputBox = document.getElementById('input');
      const expressionDiv = document.getElementById('expression');
      const resultDiv = document.getElementById('result');

      //2. initialize expression and result variable - para ma-store yung mga ininput ni user
      let expression = '';
      let result = '';

      //3. para ma-detect yung mga ininput ni user
      function buttonClick(event) {
         //Get values from clicks buttons 
         const target = event.target;
         const action = target.dataset.action; 
         const value = target.dataset.value;
         //console.log(target, action, value);

         //5. switch case to control calculator  - para ma-determine yung mga ininput ni user
         switch (action) { 
            case 'number': 
               addValue(value); 
               break;
            case 'clear': //10. 
               clear(); 
               break;
            case 'backspace': //12.
               backspace();
               break;

            case 'addition': 
            case 'subtraction':
            case 'multiplication':
            case 'division': 
               if (expression === '' && result !== '') { 
                  startFromResult(value);
               }
               else if (expression !== '' && !isLastCharOperator()) {
                  addValue(value);
               }
               break;
            case 'sqrt':
               sqrt();
               break;
            case 'submit':
               submit();
               break;
            case 'negate':
               negate();
               break;
            case 'decimal':
               decimal(value);
               break;
         }

      //8. result itu. idi-display sa div #expression and #result
      updateDisplay(expression, result);
      }

      //4. Event listener - para ma-detect yung mga ininput ni user
      inputBox.addEventListener('click', buttonClick);

      //6.  - para ma-determine ulit yung mga ininput ni user
      function addValue(value) { 
         if (value === '.') {
         // Find the index of the last operator in the expression
         const lastOperatorIndex = expression.search(/[+\-*/]/);

         // Find the index of the last decimal in the expression
         const lastDecimalIndex = expression.lastIndexOf('.');

         // Find the index of the last number in the expression
         const lastNumberIndex = Math.max(
            expression.lastIndexOf('+'),
            expression.lastIndexOf('-'),
            expression.lastIndexOf('*'),
            expression.lastIndexOf('/')
         );

         // Check if this is the first decimal in the current number or if the expression is empty
         if (
            (lastDecimalIndex < lastOperatorIndex ||
               lastDecimalIndex < lastNumberIndex ||
               lastDecimalIndex === -1) &&
            (expression === '' ||
               expression.slice(lastNumberIndex + 1).indexOf('-') === -1)
         ) {
            expression += value;
         }
         } else {
         // Always add the value to the expression - this ensures numbers show up after √(
         expression += value;
         }
      }

      //9. 
      function updateDisplay(expression, result) {
         expressionDiv.textContent = expression;
         // Automatically evaluate and show result if expression is not empty
         if (expression !== '') {
            try {
               // Handle square root expressions
               let evalExpression = expression;
               if (expression.includes('√')) {
                  evalExpression = processSquareRootExpression(expression);
               }
               
               // Only try to evaluate if we have a complete expression
               if (evalExpression && evalExpression !== '' && !evalExpression.endsWith('√')) {
                  const evalResult = eval(evalExpression);
                  resultDiv.textContent = isNaN(evalResult) || !isFinite(evalResult)
                     ? ' '
                     : evalResult < 1
                     ? parseFloat(evalResult.toFixed(10))
                     : parseFloat(evalResult.toFixed(2));
               } else {
                  resultDiv.textContent = '';
               }
            } catch {
               resultDiv.textContent = '';
            }
         } else {
            // If expression is empty, clear the result display
            resultDiv.textContent = '';
         }
      }

      //11. 
      function clear() {
         expression ='';
         result = '';
      }

      //13. manipulate
      function backspace() {
         expression = expression.slice(0, -1);
      }

      function isLastCharOperator() {
         //parseInt can be converted into string
         return isNaN(parseInt(expression.slice(-1)));
      }

      function startFromResult(value) {
         expression +=result + value;
      }

      function submit() {
         result = evaluateExpression();
         // Set expression to result so backspace works after submit
         expression = result !== ' ' ? String(result) : '';
      }

      function evaluateExpression() {
         let evalExpression = expression;
         if (expression.includes('√(')) {
            evalExpression = processSquareRootExpression(expression);
         }
         
         const evalResult = eval(evalExpression);
         // checks if evalResult isNaN or infinite. It if is, return a space character ' '
         return isNaN(evalResult) || !isFinite(evalResult) 
         ? ' ' 
         : evalResult < 1 
         ? parseFloat(evalResult.toFixed(10))
         : parseFloat(evalResult.toFixed(2));
      }

      function negate() {
         // Negate the result if expression is empty and result is present
         if (expression === '' && result !== '') {
            result = -result;
         // Toggle the sign of the expression if its not already negative and its not empty
         }
         else if (!expression.startsWith('-') && expression !== '') {
            expression = '-' + expression;
         // Remove the negative sign from the expression if its already negative.
         }
         else if(expression.startsWith('-')) {
            expression = expression.slice(1);
         }
      }

      // square root function
      function sqrt() {
         // If expression is empty but result exists, start new expression with sqrt of result
         if (expression === '' && result !== '') {
            const number = parseFloat(result);
            if (number >= 0) {
               const sqrtResult = Math.sqrt(number);
               const formattedResult = sqrtResult < 1 ? parseFloat(sqrtResult.toFixed(10)) : parseFloat(sqrtResult.toFixed(2));
               result = formattedResult;
               expression = '';
            }
         }
         // If expression is empty and no result, start with sqrt symbol
         else if (expression === '' && result === '') {
            expression = '√';
         }
         // If expression ends with an operator, add sqrt symbol
         else if (expression !== '' && isLastCharOperator()) {
            expression += '√';
         }
         // If we're already in a sqrt function, don't add another
         else if (expression.includes('√') && !hasCompleteSqrtExpression()) {
            // Do nothing, we're already in sqrt mode
            return;
         }
         // If expression has numbers but no operators, replace with sqrt
         else if (expression !== '' && !isLastCharOperator() && !expression.includes('√')) {
            expression = '√' + expression;
         }
      }

      // Helper function to extract the last number and its position from expression
      function extractLastNumberInfo() {
         const operators = ['+', '-', '*', '/'];
         let lastOperatorIndex = -1;
         
         // Find the last operator, but skip the first character if it's a negative sign
         for (let i = expression.length - 1; i >= 1; i--) {
            if (operators.includes(expression[i])) {
               lastOperatorIndex = i;
               break;
            }
         }
         
         // If the first character is a negative sign and no other operators found
         if (lastOperatorIndex === -1 && expression.startsWith('-')) {
            const numberStr = expression.slice(1);
            const number = parseFloat(numberStr);
            return isNaN(number) ? { numberStr: null, startIndex: 0 } : { numberStr: '-' + numberStr, startIndex: 0 };
         }
         
         const startIndex = lastOperatorIndex + 1;
         const numberStr = expression.slice(startIndex);
         
         // Validate that it's a proper number
         const number = parseFloat(numberStr);
         return isNaN(number) ? { numberStr: null, startIndex: 0 } : { numberStr: numberStr, startIndex: startIndex };
      }

      // Process square root expressions for evaluation
      function processSquareRootExpression(expr) {
         // Replace √ followed by numbers with Math.sqrt(number)
         let processed = expr.replace(/√([0-9.]+)/g, 'Math.sqrt($1)');
         
         // Handle incomplete sqrt (just √ at the end)
         if (processed.endsWith('√')) {
            return processed.slice(0, -1); // Remove incomplete sqrt
         }
         
         return processed;
      }

      // Helper function to check if sqrt expression is complete
      function hasCompleteSqrtExpression() {
         const sqrtMatches = expression.match(/√([0-9.]+)/g);
         return sqrtMatches && sqrtMatches.length > 0;
      }

      function decimal(value) {
         if(!expression.endsWith('-') && !isNaN(expression.slice(-1))) {
            addValue(value);
         }

      }