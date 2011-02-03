#Overview
JDT stands for "JSON Driven templates", it is a tool for applying data presented in JSON hash on html structure, following the certain markup structure, defined by sequence on classes.
Html elements are placeholders for data, each of them have certain class which is "key" in JSON array so JDT knows where to place certain value.

So you have your data separated from presentation even more: html file shows how data is structured, JDT puts data in, CSS tells how this all stuff should look like.

#Why?
It makes life easier so you can write down one single line of markup example and JSON hash applied to it and all that will give you page with table full of data, i.e.
Needs in JDT are quite simple: you have tool that can give you possibility to show your data without page reload using small chunk of html basing on JSON server response.


#Usage 

###Simple example:

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

Notice that *level of nesting doesn't matter*: div.statistics might be any level deeper into div.library and JDT will handle it. Main point is that selectors structure must be respected.


JDT processing can be launched with 
  `JDT.process(json_data);`


###More complicated example:

####js:

    var json_data = { 
     'library' : {
       'statistics' : { 'books-count':'10', 'currently-reading':'madness.txt'},
       'books' : [
         {'name' : 'Amber 1', 'authors' : ['Zheliazny', 'Plasmazny', 'Zemlianyj'], 'summary':'The Amber story - book 1', 'genre' : 'science-fiction'},
         {'name' : 'Amber 2', 'authors' : ['Zheliazny'], 'summary':'The Amber story - book 2', 'genre' : 'science-fiction'},
         {'name' : 'Amber 3', 'authors' : ['Zheliazny'], 'summary':'The Amber story - book 3', 'genre' : 'science-fiction'},
         {'name' : 'Amber 4', 'authors' : ['Zheliazny'], 'summary':'The Amber story - book 4', 'genre' : 'science-fiction'},
         {'name' : 'Amber 5', 'authors' : ['Zheliazny'], 'summary':'The Amber story - book 5', 'genre' : 'science-fiction'}
       ],
       'shelfs' : [],
       'a-nema' : 'takogo'
     }
    }
    JDT.process(json_data);

####HTML:

    <div class="advanced_test library">
      <div class="statistics">
       I have <span class="books-count">0</span> books in my collection and i am currently reading : <span class="currently-reading">a book</span>
      </div>
      <table class="books">
        <tr class="listing-header">
          <th>name</th>
          <th>author</th>
          <th>summary</th>
          <th>genre</th>
        </tr>
        <tr class="book item">
          <td class="name"><span class="value">My Book</span><span class="item">wtf</span></td>
          <td class="authors"><em class="item">Vasil Pupkin</em><span class="delimiter">|</span></td>
          <td class="summary">It's a perfect book to fall asleep</td>
          <td class="genre">Sleeper</td>
        </tr>
        <tr class="book item">
          <td class="name"><span class="value">His Book</span><span class="item">wtf</span></td>
          <td class="authors"><em class="item">Diadia Bubkin</em><span class="delimiter">|</span></td>
          <td class="summary">It's the best book to fall asleep</td>
          <td class="genre">any</td>
        </tr>
      </table>
    </div>

##Usage variations

###Inputs

You can also use inputs so their values will be changed properly.

####js:
    container = jQuery(".input-test");
    data = {'color' : 'red', 'size' : 15 }
    JDT.process(data, container);


####html: 
    <div class="input-test">	
      <h2>input value test</h2>
      <span class="color"><input class="value" type="text" value="blue-template" /></span>
      <input class="size" type="text" value="10-template" />
    </div>

###Attributes

Or use JDT not only for text replacing. I.e. for assigning classes for elements.

####js:
    class_attribute_data = [
      {"object":{"class":"red"}},
      {"object":{"class":"green"}},
      {"object":{"class":"blue"}},
      {"object":{"class":"black"}}
    ]  
    JDT.process(class_attribute_data, jQuery('.class-attribute-test')); 

####html:

    <div class="class-attribute-test">
      <h2>"class" attribute test</h2>
      <div class="item object">
        JDT
      </div>
    </div>
  
###Raw HTML

You can request raw html (to paste smth like `<a href="#">link here</a>` but not just plain text). So just add `true` at the end of `JDT.process` call

####js:
    link_hash = [
      {"link": "<a href='#'>link here</a>"}
    ]  
    JDT.process(link_hash, jQuery('.link-wrapper'), true); 
  

##JSON creation rules

- Do not put extra comma ',' after last hash item (IE crashes because of it)

####Wrong:
    json_data = [
      {"key":"value1"},
      {"key":"value2"},
    ]  

####Right:
    json_data = [
      {"key":"value1"},
      {"key":"value2"}
    ]  
