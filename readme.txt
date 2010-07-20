JSON creation rules

1. Do not put comma ',' after last array element (IE crashes because of it)

Wrong:
json_data = [
	{"key":"value1"},
  {"key":"value2"},
]	

Right:
json_data = [
	{"key":"value1"},
  {"key":"value2"}
]	

*---------------------------------------------------------------------------------------*

2. 