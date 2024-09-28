# SMC-TouchControls
Adds touch support for Super Mario Construct!

Download [smcmobile.user.js](https://winrarisyou.github.io/SMC-TouchControls/smcmobile.user.js), add it to your userscript manager of choice, and voila touch controls!

# Installation
## Automatic (PC)
This is if you have a PC/laptop with a touchscreen display
### Step 1.
Go to [The Chrome Webstore](https://chromewebstore.google.com), and search tampermonkey and click on the first result (it should be featured)

![image](images/2a.png)

Then install it by clicking Add to Chrome/Edge/Opera/Whatever your browser is.

### Step 2.
Once installed, go to to [this page (you're already there)](https://winrarisyou.github.io/SMC-TouchControls) and click on smcmobile.user.js

![image](images/3a.png)

### Step 3.
It should bring up a popup that looks like this, and just press install and you're done :)

![image](images/4a.png)

It'll be active the next time you open SMC.

## Manual (PC)
### Step 1.
If for some reason, the userscript isn't automatically installed when you click on the link, go to [this page](https://github.com/WINRARisyou/SMC-TouchControls/blob/main/smcmobile.user.js), and press the copy button

![image](images/3m.png)

### Step 2.
Open up the tampermonkey dashboard by pressing the puzzle piece in the top right, pressing Tampermonkey and hitting dashboard
![image](images/1m.png)
![image](images/2m.png)

### Step 3.
Finally, paste in the code from Step 1, press file and save, and you're done :D

![image](images/4m.png)
## Mobile (Android Firefox)
## Automatic
<video controls width="25%" src="images/mobile-automatic.mp4" title="Title"></video>

## Manual
<video controls width="25%" src="images/mobile-manual.mp4" title="Title"></video>

## Mobile (Chrome)
Create a bookmark for this page, and before the popup on the bottom of the screen disappears, tap on it and edit the url to use [this link](javascript://(function () { var script = document.createElement('script'); script.src="https://winrarisyou.github.io/SMC-TouchControls/smcmobile.user.js"; document.body.append(script);})();), and then once in SMC, tap on the address bar and start typing the name you set for the bookmarklet, and click on the one that starts with javascript://