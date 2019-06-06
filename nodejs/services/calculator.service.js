const express = require('express')
const bodyParser = require('body-parser')

const { CalculatorLocation } = require('../locations')

const operations = {
	'+': ({ x, y }) => x + y,
	'-': ({ x, y }) => x - y,
	'*': ({ x, y }) => x * y,
	'/': ({ x, y }) => x / y
}

let app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
	const operators_arr = Object.keys(operations)
	const code = 422

	let { operator, values } = req.body

	if (typeof operator == 'undefined')
		res.status(code).json({ type: 'MISSING_INPUT_ERROR', code, message: "Missing operator: please use one of the following operators.", data: operators_arr })
	else if (!operators_arr.includes(operator))
		res.status(code).json({ type: 'INVALID_INPUT_ERROR', code, message: "Invalid operator: please use one of the following operators.", data: operators_arr })
	else if (typeof values == 'undefined')
		res.status(code).json({ type: 'MISSING_INPUT_ERROR', code, message: "Missing input: please specify the field 'values'." })
	else if (typeof values.x == 'undefined')
		res.status(code).json({ type: 'MISSING_INPUT_ERROR', code, message: "Missing input: please specify the field 'values.x'." })
	else if (typeof values.y == 'undefined')
		res.status(code).json({ type: 'MISSING_INPUT_ERROR', code, message: "Missing input: please specify the field 'values.y'." })
	else if (operator == '/' && values.y == 0)
		res.status(code).json({ type: 'ZERO_DIVISION_ERROR', code, message: "Zero Division Error: tried to divide a number by 0." })
	else
		next()
})

app.post('/calculator', (req, res) => {
	let { operator, values } = req.body
	let result = operations[operator](values)

	console.log(`${values.x} ${operator} ${values.y} = ${result}`)
	res.json({ result })
})

app.listen( CalculatorLocation, () => { console.log(`Calculator service started.\nEndpoint: http://localhost:${CalculatorLocation}\n`) })
