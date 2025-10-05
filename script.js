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
            case 'modulus':
               // Allow modulus to be chained between numbers
               if (expression === '' && result !== '') {
                  startFromResult('%');
               } else if (expression !== '' && !isLastCharOperator()) {
                  addValue('%');
               }
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
         expression += value;
         }
      }

      //9. 
      function updateDisplay(expression, result) {
         expressionDiv.textContent = expression;
         // Automatically evaluate and show result if expression is not empty
         if (expression !== '') {
            try {
               const evalResult = eval(expression);
               resultDiv.textContent = isNaN(evalResult) || !isFinite(evalResult)
                  ? ' '
                  : evalResult < 1
                  ? parseFloat(evalResult.toFixed(10))
                  : parseFloat(evalResult.toFixed(2));
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
         const evalResult = eval(expression);
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

      // percentage function is not needed for chained modulus, but keep for legacy single number percentage
      function percentage() {
         // If expression is empty but the result exists, divide by 100
         if (expression === '' && result !== '') {
            result = parseFloat(result) / 100;
         }
         // Otherwise, modulus is handled by eval in updateDisplay
      }

      function decimal(value) {
         if(!expression.endsWith('-') && !isNaN(expression.slice(-1))) {
            addValue(value);
         }

      }