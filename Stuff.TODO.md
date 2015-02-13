# Site
* ☐ update page trolling vocab lists and post files to create json indexes update editor to ping that in hidden iframe rather than depend on editor
* ☐ remove footer
* ☐ update css
* ☐ add blog
* ☐ add resources
* ☐ do tag links to index page
* ☐ update welcome page content and images
* ☐ domain name
* ☐ word finder puzzle
* ☐ suduku
* ☐ flash card app

# Editor

## Code
* ☐ Build
* ☐ Tests
* ☐ Tidy up marionette view-model binding

## UI Basic Functionality 
* ✔ Editor resizing @done (15-02-03 18:42)
* ✔ Mode selector @done (15-01-27 14:44)
* ✔ Save to github @done (15-02-03 18:42)
* ✔ Wylie modes @done (15-01-28 17:55)
* ✔ Restore bootstrap theme @done (15-02-12 18:46)
* ☐ Wylie theme
* ✔ routes (11-02-12 12:48)
* ☐ preview toolbar
    * ✔ save @done (15-02-12 12:48)
    * ✔ format @done (15-02-12 12:48)
    * ☐ export
* ☐ acknowledgment page
* ☐ help pages
* ☐ zen mode
* ✔ fullscreen toggle icon @done (15-01-27 12:25)
* ✔ use ace documents and session @done (15-02-03 18:42)
* ✔ code highlighting @done (15-01-25 22:49)
* ✔ file open should use editor state and mode @done (15-02-12 12:47)
* ☐ Reinstate Code Hi-lighting
* ☐ contrast editor styling for accessibility

## Markdown
* ☐ xslt
* ✔ tables @done (15-01-27 12:04)
* ✔ code @done (15-01-25 22:48)
* ✔ wylie blocks @done (15-01-27 12:04)
* ✔ wylie blocks again sigh @done (15-01-28 17:55)
* ☐ implement remaining wylie rules
* ✔ fix wylie blocks if last in text which fail to render @done (15-01-28 17:55)
* ☐ format to show help/doc icon instead of Format label

### Private Mode

#### Save to
* ☐ Dropbox
* ☐ Github
* ☐ Google Drive
* ☐ OneDrive

#### Formats
* ☐ open word doc
* ☐ Peche pdf (zeLaTex and pdf preview)
    * ☐ 1 column
    * ☐ 2 column
    * ☐ 3 column
* ☐ simple pdf (zeLaTex and pdf preview)
    * ☐ mixed
    * ☐ page by page dual language
* ☐ book pdf (zeLaTex and pdf preview and xml)

### Contrib Mode
* ☐ move category out of save dialog and use mode to set both doc name and category and format
* ☐ lesson pdf format
* ☐ vocab list pdf format
* ☐ add attribute for contrib/private mode and hide or display as whole in top level view
    * ☐ hide 
        * ☐ export
        * ☐ import
        * ☐ wylie mode
        * ☐ mixed mode
    * ☐ show
        * ☐ lesson mode and correct formats
        * ☐ vocab mode and correct formats
        * ☐ reading mode and correct formats
* ☐ vocab list option 
    * ☐ simple markdown table e.g
        |wylie |root letter|english|phonetics|categegory|notes|
        |------|-----------|-------|---------|----------|-----|
        |rdorje|d.         |sceptre|Dorjay.  |noun.     |blah |
    * ☐ pre-process table to generate json vocab list
    * ☐ post-process as template of two bootstrab tabs one for table and other for dictionary list and hidden div to hold json
* ☐ reading option
    * ☐ add additional editors for each of wylie,translation,notes,and vocab with toggle button bar to flip view. update of resoective editor updates main editor using template of various div sections. hidden divs for wylie, word list, enhanced marked up uchen
* ☐ process wylie for enhanced markup
    * ☐ split on space, iterate array pushing all possible word matches from site dictionary
    * ☐ sort possible word matches from largest to smallest matches
    * ☐ iterate word match list marking up for tooltip, hi-lighting, phonetics under display, simple english under display

# Useful Readings
* ☐ Beautify forms http://www.tutorialrepublic.com/twitter-bootstrap-tutorial/bootstrap-forms.php
* ☐ http://www.abeautifulsite.net/whipping-file-inputs-into-shape-with-bootstrap-3/
* ☐ http://authenticff.com/journal/building-large-scale-backbone-marionette-applications
* ☐ http://lostechies.com/derickbailey/2011/07/24/awesome-model-binding-for-backbone-js/
* ☐ local storage support http://diveintohtml5.info/storage.html