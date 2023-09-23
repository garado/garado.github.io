---
title: "A NEW HAND TOUCHES THE BEACON."
date: 2023-09-22
categories: ["projects", "embedded"]
draft: true
---

*Listen. Hear me and obey. A foul darkness has seeped into my temple. A darkness that you will destroy.*

For this small project I built Meridia's beacon, a quest item from the video game Skyrim that appears at a random time in a random chest and upon pickup causes a disembodied voice to rather loudly announce a new quest at you. It's become a meme and I thought it would be funny and not too hard to make. It took about an hour.

{{< video src="prototype.mp4" >}}

# Pick up detection
I constructed a beam break out of a couple IR sensors I had lying around. The poorly 3D printed Meridia's beacon is placed between the two, and pickup gets detected on the rising edge of the IR receiver output when the beacon is lifted and the beam is no longer broken. I went with this method mostly because I already had the parts. My second fancier option would have been to put a magnet inside the beacon and have a Reed switch on the surface below it, but then I'd have to pay for some Reed switches.

# Audio playback
After converting the audio to a WAV file, I used an online tool to convert it to a C header file with an array containing the voltages for the audio. I then used the ESP32's onboard DAC to play the audio from the array and sent it to an 8ohm speaker. I previously had a low pass filter thrown on at the end to reduce noise, but I think the effect is better (and also more true to the game) when the audio is a little distorted so I removed it.

# Further improvements
- I'd like to make it more presentable by hiding the components inside a 3D printed treasure chest.
- It would be cool to detect exactly when the beacon is touched, not just lifted, but that's not very accurate to the game and I'd also need to get a capacitive sensor.
- I want to make it battery-powered and try to figure out the lowest power way to pull this off.
