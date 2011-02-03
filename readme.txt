JDT stands for "JSON Driven templates", it is a tool for applying data presented in JSON hash on html structure, following the certain markup structure, defined by sequence on classes.
Html elements are placeholders for data, each of them have certain class which is "key" in JSON array so JDT knows where to place certain value.

Example: 

  var json_data = { 
   'library' : {
     'statistics' : { 'books-count':'10', 'currently-reading':'madness.txt'}
  }

This hash will fill with data html markup similar to following:

  <div class="advanced_test library">
    <div class="statistics">
      I have <span class="books-count">0</span> books in my collection and i am currently reading : <span class="currently-reading">a book</span>
    </div>
  </div>

Notice that level of nesting doesn't matter: div.statistics might be any level deeper into div.library and JDT will handle it. Main point is that selectors structure must be respected.


JDT processing can be launched with 
  JDT.process(json_data);

---------------------------------------------------------------------------------------

JSON creation rules

 - Do not put extra comma ',' after last hash item (IE crashes because of it)

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
