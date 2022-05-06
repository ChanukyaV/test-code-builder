# Analytics Buddy

Repository for the Analytics buddy chrome extension.

## Overview

Analytics buddy is a chrome extension that will help us in developing automation scripts, running data flows at a time etc..

## Setup

1. Click on **Code** and **Download ZIP**.
2. Extract and place it in some folder(Ex: /Users/<user>/Desktop/extension/code-builder-master).
3. Go to **chrome://extensions/** in a Chrome tab and enable **Developer mode** in the top right.
4. Click **Load unpacked** button and select the extension directory(Ex: /Users/<user>/Desktop/extension/code-builder-master).
5. Click on the **Extensions** icon in the top right corner of the chrome browser and pin our Code Builder chrome extension to access it quickly.

## Features

### Code Steps

Before you start open the Options page of the extension by right clicking on the extension icon. Provide the css locators of the elements to be interacted if you have any specific ones or just copy **input, button, select, a, textarea** from the examples and paste it in the below text field.

Open the application where you want to automate the test script and click on the extension. From the menu items, choose **Code Steps** option and a custom event will be attached to the matched elements w.r.to the CSS locators we have given in the options page. The elements will be highlighted with the blue background to make it easy for the end user to identify.

Right click on one of the elements and you will get the options to interact with that element. After choosing the options, copy the code in the editor and use it in your test script.

### Pre-Review

It will help us in conducting pre-review for our PR based on team review guidelines. It will highlight violations with a coloured line and you can see the violation message by hovering on the line.
