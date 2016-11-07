# Undertone: Poetry in Color
[Undertone](http://undertone.surge.sh/) is a website for adding a visual component to the presentation of poetry. A user is able to search for poems available through the [poetryDB API](http://poetrydb.org/index.html) and is presented with a stanza-by-stanza visual presentation of the poetry based on tone analysis data for the poem.

![Anger](/img/readme/angerTone.png)

The colors in the background shift depending on the tones of the entire poem and the current stanza. Tones are analyzed using [IBM Watson Tone Analyzer](http://www.ibm.com/watson/developercloud/tone-analyzer.html), and the shapes moving on the screen are generated using [particles.js](http://vincentgarreau.com/particles.js/).

## Usage
### Selecting a Poem
Using the search dialogue accessed through the navigation bar, a user can input a poet, poem title, or both to pull up a list of poems that match their criteria.

<img src="/img/readme/searchDialogue.png" width="600"> 

Clicking on the name of a poem in the list will display the poem in its entirety. Pressing the select button next to a poem's name will proceed to analysis.

<img src="/img/readme/searchResults.png" width="600">

### Analysis
After pressing the begin button, the left and right arrows on the screen can be used to switch between stanzas of the poem.
Keyboard arrow keys include this functionality as well. Each stanza has a tone which displays in the upper right corner.

![Joy](/img/readme/henleyJoy.png)

The color of the particles in the background reflects the tone of the entire poem, while the color of the background shifts depending on the tone of each stanza. For example, a stanza with a sad tone in a poem with a joyous tone will have a blue background with yellow particles.

![Sadness](/img/readme/henleySad.png)

Pressing the "X" in the upper left corner will take the user back to the homepage.

### Other Functionality
The navigation bar also includes links to enter in custom text for analysis or select a random poem. Custom text must be input as blocks of writing separated by a blank line. An example is below.
> This is a single stanza of poetry.
>
> This is another stanza of poetry.
>
> The blank lines in between separate the stanzas for analysis.

## Tone Colors
* Anger - Red
* Disgust - Purple
* Fear - Green
* Joy - Yellow
* Sadness - Blue
